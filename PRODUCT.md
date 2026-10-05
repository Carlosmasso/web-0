# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dos públicos por igual, sin uno dominante:

- **Comercio local**: panaderías y obradores, cafeterías, peluquerías, talleres,
  casas rurales. Sin conocimientos de web; llegan desde un reel, una
  recomendación o una búsqueda, a menudo desde el móvil.
- **Profesionales liberales**: clínicas, fisios, despachos de abogados, estudios
  de arquitectura. Más exigentes con la imagen; comparan con agencias.

En ambos casos el trabajo es el mismo: tener una web que transmita confianza
sin complicarse la vida ni aprender a mantenerla.

## Product Purpose

Maketa (maketa.es) es un configurador donde el cliente arma su web —una landing
de una sola página— eligiendo punto de partida, estilo, color, tipografía y
secciones, con vista previa en vivo. Cuando le gusta, pide que se la construyan
y Carlos se la entrega terminada.

**Éxito hoy**: que el visitante pase de "me gusta" a "cuéntame y te escribo yo"
(el lead). El configurador es la puerta; la entrega personal es el producto.

## Positioning

"Diséñala tú. Yo la construyo." Ni un creador de webs que acabas manteniendo tú
ni una agencia anónima: el cliente decide de verdad cómo se ve, lo ve en vivo, y
una persona concreta se la construye, la repasa con él y no la publica hasta que
está contento.

## Operating Context

- Tres entradas: la landing estática (`/`), el configurador (`/app.html`) y el
  sitio aislado en un iframe (`/preview.html`).
- El diseño viaja en un enlace (`?c=`); se guarda en el navegador como versiones
  (máximo tres en modo cliente). El cliente nunca se descarga el proyecto.
- El contacto es una petición, no un pago: llega a una Google Sheet y por correo.
- Contenido para redes (reels y carruseles) generado con Remotion en `video/`.

## Capabilities and Constraints

- Las webs generadas son de **una sola página**; el menú baja a secciones y
  ningún enlace puede quedarse muerto.
- La web no cobra: nada de checkout ni pagos.
- Fase 0: sin alta de autónomo todavía; nada que dependa de cobrar.
- Imágenes de stock de Pexels, enlazadas por URL.
- Ver `PLAN.md` ("Lo que NO hacemos") para lo descartado a propósito.

## Brand Commitments

- **Voz en primera persona, cercana**: "te escribo yo", "hasta que estés
  contento". Calidez y confianza antes que dinero; nada de lenguaje de agencia
  ni de "presupuesto" frío.
- **Sin precios ni dinero en difusión**: la landing solo enseña "desde 249 €";
  extras y tarifas se cuentan por correo (`TARIFAS.md`, interno).
- **Panel de cliente mínimo**: controles como botón con texto visible; lo que
  solo importa dentro de una estética lo fija el preset, no un control nuevo.
- Todo en español.

## Evidence on Hand

- El configurador real, ocho negocios de ejemplo con contenido por sector
  (`src/content/sectores.js`, `video/datos/negocios.mjs`).
- Reels y carruseles generados en `video/out/`.
- **No hay todavía clientes, testimonios ni casos reales**: los negocios de
  ejemplo se cuentan como "así quedaría", nunca como clientes. No inventar
  cifras, reseñas ni casos.

## Product Principles

1. El resultado y el trato van antes que el dinero: Maketa crece por
   recomendación.
2. Cada control hace exactamente lo que dice; los guardarraíles recomiendan, no
   bloquean.
3. Menos opciones, mejor elegidas: el preset decide lo fino.
4. Honestidad: nada inventado, nada que prometa lo que una persona sola no
   puede entregar bien.

## Accessibility & Inclusion

Contraste WCAG garantizado en todas las webs generadas
(`src/config/guardrails.js`); los tests comprueban que todos los presets lo
cumplen.
