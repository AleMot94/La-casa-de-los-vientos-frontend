---
name: marca-hosteria
description: Marca y sistema de diseño de la hostería Casa de los Vientos (Salta): paleta vino/terracota/cardón, Playfair Display + Plus Jakarta Sans, tono rioplatense. Usar al diseñar o escribir cualquier texto, componente o estilo del sitio.
---

# Marca: La Casa de los Vientos

Hostería en los Valles Calchaquíes, Salta (sin adjetivos de marketing). Sistema "Calchaquí Luxury Heritage": lujo editorial sobrio, adobe encalado, vino tinto, calma de montaña.
Detalle completo en `contexto/DESIGN_desktop.md`; maquetas de referencia en `contexto/code_*.html` y `contexto/mockup-*.jpeg`.

**Nombre**: siempre "La Casa de los Vientos" (el mockup desktop dice "El Gallo de Viento": reemplazar).
**Datos** (teléfonos, mail, precios, reseñas, calificación, dirección): placeholder, viven en `src/data/`. No inventar datos nuevos en los componentes.

## Paleta (tokens en `src/index.css`)
- Primario vino `#7B1E2B` (hover/estados profundos `#58111A`): CTAs, marca, acentos.
- Secundario terracota `#C86D51`: highlights, badges activos, links editoriales.
- Terciario verde cardón `#5C6B50`: estados, badges de terroir/sustentabilidad.
- Base `#FAF7F2`, tarjetas `#F4EBE1`, bordes/divisores `#ECE2D4`, texto carbón `#2B2625`.
- Proporción: 65% arena/adobe, 25% texto, 10% acentos vino/terracota.

## Tipografía
- Títulos: Playfair Display (400/500, display 56/64, headline 40/48, móvil 36 y 28).
- Texto y UI: Plus Jakarta Sans (body 15–18px, labels 11–14px).
- Overlines (clase `kicker`): label-sm en mayúsculas, tracking 0.1em, color terracota o vino.

## Layout y forma
- Máx. 1360px; márgenes 4rem desktop / 2rem tablet / 1.25rem móvil; grilla 12/8/4 columnas, composición asimétrica (ej. 7+5).
- Separación entre secciones: 4rem móvil, 6rem desktop.
- Radios suaves 4–8px (tarjetas grandes hasta 12px); sin sombras duras, capas tonales + sombra cálida difusa.
- Imágenes: 4:3 interiores, 16:9 paisajes, 3:2 gastronomía.

## Componentes
- Botón primario: vino sólido, texto crema, 4px. Secundario: borde 1.5px vino. Terciario: link terracota con flecha →.
- Inputs 48px de alto, fondo `#FAF7F2`, foco con borde vino + halo.
- Chips: outline cardón para terroir; fill `#ECE2D4` para amenities.
- Barra de consulta (llegada, salida, huéspedes, habitación) sobre fondo adobe translúcido. Es una consulta por WhatsApp: la página no muestra ni confirma disponibilidad.

## Tono
- Español rioplatense, voseo, cálido y sereno. Evocar viento, quebrada, adobe, silencio, vino de altura.
- Evitar tecnicismos y exclamaciones; frases cortas y sensoriales.
