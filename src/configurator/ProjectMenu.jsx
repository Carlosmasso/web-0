import { useEffect, useRef, useState } from "react";
import { Icon } from "../preview/Icon";
import { listProjects } from "./projects";

// Selector de lo guardado. Dos lecturas del mismo menú (ver App.jsx):
//
//   ESTUDIO   "Maqueta · proyecto" — Nuevo / Duplicar / Renombrar / Borrar.
//   CLIENTE   "Tu web · versión"   — lo mismo con otras palabras, y solo se
//             monta cuando ya hay más de una versión.
//
// Las MISMAS cuatro acciones en los dos modos. Crear y duplicar están además
// como botones con su texto en la cabecera del panel, porque con una sola
// versión este menú todavía no existe; pero tienen que estar también aquí
// dentro, que es donde se va a buscarlas — y con el menú abierto, el panel
// flotante tapa justo esos dos botones.
//
// Lee el índice de localStorage en cada render: es una lectura mínima y así
// refleja altas, renombrados y bajas sin necesidad de un estado espejo.
export function ProjectMenu({
  projectId,
  studio = false,
  capped = false,
  onSwitch,
  onNew,
  onDuplicate,
  onRename,
  onDelete,
}) {
  const [open, setOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const ref = useRef(null);

  const projects = listProjects();
  const active = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setRenaming(false);
  };

  const submitRename = (e) => {
    e.preventDefault();
    const name = new FormData(e.currentTarget).get("name")?.toString().trim();
    if (name) onRename(name);
    setRenaming(false);
  };

  return (
    <div className="pmenu" ref={ref}>
      <button
        type="button"
        className="pmenu__trigger"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="pmenu__eyebrow">Maqueta · proyecto</span>
        <span className="pmenu__name">
          {active?.name ?? "Proyecto por defecto"}
          <Icon set="tabler" name="chevron" size={13} />
        </span>
      </button>

      {open && (
        <div className="pmenu__panel">
          <ul className="pmenu__list">
            {projects.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={p.id === projectId ? "is-active" : ""}
                  onClick={() => {
                    if (p.id !== projectId) onSwitch(p.id);
                    close();
                  }}
                >
                  <span>{p.name}</span>
                  {p.id === projectId && (
                    <Icon set="tabler" name="check" size={14} />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {renaming ? (
            <form className="pmenu__rename" onSubmit={submitRename}>
              <input
                name="name"
                defaultValue={active?.name}
                autoFocus
                aria-label="Nuevo nombre del proyecto"
              />
              <button type="submit">Guardar</button>
            </form>
          ) : (
            <div className="pmenu__actions">
              <button
                type="button"
                disabled={capped}
                onClick={() => {
                  onNew();
                  close();
                }}
              >
                Nuevo
              </button>
              <button
                type="button"
                disabled={capped}
                onClick={() => {
                  onDuplicate();
                  close();
                }}
              >
                Duplicar
              </button>
              <button type="button" onClick={() => setRenaming(true)}>
                Renombrar
              </button>
              <button
                type="button"
                className="pmenu__del"
                disabled={projects.length < 2}
                onClick={() => {
                  if (
                    window.confirm(
                      `¿Borrar "${active?.name}"? No se puede deshacer.`,
                    )
                  ) {
                    onDelete();
                    close();
                  }
                }}
              >
                Borrar
              </button>
            </div>
          )}

          {capped && (
            <p className="pmenu__note pmenu__note--cap">
              Tres versiones es el máximo. Borra una para poder crear otra.
            </p>
          )}

          {/* Lo que hay que decir sin letra pequeña: esto no es una cuenta. */}
          {!studio && (
            <p className="pmenu__note">
              Tus versiones se guardan solo en este navegador. Si quieres
              conservar una, copia su enlace.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
