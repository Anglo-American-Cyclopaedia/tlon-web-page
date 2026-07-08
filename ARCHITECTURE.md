# Arquitectura del sitio

Guía para cualquier dev (o IA) que llegue a este repo por primera vez. Explica cómo
está armado el sitio, qué piezas son reutilizables, y qué reglas seguir para no
romper la consistencia entre páginas.

## Lineamientos de marca

Toda decisión visual (colores, tipografía, logos, banners institucionales, uso del
escudo, etc.) debe seguir el manual oficial de identidad de la Universidad Nacional:

**https://identidad.unal.edu.co/**

Ante cualquier duda de diseño ("¿este color es correcto?", "¿puedo mover el logo?"),
esa es la fuente de verdad — no el criterio propio ni lo que ya esté hecho en otra
página del sitio.

## Qué es este sitio

Sitio estático multi-página (sin build step, sin framework de componentes). Cada
página del menú es un `.html` independiente que comparte:
- Los mismos `<link>`/`<script>` en `<head>` (Bootstrap, jQuery, CSS propio).
- Tailwind vía CDN (`https://cdn.tailwindcss.com`) con prefijo `tw-` (`tw-flex`,
  `tw-text-xl`, etc.) — así conviven con las clases viejas de Bootstrap sin chocar.
- Tres **componentes reutilizables** renderizados por JS desde `js/unal.js`, en vez de
  markup duplicado por página (ver abajo).

## Componentes reutilizables (`js/unal.js`)

Patrón: cada página deja un `<div>` placeholder vacío con un atributo
`data-component="..."`. Al cargar, `jQuery(document).ready(...)` en `js/unal.js`
llama a una función `render_*()` que le inyecta el HTML real. **Para cambiar cómo se
ve o comporta un componente, se edita la función en `js/unal.js` — nunca el HTML de
cada página.**

### 1. Banner (`data-component="banner"`)

```html
<div data-component="banner" data-label="Filosofía del grupo TLÖN" data-video="public/video/video_recortado.webm"></div>
```

- `data-label`: texto que aparece sobre el video.
- `data-video`: (opcional) fuente del video; si no se pasa, usa el video por defecto.
- Renderizado por `render_banner_components()`. Este es el único componente pensado
  para **personalizarse por página** (cada página puede tener su propio video/label).

### 2. Menú principal (`data-component="main-menu"`)

```html
<div class="navbar-dark mainMenu" id="main_menu_container" data-component="main-menu"></div>
```

- Renderizado por `render_main_menu()`.
- **No tiene atributos de personalización a propósito.** El menú es idéntico en
  todas las páginas por decisión de producto — si necesitas otro ítem de menú, se
  agrega una vez en `render_main_menu()` y aparece en todas partes.
- `prepare_content_menu()` (en el mismo archivo) clona este menú ya renderizado para
  armar la versión mobile — por eso `render_main_menu()` se llama *antes* que
  `prepare_content_menu()` en el `ready()`. Si se invierte el orden, el menú mobile
  queda vacío.

### 3. Panel de accesibilidad (`data-component="accessibility-panel"` + `"accessibility-tab"`)

```html
<div class="tx-unal-accesibilidad tw-select-none" data-component="accessibility-panel"></div>
<div class="tx-unal-accesibilidad tw-select-none tw-absolute" data-component="accessibility-tab"></div>
```

- Renderizados por `render_accessibility_panel()`.
- Son **dos placeholders**, no uno: `accessibility-panel` trae el panel completo
  (tamaño de letra, contraste, etc.) + el botón mobile; `accessibility-tab` es solo el
  botón visible en desktop.
- **Ambos deben ir como hermanos, justo después de `</header>` y antes de que abra
  `<main>`.** No los muevas dentro de `<main>`.
  - Por qué: `main{position:relative}` (en `frontend.css`) convierte a `<main>` en el
    contenedor de posicionamiento de cualquier hijo `position:absolute`. Si el botón
    del panel queda adentro de `<main>`, su posición termina dependiendo del ancho/
    margen que tenga ese `<main>` en particular (por ejemplo `main.detalle` tiene
    `margin: 0 10%`, lo que lo desplaza). Ya pasó — el botón aparecía en un lugar
    distinto en Historia/Filosofia/Directorio vs. Inicio. Sacarlo de `<main>` lo
    desacopla del estilo de esa página y garantiza la misma posición siempre.
  - El `top: 103px` que posiciona el tab verticalmente viene del CSS por defecto de
    `.tx-unal-accesibilidad` (en `accesibilidad.css`) — no lo sobreescribas con
    `tw-top-0` a menos que sepas por qué (esa clase se usaba antes, quedó de cuando
    el botón vivía dentro de `<main>`).
- El botón real usa `onclick="accesstab()"` (definido en `js/accesibilidad.js`), que
  alterna el panel vía `getElementById`. Esto es lo que hace que el botón realmente
  funcione — un `<div>` sin `onclick` (como quedó en versiones viejas de algunas
  páginas) no hace nada al hacer clic.

## Estructura de una página de contenido

Páginas como `filosofia.html`, `historia.html`, `directorio.html`, `concepto.html`,
`campos-investigacion.html`, `modelo.html` siguen el mismo esqueleto dentro de
`<main class="detalle">`:

```html
<main class="detalle">
  <div data-component="banner" data-label="..."></div>

  <section class="tw-max-w-6xl tw-mx-auto tw-px-6 md:tw-px-8 tw-py-16">
    <div class="tw-text-sm tw-text-gray-500 tw-mb-8"> <!-- breadcrumb --> </div>

    <div class="tw-grid md:tw-grid-cols-[1fr_260px] tw-gap-12 ...">
      <div> <!-- h2 título + párrafo intro --> </div>
      <div class="tw-text-right tw-italic ..."> <!-- cita de Borges --> </div>
    </div>

    <!-- secciones de contenido, alternando texto/imagen en grid de 2 columnas -->
  </section>
</main>
```

Cada página corresponde a un mockup en `mockups/*.svg` (diseño de referencia, no se
sirve al sitio). El contenido real (textos, no lorem ipsum) sale de ahí — ver los
`PLAN_*.md` en la raíz para el detalle de qué se transcribió de cada mockup y qué
quedó pendiente (por ejemplo: diagramas técnicos de Proyecto TLÖN están como
placeholders con borde punteado hasta que se provean los assets reales; el roster de
Directorio usa nombres genéricos "Nombre Apellido" salvo los 3 líderes, que son
personas reales confirmadas).

## Checklist para agregar/migrar una página nueva

1. Copiar el `<head>`/`<header>`/`<footer>` de una página ya migrada (p. ej.
   `filosofia.html`), no de una página vieja sin los 3 componentes.
2. Confirmar que el `<script src="js/unal.js?v=2">` tiene el `?v=2` (cache-busting).
3. Verificar que existan los 3 placeholders (`main-menu`, `accessibility-panel`,
   `accessibility-tab`) como hermanos justo después de `</header>`, y que
   `accessibility-tab` NO esté dentro de `<main>`.
4. Poner `<div data-component="banner" data-label="...">` como primer hijo de
   `<main>`.
5. Seguir el mockup correspondiente en `mockups/` para el contenido; si falta un
   asset (foto, diagrama, dato real de una persona), usar un placeholder visible y
   documentarlo en vez de inventar contenido.
6. Para cualquier duda de diseño/marca, consultar
   [identidad.unal.edu.co](https://identidad.unal.edu.co/).
