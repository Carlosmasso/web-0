// Monta los fotogramas JPEG del screencast en un MP4 H.264.
//
// El screencast entrega fotogramas irregulares (Chrome solo emite cuando hay
// repintado), así que aquí se remuestrea a fps constante: para cada instante
// k/fps se escribe el fotograma vigente. Eso da un MP4 que cualquier
// reproductor —y LinkedIn— digiere sin sorpresas.
//
//   swiftc -O mux.swift -o mux && ./mux manifest.json frames salida.mp4 30

import AVFoundation
import CoreGraphics
import Foundation
import ImageIO

struct Frame {
    let file: String
    let t: Double
}

let args = CommandLine.arguments
guard args.count >= 4 else {
    FileHandle.standardError.write("uso: mux <manifest.json> <dir-frames> <salida.mp4> [fps]\n".data(using: .utf8)!)
    exit(2)
}
let manifestPath = args[1]
let framesDir = args[2]
let outPath = args[3]
let fps = args.count > 4 ? Double(args[4]) ?? 30 : 30
// Recorte opcional: segundos iniciales/finales a descartar.
let trimStart = args.count > 5 ? Double(args[5]) ?? 0 : 0
let trimEnd = args.count > 6 ? Double(args[6]) ?? 0 : 0

guard let data = FileManager.default.contents(atPath: manifestPath),
      let raw = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]]
else {
    FileHandle.standardError.write("manifiesto ilegible\n".data(using: .utf8)!)
    exit(1)
}

var frames: [Frame] = raw.compactMap {
    guard let f = $0["file"] as? String, let t = $0["t"] as? Double else { return nil }
    return Frame(file: f, t: t)
}.sorted { $0.t < $1.t }

guard !frames.isEmpty else {
    FileHandle.standardError.write("sin fotogramas\n".data(using: .utf8)!)
    exit(1)
}

let total = frames[frames.count - 1].t
let from = trimStart
let to = max(from + 1, total - trimEnd)

func loadCG(_ name: String) -> CGImage? {
    let url = URL(fileURLWithPath: framesDir).appendingPathComponent(name)
    guard let src = CGImageSourceCreateWithURL(url as CFURL, nil) else { return nil }
    return CGImageSourceCreateImageAtIndex(src, 0, [kCGImageSourceShouldCache: false] as CFDictionary)
}

guard let first = loadCG(frames[0].file) else {
    FileHandle.standardError.write("no se puede leer el primer fotograma\n".data(using: .utf8)!)
    exit(1)
}
// Dimensiones pares, que H.264 lo exige.
let W = first.width - (first.width % 2)
let H = first.height - (first.height % 2)
print("fotogramas: \(frames.count) · \(W)x\(H) · \(String(format: "%.1f", to - from))s a \(Int(fps)) fps")

let outURL = URL(fileURLWithPath: outPath)
try? FileManager.default.removeItem(at: outURL)

let writer = try AVAssetWriter(outputURL: outURL, fileType: .mp4)
let settings: [String: Any] = [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: W,
    AVVideoHeightKey: H,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: 9_000_000,
        AVVideoMaxKeyFrameIntervalKey: Int(fps * 2),
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        AVVideoAllowFrameReorderingKey: true,
    ],
]
let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
input.expectsMediaDataInRealTime = false
let attrs: [String: Any] = [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
    kCVPixelBufferWidthKey as String: W,
    kCVPixelBufferHeightKey as String: H,
]
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: attrs)
writer.add(input)
writer.startWriting()
writer.startSession(atSourceTime: .zero)

let colorSpace = CGColorSpaceCreateDeviceRGB()

func buffer(from image: CGImage) -> CVPixelBuffer? {
    guard let pool = adaptor.pixelBufferPool else { return nil }
    var pb: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(kCFAllocatorDefault, pool, &pb)
    guard let px = pb else { return nil }
    CVPixelBufferLockBaseAddress(px, [])
    defer { CVPixelBufferUnlockBaseAddress(px, []) }
    guard let ctx = CGContext(
        data: CVPixelBufferGetBaseAddress(px),
        width: W, height: H, bitsPerComponent: 8,
        bytesPerRow: CVPixelBufferGetBytesPerRow(px),
        space: colorSpace,
        bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue
    ) else { return nil }
    ctx.draw(image, in: CGRect(x: 0, y: 0, width: W, height: H))
    return px
}

let timescale: Int32 = 600
let steps = Int(((to - from) * fps).rounded())
var cursor = 0
var lastIndex = -1
var lastBuffer: CVPixelBuffer?
let queue = DispatchQueue(label: "mux")
let done = DispatchSemaphore(value: 0)

input.requestMediaDataWhenReady(on: queue) {
    while input.isReadyForMoreMediaData {
        if cursor >= steps {
            input.markAsFinished()
            done.signal()
            return
        }
        let t = from + Double(cursor) / fps
        // fotograma vigente en ese instante
        var idx = lastIndex < 0 ? 0 : lastIndex
        while idx + 1 < frames.count && frames[idx + 1].t <= t { idx += 1 }

        if idx != lastIndex || lastBuffer == nil {
            if let img = loadCG(frames[idx].file), let px = buffer(from: img) {
                lastBuffer = px
                lastIndex = idx
            }
        }
        guard let px = lastBuffer else { cursor += 1; continue }
        let pts = CMTime(value: CMTimeValue(Double(cursor) / fps * Double(timescale)), timescale: timescale)
        if !adaptor.append(px, withPresentationTime: pts) {
            FileHandle.standardError.write("fallo al escribir en \(cursor): \(String(describing: writer.error))\n".data(using: .utf8)!)
            input.markAsFinished()
            done.signal()
            return
        }
        cursor += 1
        if cursor % 300 == 0 {
            print("  \(cursor)/\(steps)")
            fflush(stdout)
        }
    }
}

done.wait()
let finished = DispatchSemaphore(value: 0)
writer.finishWriting { finished.signal() }
finished.wait()

if writer.status == .completed {
    let size = (try? FileManager.default.attributesOfItem(atPath: outPath)[.size] as? Int) ?? 0
    print("listo: \(outPath) · \(String(format: "%.1f", Double(size ?? 0) / 1_048_576)) MB")
} else {
    FileHandle.standardError.write("writer: \(String(describing: writer.error))\n".data(using: .utf8)!)
    exit(1)
}
