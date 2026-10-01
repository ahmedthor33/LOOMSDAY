---
name: Serene Sanctuary
colors:
  surface: '#fcf9f4'
  surface-dim: '#dcdad5'
  surface-bright: '#fcf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ee'
  surface-container: '#f0ede9'
  surface-container-high: '#ebe8e3'
  surface-container-highest: '#e5e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#444748'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f3f0eb'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#010101'
  on-primary: '#ffffff'
  primary-container: '#1c1c1c'
  on-primary-container: '#858484'
  inverse-primary: '#c8c6c5'
  secondary: '#735b30'
  on-secondary: '#ffffff'
  secondary-container: '#fcdba5'
  on-secondary-container: '#775f33'
  tertiary: '#030200'
  on-tertiary: '#ffffff'
  tertiary-container: '#201c13'
  on-tertiary-container: '#8b8477'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#ffdea8'
  secondary-fixed-dim: '#e2c28e'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#59431b'
  tertiary-fixed: '#eae1d2'
  tertiary-fixed-dim: '#cec5b7'
  on-tertiary-fixed: '#1f1b12'
  on-tertiary-fixed-variant: '#4b463b'
  background: '#fcf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e5e2dd'
typography:
  display-hero:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '300'
    lineHeight: 30px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-eyebrow:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.2em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.12em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3.5rem
  margin-mobile: 1.25rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.5rem
  space-lg: 2.5rem
  space-xl: 4rem
---

## Brand & Style

This design system embodies quiet luxury, tailored comfort, and the restful stillness of a boutique hotel suite at dawn. Designed for discerning shoppers seeking sensory refinement and restorative sleep, the interface feels tactile, spacious, and unhurried. 

The aesthetic is grounded in **Minimalism** enriched with warm editorial nuance:
- **Quiet Luxury:** Restrained visual gestures, deliberate typography, and high ratios of empty space over decorative clutter.
- **Morning Light & Linen:** Surfaces breathe with creamy off-white and warm sandy undertones, completely rejecting stark digital whites or harsh saturated accents.
- **Editorial Poise:** Product grids mimic high-end architectural and lifestyle publications—favoring asymmetric cadence, generous image framing, and micro-interactions that feel weightless and deliberate.

## Colors

The palette is rooted in tactile organic materials: unbleached organic cotton, weathered sand, and warm morning light. 

- **Primary (`#1C1C1C` - Deep Charcoal):** Serves as the primary anchor for headlines, essential copy, and authoritative buttons, delivering clear legibility without the abrasive harshness of absolute black.
- **Secondary (`#B89B6A` - Muted Champagne Gold):** Applied with deliberate restraint to focal highlights, active state indicators, and premium emblems.
- **Tertiary (`#E8DFD0` - Soft Sand):** Used for elevated secondary cards, image backing mats, tags, and architectural structural blocks.
- **Neutral (`#FAF7F2` - Warm Ivory):** The foundational canvas color that permeates the viewport, softening the overall interface luminance.
- **Border Neutral (`#E2D9CC` - Sandstone Hairline):** Low-contrast structural borders that define separation without breaking the gentle visual flow.

## Typography

The typography system pairs **Playfair Display** for high-contrast, editorial elegance with **Inter** for neutral, hyper-legible utility:

- **Serif Headlines:** Playfair Display introduces literary character and architectural rhythm. Headings should lean light or regular in weight to preserve fine-line hairlines.
- **Body & Information:** Inter provides effortless readability at smaller sizes. Set body copy with light-to-regular weights and generous line-heights to support an unhurried reading cadence.
- **Eyebrows & Micro-labels:** Metadata, thread count indicators, categories, and tags rely on wide-tracked uppercase Inter (`0.15em` to `0.2em`), creating architectural precision against sweeping serif headings.

## Layout & Spacing

The layout philosophy champions spatial luxury through expansive margins and intentional negative space:

- **Grid Architecture:** A responsive 12-column grid on desktop (`1280px+` max-content container: `1440px`), collapsing to 6 columns on tablet and 2 columns on mobile.
- **Breathing Room:** Outer viewports utilize generous margins (`3.5rem` on desktop), establishing a magazine-spread frame around content. Mobile screens reduce outer margins to `1.25rem` while preserving large vertical section breaks (`space-xl`).
- **Asymmetric Pacing:** Product listings combine standardized 2- or 3-column rows punctuated by full-width editorial callouts and atmospheric lifestyle photography inserts to break commercial monotony.

## Elevation & Depth

Spatial depth is communicated via surface tone and hairline divisions rather than heavy, dramatic shadows:

- **Tonal Layering:** The primary canvas sits on Warm Ivory (`#FAF7F2`). Modals, dropdown menus, and hover states shift to pure white (`#FFFFFF`) or Soft Sand (`#E8DFD0`), creating clear functional tiers.
- **Whisper Hairlines:** Surfaces are separated by crisp, 1px borders in Sandstone (`#E2D9CC`). Dividers remain discreet and structural.
- **Warm Ambient Shadow:** When floating components (e.g., sticky mini-cart, quick-view flyouts, mega menus) require lift, apply an ultra-diffused, tinted shadow:
  `box-shadow: 0 12px 32px -4px rgba(28, 28, 28, 0.05), 0 4px 12px -2px rgba(28, 28, 28, 0.03);`
  Pure gray shadows are strictly avoided in favor of warm charcoal tints.

## Shapes

The design system maintains a refined, architectural silhouette through **Soft (`roundedness: 1`)** geometry:

- Standard controls, cards, input frames, and image containers utilize a subtle `0.25rem` (4px) corner radius, softening hard edges while maintaining clean geometric poise.
- Flyout modals, floating cart summaries, and badges scale to `0.5rem` (8px).
- Circles are reserved exclusively for functional color swatch selectors and pagination dots.

## Components

### Buttons
- **Primary:** Deep Charcoal (`#1C1C1C`) fill with Warm Ivory (`#FAF7F2`) text. Uppercase label tracking (`label-md`). Hover invokes a gentle shift to deep charcoal at 85% opacity with an effortless `transform: translateY(-1px)`.
- **Secondary / Outlined:** 1px hairline border (`#1C1C1C`), transparent background, Deep Charcoal text. Hover transitions to Warm Sand (`#E8DFD0`) background fill with zero displacement.
- **Ghost:** Pure text with an understated 1px border underline positioned 4px below baseline, sliding to 100% width on hover.

### Inputs & Selectors
- **Fields:** Subtle Warm Ivory fill with a 1px `#E2D9CC` border. Height: 48px. Placeholder in charcoal at 40% opacity. Focus state shifts border color smoothly to `#B89B6A` without intrusive focus rings.
- **Checkboxes & Radios:** Minimalist 16px squares and circles with 1px border. Checked state fills with `#1C1C1C` displaying an off-white inner glyph.

### Cards & Merchandising
- **Product Card:** Borderless ivory container with edge-to-edge photography resting on a Soft Sand (`#E8DFD0`) tone backing. Aspect ratio fixed to 4:5 or 3:4 portrait.
- **Meta Hierarchy:** Eyebrow tag (e.g., "FRENCH FLAX LINEN") above a Playfair Display product title, followed by price and a row of circular color-swatch circles (20px diameter with 2px white gap and 1px outer ring on active).

### Chips & Badges
- Compact uppercase tags with `0.25rem` radius, `#E8DFD0` background, and Deep Charcoal text. Generous horizontal padding (`space-sm`) and compact vertical height.

### Bespoke E-Commerce Modules
- **Fabric Detail Accordion:** Clean 1px top/bottom `#E2D9CC` border rules with serif titles and smooth accordion transitions for weave details, certifications (OEKO-TEX), and wash care.
- **Bed Bundle Builder:** Sticky summary drawer with high-contrast thumbnail previews, champagne gold step indicators, and live thread-count / drape-weight counters.