---
name: Industrial Kinetic
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#d1c6ab'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#9a9078'
  outline-variant: '#4e4632'
  surface-tint: '#efc200'
  primary: '#ffefca'
  on-primary: '#3c2f00'
  primary-container: '#ffcf07'
  on-primary-container: '#6f5900'
  inverse-primary: '#735c00'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#f3f0f0'
  on-tertiary: '#303030'
  tertiary-container: '#d6d4d3'
  on-tertiary-container: '#5c5b5b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe085'
  primary-fixed-dim: '#efc200'
  on-primary-fixed: '#231b00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474747'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display-lg:
    fontFamily: Anton
    fontSize: 72px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Anton
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Archivo Narrow
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Archivo Narrow
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max-width: 1440px
---

## Brand & Style

This design system is built on a "Neo-Industrial" aesthetic, targeting heavy industry, logistics, and high-performance engineering sectors. The visual narrative is one of precision, urgency, and raw utility. It leverages a high-contrast, bold style that mimics physical industrial signage and machinery interfaces.

The UI should evoke a sense of reliability and immediate action. It combines the structured rigidity of a factory floor with the modern efficiency of high-tech software. Key traits include:
- **Bold Typography:** For immediate information hierarchy and "at-a-glance" readability.
- **High-Contrast Surfaces:** To ensure legibility in high-pressure or high-glare environments.
- **Structural Integrity:** Using heavy lines and intentional spacing to define functional zones.

## Colors

The palette is anchored by a high-visibility primary yellow (#ffcf07), reminiscent of hazard markings and heavy equipment. This is set against a deep, multi-tiered dark background system.

- **Primary:** #ffcf07 (Warning Yellow). Used for primary actions, critical alerts, and branding accents.
- **Surface:** The background is a solid #000000 to maximize contrast. 
- **Containers:** Secondary (#1a1a1a) and Tertiary (#333333) are used to create structural depth and define separate functional modules.
- **Foreground:** Pure white or high-smoke grey (#f5f5f5) for text content to ensure maximum AAA accessibility.

## Typography

The typography system is aggressive and efficient. 

- **Display & Headlines:** Use **Anton**. Its condensed, heavy nature demands attention. Headlines should always be uppercase to reinforce the industrial command-center tone.
- **Body Text:** Use **Archivo Narrow**. Its condensed width allows for data-heavy views without sacrificing legibility, fitting the "utilitarian" theme.
- **Labels & Mono:** Use **JetBrains Mono** for technical readouts, status labels, and metadata. This font emphasizes the technical, "software-meets-hardware" aspect of the system.

## Layout & Spacing

The layout is based on a rigid 4px baseline grid. Content should feel structured and "bolted down."

- **Grid:** Use a 12-column fluid grid for desktop with fixed 16px gutters. For mobile, transition to a 4-column grid.
- **Rhythm:** Spacing follows a geometric progression (4, 8, 16, 24, 32, 48, 64). Large gaps are used only to separate major functional blocks.
- **Alignment:** Strictly use left-alignment for all text blocks to maintain a clean vertical "axis of action."

## Elevation & Depth

This design system rejects traditional shadows in favor of **Tonal Layers** and **Bold Borders**.

- **Stacking:** Depth is conveyed by shifting the background color. The further "forward" an object is, the lighter its dark-grey background becomes (e.g., Background #000, Card #1a1a1a, Modal #333).
- **Outlines:** Use 1px or 2px solid borders to define elements. For the primary color, use #ffcf07 borders. For neutral elements, use #333333.
- **Interactivity:** On hover, elements should not lift; instead, they should change their border weight or swap their fill color with the primary yellow.

## Shapes

The shape language is strictly **Sharp (0px roundedness)**. 

Every element—buttons, cards, inputs, and modals—must have 90-degree corners. This reinforces the industrial, machined quality of the interface. Diagonals and chamfered edges can be used in iconography or decorative accents, but the core structural containers must remain rectangular.

## Components

- **Buttons:** Primary buttons use a solid #ffcf07 fill with black Anton text. Secondary buttons use a #ffcf07 2px border with no fill. All buttons use uppercase text.
- **Inputs:** Dark backgrounds (#1a1a1a) with a bottom-only border of 2px in #333333. The border turns #ffcf07 on focus.
- **Cards:** No shadows. Defined by a 1px border (#333) and a slight background tint difference from the main canvas.
- **Chips/Status:** Use the JetBrains Mono font. Statuses use high-saturation "hazard" colors: Red for Error, Primary Yellow for Warning, and Bright Green for OK.
- **Data Tables:** High-density, no vertical borders, heavy horizontal separators. Headers are Anton uppercase, row data is Archivo Narrow.
- **Progress Bars:** Blocky, segmented progress indicators rather than smooth fills, echoing physical LED light bars.