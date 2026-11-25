# Grisaille — concept site

An original concept website for Grisaille, a fictional identity, web and art-direction studio in Lisbon. It reproduces the structure, grid, proportions, type scale and interaction patterns of the Fabrica® Framer template. The identity, copy, images and code are all new.

Static HTML/CSS/JS with no build step and relative paths. It works at the root of a GitHub Pages subdomain.

## Pages

| Path | Page |
|---|---|
| `index.html` | Home: hero, clients, work, advantages, services, method + showreel, voices, figures + approach, featured case, terms, people, questions, notes, brief panel, footer |
| `projects/index.html` | Work index with a discipline filter (count line and empty state) |
| `projects/casa-alfama/index.html` | Case study |
| `studio/index.html` | Studio (about) |
| `contact/index.html` | Start here: full brief form with validation, loading, success and error states (`?state=error` or a message containing `error-test` shows the error state) |
| `404.html` | Not found. Uses root-absolute paths (`/css/…`) because GitHub Pages serves it at any depth. |

The journal is the `#journal` section of the home page ("Journal" in the header, menu and footer points there). There is no separate journal page: the copy has no articles to open.

`og:image` uses the absolute address of the planned deployment (`https://grisaille.wolfbc.art/`), and each page sets its own `og:url`.

## Fonts and libraries

- **Host Grotesk** (Google Fonts, OFL), weights 400/500/600/700 plus italic 400/500, `display=swap`.
- **No JavaScript libraries.** GSAP and Lenis were not needed: the preloader, menu, accordions, filter and forms are plain JS in `js/site.js`. The scroll moments use CSS scroll-driven animations, with a static fallback in browsers that lack them.

## What reproduces the reference

- 4-column grid with 4px gutters, 36/20px margins, 1520px container, column starts at 36/379/722/1065 at 1440px, and a 190px gap between sections (50px on phones).
- Section heads: a label in column 1 and a one-word display headline (10vw, −0.06em tracking) in columns 2–4. Two-tone statements and first-line indents.
- Dark inset panels (6px inset, 25px radius, grain) for hero, services, terms and the brief panel. A light/dark rhythm in the same order as the reference.
- Radius scale 25/18/16/14/12/10/50 and no card shadows.
- Fixed header with spaced links and a two-bar menu button. Overlay menu that grows from the top with staggered links, Esc to close and a focus trap.
- Smoke video hero with a 35% veil and animated grain, with a "Pause motion" button that stops both. Split person card whose halves join on hover. Registration "+" marks.
- Clients sliding out from under the hero on scroll. Project cards that zoom and blur on hover with the 4px frame closing. Services accordion. Step cards with progress dots. Showreel dialog. Masonry testimonials. Bento case card with a cut-out figure rising above the frame. Segmented plan switch and add-on toggle. FAQ accordion. Journal cards (static: there are no posts to open, so they have no hover).
- Progressive three-layer blur band fixed at the bottom of the screen.
- Short preloader curtain on the first visit of a session, with the content rising into place.
- Studio photo that settles in 3D on scroll. Word-fill statements on the case and studio pages.

## What is original

- Name, monogram (two grey half-discs forming a G), the split "Gris / aille" wordmark with its descriptor in column 4 (replacing the reference's single-line wordmark with ®), palette (paper #f4f3f0, ink #0d0d0c, panel #0b0b0a, plaster accent #e9e4da), typeface, all copy (from COPY.md), all images (from the project's own `assets/`), and all code.
- Client "logos" are typeset wordmarks in different cuts, not images. The project covers reuse each client's cut over its material photo.
- The Casa Alfama case shows the work as drawn plates (inline SVG, made for this project): the stepped C+A monogram with its ochre door, and the grey home page with its single ochre "Check availability" button. The monogram also illustrates the journal note about the hotel's signage.
- The wordmark is split in two greys ("Gris" light, "aille" darker on the footer, lighter on the smoke), like the two half-discs of the monogram.
- Pricing became "Terms": three ways to work behind the segmented switch, instead of per-project/monthly.

## Assets replaced with CSS/SVG or generated

- Dark panel texture: CSS radial gradients plus a grain tile (`assets/grain.png`, random noise generated for this project) instead of a gradient photo.
- Icons (plus-in-circle, play, mail, pin, arrow, menu bars, registration marks): inline SVG or CSS.
- Service thumbnails, step dots, ring and bar chart: CSS/SVG and crops of the provided photos. There were no dedicated thumbnails.
- `assets/favicon.svg` and `assets/og.jpg`: the monogram, drawn for this project (the OG image sits over the provided contact smoke).
- Testimonial avatars: initials in grey squares, with no faces.

## Accessibility and motion

One h1 per page, a skip link, visible focus rings, `aria-expanded` on the menu and accordions, labelled form fields, inline errors, and AA contrast for text. Under `prefers-reduced-motion` everything is visible and still: no preloader, the video stays on its poster and is never downloaded (`preload="none"`), no grain animation, no scroll effects. Elsewhere the hero has a pause button for the video and the grain. No sideways scroll at 320px (checked on every page).
