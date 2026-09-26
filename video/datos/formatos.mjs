// ============================================================
// FORMATOS DE LA COLA SEMANAL
//
// El segundo eje de variación de la cola (el primero es el negocio). Cada
// formato es una idea de reel y se produce con el motor: `reel(n)` devuelve
// los datos de un reel, igual que un JSON de video/reels/ pero sin el negocio,
// que lo pone la cola.
//
// Las cinco voces van alternándose para que dos piezas seguidas no se
// parezcan: cinco trepidantes seguidas cansan igual que cinco lentas.
// ============================================================

export const FORMATOS = {
  rafaga: {
    voz: 'Trepidante: seis estilos seguidos. La de captar.',
    reel: (n) => ({ plantilla: 'estilo', cantidad: 6, gancho: `La web de *${n.quien}*, en seis estilos.` }),
  },
  identidad: {
    voz: 'Un solo gesto repetido: el color de marca.',
    reel: () => ({ plantilla: 'color', cantidad: 5, gancho: 'Cambia un color y *cambia toda tu web*.' }),
  },
  portada: {
    voz: 'Pausado: tres portadas, dos segundos cada una.',
    reel: () => ({ plantilla: 'portada', cantidad: 3 }),
  },
  escribir: {
    voz: 'Íntimo: el titular se escribe y luego cambia de letra.',
    reel: () => ({ plantilla: 'titular', cantidad: 3 }),
  },
  recorrido: {
    voz: 'Contemplativo: la web entera de arriba abajo. El contrapunto.',
    reel: () => ({ plantilla: 'recorrido' }),
  },
}

export const listaFormatos = () => Object.keys(FORMATOS)
