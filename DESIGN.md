# Design Brief

## Direction
Data-Driven Institutional — A professional analytics platform for Indian road accident data, emphasizing clarity, accessibility, and institutional trust with minimal decoration.

## Tone
Authoritative yet approachable; clean institutional frameworks presented with warmth, not sterility.

## Differentiation
Accessibility-first data visualization — high-contrast color-blind friendly palette with semantic structure; charts are the focal point, UI is functional support.

## Color Palette

| Token      | Light OKLCH    | Dark OKLCH     | Role                       |
| ---------- | -------------- | -------------- | -------------------------- |
| background | 0.98 0.008 230 | 0.14 0.015 230 | Neutral canvas             |
| foreground | 0.18 0.015 230 | 0.92 0.01 230  | Primary text               |
| card       | 1.0 0.004 230  | 0.18 0.018 230 | Content surface            |
| primary    | 0.42 0.14 240  | 0.75 0.18 240  | Institutional blue accent  |
| accent     | 0.60 0.16 150  | 0.65 0.16 150  | Success / positive outcomes |
| destructive| 0.55 0.22 25   | 0.60 0.22 25   | Warnings / accidents       |
| muted      | 0.94 0.01 230  | 0.22 0.02 230  | Secondary backgrounds      |

## Typography
- Display: Space Grotesk — geometric, modern, institutional credibility for headings
- Body: Figtree — warm, readable sans-serif for content and labels
- Scale: hero `text-5xl md:text-6xl`, h2 `text-3xl md:text-4xl`, label `text-sm uppercase`, body `text-base`

## Elevation & Depth
Soft subtle shadows on cards with cool-toned backgrounds; layered surface distinction through background lightness shifts (card > content > footer) with minimal border treatment.

## Structural Zones

| Zone    | Background              | Border                    | Notes                                          |
| ------- | ----------------------- | ------------------------- | ---------------------------------------------- |
| Header  | card with border-b      | border / sidebar-border   | Title, nav links, mode toggle                  |
| Sidebar | sidebar with subtle bg  | sidebar-border            | Icon + text nav items, dark elevated           |
| Content | background              | —                         | Main dashboard area with alternating cards    |
| Footer  | muted/40 with border-t  | sidebar-border            | Contact, attribution, preventive resources    |

## Spacing & Rhythm
Spacious layout (6–8 grid) with consistent 6px border-radius; content sections separated by 2rem gaps; micro-spacing (8px–16px) within cards for breathing room.

## Component Patterns
- Buttons: semantic colors (primary for main actions, destructive for alerts); medium rounded (8px), focus ring on primary
- Cards: light/dark elevated with subtle shadow; 16px padding, 6px radius
- Charts: 5-color accessible palette (high contrast, color-blind friendly); legend below with semantic labels
- Badges: small rounded, muted background with foreground text

## Motion
- Entrance: fade-in 200ms on page load for charts and stat cards
- Hover: subtle lift (shadow increase) on interactive cards, color shift on buttons
- Decorative: none (data-first aesthetic)

## Constraints
- No gradients or decorative effects beyond surface elevation
- Color-blind palette for all charts (protan, deutan, tritanopia safe)
- High contrast text (AA+ WCAG compliance)
- Semantic button colors (no arbitrary styling)

## Signature Detail
Deep ocean blue institutional primary paired with warm amber secondary creates a distinctive "trustworthy but approachable" government analytics aesthetic unlike generic data dashboards.

## Chart Color Palette (Accessible)
| Chart | Light OKLCH   | Dark OKLCH    | Purpose                    |
| ----- | ------------- | ------------- | -------------------------- |
| 1     | 0.65 0.20 40  | 0.72 0.20 40  | Orange-amber (vehicle/severity) |
| 2     | 0.50 0.18 240 | 0.65 0.20 240 | Deep blue (state/trend)     |
| 3     | 0.60 0.16 150 | 0.70 0.18 150 | Emerald green (prevention)  |
| 4     | 0.70 0.16 25  | 0.58 0.20 25  | Red-coral (accidents)       |
| 5     | 0.45 0.15 300 | 0.62 0.18 300 | Purple (secondary data)     |
