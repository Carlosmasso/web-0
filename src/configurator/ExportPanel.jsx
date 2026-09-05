import { useMemo, useState } from 'react'
import { exportBundle, downloadArtifact } from '../theme/export'
import { buildProjectFiles } from '../export/scaffold'
import { downloadProjectZip } from '../export/zip'
import { auditConfig } from '../config/guardrails'

// Cajón técnico: para DESPUÉS de que el cliente te haya escrito con
// "Quiero esta web". No es la vitrina — es donde tú entregas.
export function ExportPanel({ config, content, violations = [], open, onClose }) {
  const artifacts = useMemo(() => exportBundle(config), [config])
  const audit = useMemo(() => auditConfig(config), [config])
  const [tab, setTab] = useState(0)
  const [copied, setCopied] = useState(false)
  const [zipping, setZipping] = useState(false)

  const current = artifacts[tab]

  const copy = async () => {
    await navigator.clipboard.writeText(current.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const downloadProject = async () => {
    setZipping(true)
    try {
      const { files, projectName } = buildProjectFiles(config, content)
      await downloadProjectZip(files, projectName)
    } finally {
      setZipping(false)
    }
  }

  return (
    <div className={`xport ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="xport__bar">
        <div>
          <h2>Entregar</h2>
          <p>Para cuando el encargo ya es tuyo: el proyecto real, o solo los tokens.</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar">
          Cerrar
        </button>
      </div>

      <div className="xport__project">
        <div>
          <strong>Proyecto completo</strong>
          <span>React + Vite, con este contenido ya puesto. Recuerda cambiarlo por el del cliente antes.</span>
        </div>
        <button type="button" className="xport__project-btn" onClick={downloadProject} disabled={zipping}>
          {zipping ? 'Empaquetando…' : 'Descargar .zip'}
        </button>
      </div>

      <div className="xport__tabs" role="tablist">
        {artifacts.map((a, i) => (
          <button
            key={a.filename}
            type="button"
            role="tab"
            aria-selected={i === tab}
            className={i === tab ? 'is-active' : ''}
            onClick={() => setTab(i)}
          >
            {a.filename}
          </button>
        ))}
      </div>

      <div className="xport__actions">
        <button type="button" onClick={copy}>
          {copied ? 'Copiado' : 'Copiar'}
        </button>
        <button type="button" onClick={() => downloadArtifact(current)}>
          Descargar
        </button>
      </div>

      <pre className="xport__code">
        <code>{current.content}</code>
      </pre>

      <div className="xport__audit">
        <h3>Accesibilidad</h3>
        <ul>
          {audit.map((a) => (
            <li key={a.label} className={a.pass ? 'is-pass' : 'is-fail'}>
              <span>{a.label}</span>
              <b>
                {a.ratio}:1 <em>/ {a.target}</em>
              </b>
            </li>
          ))}
        </ul>
        {violations.length > 0 && (
          <>
            <h3>Ajustes automáticos</h3>
            <ul className="xport__violations">
              {violations.map((v, i) => (
                <li key={`${v.path}-${i}`}>
                  <span>
                    <code>{v.path}</code> {v.fromLabel} → <b>{v.toLabel}</b>
                  </span>
                  <em>{v.reason}</em>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
