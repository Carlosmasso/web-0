import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { track } from "../config/analytics";
import { encodeConfig, encodeContent } from "../config/encode";
import { normalizeConfigWithGuardrails } from "../config/guardrails";
import { isStudio, STUDIO_QUERY } from "../config/mode";
import { deepMerge, setIn } from "../config/patch";
import { DEFAULT_CONFIG, SECTION_ORDER } from "../config/schema";
import { DEFAULT_CONTENT } from "../content/defaults";
import { ErrorBoundary } from "../ErrorBoundary";
import { Icon } from "../preview/Icon";
import { getAesthetic } from "../registry/aesthetics";
import { getTypePairing } from "../registry/fonts";
import { safePalette } from "../theme/color";
import { randomConfig } from "../theme/randomize";
import { ContactModal } from "./ContactModal";
import { ContentForm } from "./ContentForm";
import { openIncomingDesign } from "./incoming";
import { PreviewFrame } from "./PreviewFrame";
import { ProjectMenu } from "./ProjectMenu";
import {
  createProject,
  deleteProject,
  ensureSeeded,
  freeName,
  listProjects,
  MAX_VERSIONS,
  readProject,
  renameProject,
  runContentMigrations,
  setActiveId,
  writeProject,
} from "./projects";
import { Sidebar } from "./Sidebar";
import { isTourDone, markTourDone, Tour, TOUR_STEPS } from "./Tour";
import { useHistory } from "./useHistory";

// Cómo se llama lo primero que se guarda, según quién mire. El cliente tiene
// UNA web con versiones; tú tienes un proyecto por cliente.
const FIRST_NAME = isStudio ? "Proyecto 1" : "Mi web";

export function App() {
  // Todo el mundo trabaja sobre el registro: tú con varios proyectos, el
  // cliente con las versiones de su web. Un `?c=` en la URL se resuelve contra
  // lo guardado antes de arrancar (ver `openIncomingDesign`).
  const [projectId, setProjectId] = useState(() => {
    const seeded = ensureSeeded(FIRST_NAME);
    // Después de sembrar, para que alcance también a lo recién migrado de las
    // claves antiguas; antes de leer el contenido, unas líneas más abajo.
    runContentMigrations();
    return openIncomingDesign(
      new URLSearchParams(window.location.search).get("c"),
      seeded,
    );
  });
  const [registryTick, bumpRegistry] = useReducer((n) => n + 1, 0);

  const {
    state: raw,
    set: setRaw,
    reset: resetHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory(() => readProject(projectId).config);
  const [content, setContent] = useState(() => readProject(projectId).content);
  const [mode, setMode] = useState("design");
  // El panel de diseño va en tres pasos (ver Sidebar). El paso vive aquí porque
  // el tour necesita llevar al usuario de uno a otro mientras explica.
  const [designStep, setDesignStep] = useState("start");
  const [device, setDevice] = useState("desktop");
  const [zipping, setZipping] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showTour, setShowTour] = useState(false);
  // ---- la hoja del panel en móvil ----
  //
  // En móvil el lienzo manda: ocupa la parte de arriba y no se mueve, y el
  // panel vive en una hoja que sube y baja. Arranca asomada, con los pasos y
  // los primeros presets a la vista, para que el primer gesto ya cambie algo
  // que se ve. Antes esto se apilaba y la web quedaba bajo el pliegue: nadie
  // llegaba a ver cambiar nada, que es lo único que vende el producto.
  const [hoja, setHoja] = useState("peek");
  const hojaRef = useRef(null);
  const [copied, setCopied] = useState(null);
  // El guardado puede fallar de verdad: `localStorage` tiene cuota y las fotos
  // subidas van dentro del contenido. Callarlo dejaría al usuario tocando cosas
  // que ya no se guardan.
  const [saveFailed, setSaveFailed] = useState(false);
  const copiedTimer = useRef(null);
  const frameRef = useRef(null);

  const projects = useMemo(() => listProjects(), [projectId, registryTick]);
  const active = projects.find((p) => p.id === projectId);
  // El selector solo aparece cuando hay algo entre lo que elegir: con una sola
  // versión, el cliente ve la marca de siempre y ningún concepto nuevo.
  // const showPicker = isStudio || projects.length > 1
  const atVersionCap = !isStudio && projects.length >= MAX_VERSIONS;

  // El panel edita la configuración CRUDA, pero muestra y envía la NORMALIZADA.
  // Así el usuario ve al instante lo que los guardarraíles han corregido, en vez
  // de que su elección se revierta en silencio al llegar al lienzo.
  const { config, violations } = useMemo(
    () => normalizeConfigWithGuardrails(raw),
    [raw],
  );

  const encoded = useMemo(() => encodeConfig(config), [config]);

  useEffect(() => {
    setSaveFailed(!writeProject(projectId, { config: raw, content }));
    const url = new URL(window.location.href);
    url.searchParams.set("c", encoded);
    window.history.replaceState(null, "", url);
  }, [raw, content, encoded, projectId]);

  useEffect(
    () => () => {
      clearTimeout(copiedTimer.current);
      clearTimeout(focusTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!isStudio) track("configurator_opened");
  }, []);

  // Tour de bienvenida: la primera vez que se abre (en cualquier modo), tras un
  // respiro para que el preview haya cargado. Una vez visto, no vuelve solo;
  // el botón "¿Cómo funciona?" o `?tour` lo relanzan.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("tour")) {
      setShowTour(true);
      return undefined;
    }
    if (isTourDone()) return undefined;
    const t = setTimeout(() => setShowTour(true), 700);
    return () => clearTimeout(t);
  }, []);

  // Abrir el tour pasea por los tres pasos; al cerrarlo se devuelve al usuario
  // donde estaba, que puede haber lanzado la ayuda a mitad de un ajuste.
  const stepBeforeTour = useRef("start");
  const modeBeforeTour = useRef("design");

  const openTour = useCallback(() => {
    stepBeforeTour.current = designStep;
    modeBeforeTour.current = mode;
    setMode("design");
    setShowTour(true);
  }, [designStep, mode]);

  const closeTour = useCallback(() => {
    setShowTour(false);
    markTourDone();
    setDesignStep(stepBeforeTour.current);
    setMode(modeBeforeTour.current);
  }, []);

  // Deshacer / rehacer con teclado. Solo sobre el diseño: si el foco está en un
  // campo de texto, se cede el atajo al deshacer nativo del propio campo.
  useEffect(() => {
    const onKey = (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "z") return;
      const t = e.target;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  /* ---- edición ---- */

  const set = useCallback(
    (path, value) => setRaw((prev) => setIn(prev, path, value)),
    [],
  );
  const merge = useCallback(
    (patch) => setRaw((prev) => deepMerge(prev, patch)),
    [],
  );

  const applyPreset = useCallback((preset) => {
    setRaw(structuredClone(preset.config));
    if (!isStudio) track("preset_applied", { preset: preset.id });
  }, []);

  const applyType = useCallback(
    (id) =>
      merge({ typography: getTypePairing(id).values, meta: { typeId: id } }),
    [merge],
  );

  /** MÓDULO 4.2 en acción: el usuario solo elige el color de marca. */
  const setBrandColor = useCallback(
    (hex, nextMode) => {
      const scheme =
        nextMode ?? (raw?.meta?.mode === "dark" ? "dark" : "light");
      merge({ palette: safePalette(hex, { scheme }), meta: { mode: scheme } });
    },
    [merge, raw],
  );

  const surprise = useCallback(() => setRaw(randomConfig()), []);

  const openContact = useCallback(() => {
    setShowContact(true);
    if (!isStudio) track("contact_opened");
  }, []);

  /** Cambia solo el acabado, conservando paleta, tipografía y estructura. */
  const switchAesthetic = useCallback(
    (id) => {
      const { patch } = getAesthetic(id);
      merge({ aesthetic: id, ...patch, meta: { aestheticId: id } });
    },
    [merge],
  );

  /* ---- secciones: visibilidad y orden ---- */

  const toggleSection = useCallback((type) => {
    if (type === "hero") return;
    setRaw((prev) => {
      const order = prev.sectionOrder?.length
        ? prev.sectionOrder
        : SECTION_ORDER;
      const next = order.includes(type)
        ? order.filter((t) => t !== type)
        : [...order, type];
      return setIn(prev, "sectionOrder", next);
    });
  }, []);

  const moveSection = useCallback((type, dir) => {
    setRaw((prev) => {
      const order = [
        ...(prev.sectionOrder?.length ? prev.sectionOrder : SECTION_ORDER),
      ];
      const i = order.indexOf(type);
      const j = i + dir;
      // el hero (índice 0) no se cruza
      if (i < 1 || j < 1 || j >= order.length) return prev;
      [order[i], order[j]] = [order[j], order[i]];
      return setIn(prev, "sectionOrder", order);
    });
  }, []);

  /* ---- proyectos (solo estudio) ---- */

  const switchProject = useCallback(
    (id) => {
      const p = readProject(id);
      setActiveId(id);
      setProjectId(id);
      resetHistory(p.config);
      setContent(p.content);
    },
    [resetHistory],
  );

  const newProject = useCallback(() => {
    const id = createProject(
      isStudio
        ? `Proyecto ${listProjects().length + 1}`
        : freeName("Versión", 2),
      {
        config: structuredClone(DEFAULT_CONFIG),
        // "En blanco" es el DISEÑO, no los textos: de cara al cliente, perder el
        // nombre del negocio y los enlaces del menú por probar otra idea sería
        // una trampa. En estudio sí arranca todo limpio — ahí un proyecto nuevo
        // es otro cliente, no otra versión de la misma web.
        content: isStudio
          ? structuredClone(DEFAULT_CONTENT)
          : structuredClone(content),
      },
    );
    switchProject(id);
    if (!isStudio) track("version_created");
  }, [switchProject, content]);

  /** El "Guardar otra versión" del cliente y el "Duplicar" del estudio son lo
      mismo por dentro: una copia de lo que hay en pantalla, con su nombre. */
  const duplicateProject = useCallback(() => {
    const current = listProjects().find((p) => p.id === projectId);
    const name = isStudio
      ? `${current?.name ?? "Proyecto"} (copia)`
      : freeName("Versión", 2); // la primera web no lleva número: "Mi web"
    const id = createProject(name, { config: raw, content });
    switchProject(id);
    if (!isStudio) track("version_saved");
  }, [projectId, raw, content, switchProject]);

  // Renombrar solo toca localStorage; el bump fuerza el re-render para que el
  // menú muestre el nombre nuevo.
  const renameCurrent = useCallback(
    (name) => {
      renameProject(projectId, name);
      bumpRegistry();
    },
    [projectId],
  );

  const deleteCurrent = useCallback(() => {
    const rest = listProjects().filter((p) => p.id !== projectId);
    if (!rest.length) return;
    deleteProject(projectId);
    switchProject(rest[0].id);
  }, [projectId, switchProject]);

  /**
   * Señala en el lienzo qué parte del sitio toca el control que se está mirando.
   *
   * Con retardo al encender: barrer el puntero por la lista de controles
   * encendería y apagaría el foco decenas de veces. Apagar es inmediato, para
   * que salir del panel no deje el resaltado colgando.
   *
   * Iluminar NUNCA desplaza el lienzo. Ir hasta allí es `revealInPreview`,
   * que solo se dispara con un clic deliberado.
   */
  const focusTimer = useRef(null);
  const revealLock = useRef(0);

  const focusInPreview = useCallback((affects) => {
    // Un "Ver" reciente manda: al pulsarlo, el puntero acaba encima de otros
    // controles mientras el panel se recoloca, y esos hover robaban o apagaban
    // el resaltado que el usuario acababa de pedir a propósito.
    if (Date.now() < revealLock.current) return;
    clearTimeout(focusTimer.current);
    if (!affects) {
      frameRef.current?.focus(null);
      return;
    }
    focusTimer.current = setTimeout(
      () => frameRef.current?.focus(affects),
      140,
    );
  }, []);

  const revealInPreview = useCallback((affects) => {
    clearTimeout(focusTimer.current);
    // Cubre la duración del desplazamiento suave.
    revealLock.current = Date.now() + 900;
    frameRef.current?.focus({ ...affects, scrollTo: Date.now() });
  }, []);

  /* ---- exportación ---- */

  const flash = (key) => {
    setCopied(key);
    clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(null), 1600);
  };

  // El enlace lleva diseño + contenido (textos, secciones, imágenes por URL).
  // Las imágenes subidas se quedan fuera: un data URI no cabe en una URL.
  const previewLink = useMemo(
    () =>
      `${window.location.origin}/preview.html#${encoded}~${encodeContent(content)}`,
    [encoded, content],
  );

  // Para ti: abre el preview de ese diseño en modo estudio, con el botón de
  // "Descargar proyecto (.zip)". Lleva config + contenido (imágenes subidas no).
  const editLink = useMemo(
    () =>
      `${window.location.origin}/preview.html${STUDIO_QUERY}#${encoded}~${encodeContent(content)}`,
    [encoded, content],
  );

  const copyLink = async () => {
    await navigator.clipboard.writeText(previewLink);
    flash("link");
  };

  /**
   * Arrastre de la hoja.
   *
   * El desplazamiento se escribe DIRECTAMENTE sobre el nodo mientras dura el
   * gesto. Si pasara por estado de React, cada píxel del dedo provocaría un
   * render del panel entero y en un teléfono se vería a tirones. Al soltar,
   * React recupera el mando: se decide a qué altura encaja y el estado vuelve
   * a ser la única verdad.
   */
  const arrastrarHoja = (e) => {
    const hojaEl = hojaRef.current;
    if (!hojaEl || e.pointerType === "mouse") return; // en escritorio no hay hoja
    const y0 = e.clientY;
    const abierta = hoja === "full";
    const alto = hojaEl.getBoundingClientRect().height;
    let dy = 0;

    hojaEl.style.transition = "none";
    const mover = (ev) => {
      dy = ev.clientY - y0;
      // Resistencia al tirar en la dirección donde ya no hay recorrido.
      const libre = abierta ? Math.max(0, dy) : Math.min(0, dy);
      const preso = (abierta ? Math.min(0, dy) : Math.max(0, dy)) * 0.18;
      hojaEl.style.setProperty("--hoja-arrastre", `${libre + preso}px`);
    };
    const soltar = () => {
      hojaEl.style.transition = "";
      hojaEl.style.removeProperty("--hoja-arrastre");
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", soltar);
      // Un cuarto de la hoja, o un gesto claro, bastan para cambiar de altura.
      if (Math.abs(dy) > alto * 0.25) setHoja(dy > 0 ? "peek" : "full");
    };
    window.addEventListener("pointermove", mover);
    window.addEventListener("pointerup", soltar, { once: true });
  };

  /**
   * Al tocar algo que cambia el diseño, la hoja se aparta para que el cambio
   * se vea. Va en un solo sitio y no en los quince manejadores que ya existen:
   * cualquier control nuevo queda cubierto sin acordarse de esto.
   */
  const apartarHoja = (e) => {
    if (hoja !== "full") return;
    if (e.target.closest(".preset, .chip, .surprise, .opt, .sec__toggle")) {
      setHoja("peek");
    }
  };

  // Solo estudio. El código del export (JSZip incluido) se carga bajo demanda.
  const downloadZip = async () => {
    setZipping(true);
    try {
      const [{ buildProjectFiles }, { downloadProjectZip }] = await Promise.all(
        [import("../export/scaffold"), import("../export/zip")],
      );
      const { files, projectName } = buildProjectFiles(config, content);
      await downloadProjectZip(files, projectName);
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="shell" data-hoja={hoja}>
      <aside className="shell__panel" ref={hojaRef} onClickCapture={apartarHoja}>
        {/* Tirador de la hoja. Solo existe en móvil (el CSS lo esconde en
            escritorio), y es un botón de verdad: se puede arrastrar, pero
            también pulsar con el teclado o con un lector de pantalla. */}
        <button
          type="button"
          className="hoja__tirador"
          onPointerDown={arrastrarHoja}
          onClick={() => setHoja((v) => (v === "full" ? "peek" : "full"))}
          aria-expanded={hoja === "full"}
        >
          <span className="hoja__asa" aria-hidden="true" />
          <span className="hoja__texto">
            {hoja === "full" ? "Ver mi web" : "Ajustar el diseño"}
          </span>
        </button>

        <div className="shell__brand">
          {/* {showPicker ? ( */}
          <ProjectMenu
            projectId={projectId}
            studio={isStudio}
            capped={atVersionCap}
            onSwitch={switchProject}
            onNew={newProject}
            onDuplicate={duplicateProject}
            onRename={renameCurrent}
            onDelete={deleteCurrent}
          />
          {/* ) : (
            <span className="shell__logo">Maketa</span>
          )} */}
          <div className="shell__tabs">
            <button
              type="button"
              className={mode === "design" ? "is-active" : ""}
              onClick={() => setMode("design")}
            >
              Diseño
            </button>
            <button
              type="button"
              className={mode === "content" ? "is-active" : ""}
              onClick={() => setMode("content")}
            >
              Contenido
            </button>
          </div>
          <div className="shell__links">
            <button
              type="button"
              className="design shell__help"
              onClick={openTour}
            >
              ¿Cómo funciona?
            </button>
          </div>
          {atVersionCap && (
            <p className="shell__cap">
              Tres versiones es el máximo. Borra una para poder guardar otra.
            </p>
          )}
        </div>

        {saveFailed && (
          <div className="shell__warn" role="status">
            <span>
              No se ha podido guardar en este navegador: se ha quedado sin
              espacio. Copia el enlace para no perder este diseño.
            </span>
            <button type="button" onClick={copyLink}>
              {copied === "link" ? "Enlace copiado" : "Copiar enlace"}
            </button>
          </div>
        )}

        <ErrorBoundary
          fallback={(retry) => (
            <div className="panel-error">
              <p>Este panel ha fallado.</p>
              <button type="button" onClick={retry}>
                Reintentar
              </button>
            </div>
          )}
        >
          {mode === "design" ? (
            <Sidebar
              config={config}
              step={designStep}
              onStep={setDesignStep}
              onContact={openContact}
              onSet={set}
              onApplyPreset={applyPreset}
              onApplyType={applyType}
              onBrandColor={setBrandColor}
              onSurprise={surprise}
              onFocus={focusInPreview}
              onReveal={revealInPreview}
              onSwitchAesthetic={switchAesthetic}
              onToggleSection={toggleSection}
              onMoveSection={moveSection}
            />
          ) : (
            <ContentForm
              config={config}
              content={content}
              onChange={setContent}
              onReset={() => setContent(DEFAULT_CONTENT)}
            />
          )}
        </ErrorBoundary>

        <footer className="shell__legal">
          <a href="/aviso-legal.html" target="_blank" rel="noopener noreferrer">
            Aviso legal
          </a>
          <a href="/privacidad.html" target="_blank" rel="noopener noreferrer">
            Privacidad
          </a>
          <a href="/cookies.html" target="_blank" rel="noopener noreferrer">
            Cookies
          </a>
        </footer>
      </aside>

      <main className="shell__stage-wrap">
        <div className="shell__bar">
          <div className="shell__devices">
            <button
              className={device === "desktop" ? "is-active" : ""}
              onClick={() => setDevice("desktop")}
              type="button"
            >
              Escritorio
            </button>
            <button
              className={device === "mobile" ? "is-active" : ""}
              onClick={() => setDevice("mobile")}
              type="button"
            >
              Móvil
            </button>
          </div>

          {isStudio && violations.length > 0 && (
            <p
              className="shell__violations"
              title={violations.map((v) => v.reason).join("\n")}
            >
              {violations.length} ajuste{violations.length > 1 ? "s" : ""}{" "}
              automático
              {violations.length > 1 ? "s" : ""}
            </p>
          )}

          <div className="shell__actions">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="shell__undo"
              title="Deshacer (⌘Z)"
            >
              <Icon set="tabler" name="undo" size={15} />
              Deshacer
            </button>
            {canRedo && (
              <button
                type="button"
                onClick={redo}
                className="shell__redo"
                aria-label="Rehacer"
                title="Rehacer (⇧⌘Z)"
              >
                <Icon set="tabler" name="redo" size={15} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setRaw(DEFAULT_CONFIG)}
              className="shell__reset"
              title="Vuelve al diseño por defecto (se puede deshacer)"
            >
              <Icon set="tabler" name="refresh" size={15} />
              Reiniciar
            </button>
            <button onClick={copyLink} type="button" className="shell__ghost">
              {copied === "link" ? "Copiado" : "Copiar enlace"}
            </button>
            {isStudio && (
              <button
                onClick={downloadZip}
                type="button"
                className="shell__ghost shell__dl"
                disabled={zipping}
              >
                {zipping ? "Empaquetando…" : "Descargar .zip"}
              </button>
            )}
            <button onClick={openContact} type="button" className="shell__cta">
              Pedir presupuesto
            </button>
          </div>
        </div>

        <div className="shell__stage-row">
          <PreviewFrame
            ref={frameRef}
            config={config}
            content={content}
            device={device}
          />
        </div>
      </main>

      <ContactModal
        open={showContact}
        onClose={() => setShowContact(false)}
        content={content}
        previewLink={previewLink}
        editLink={editLink}
        versionName={projects.length > 1 ? active?.name : null}
      />

      <Tour
        steps={TOUR_STEPS}
        open={showTour}
        onClose={closeTour}
        onReveal={revealInPreview}
        panel={designStep}
        onPanel={setDesignStep}
        tab={mode}
        onTab={setMode}
      />
    </div>
  );
}
