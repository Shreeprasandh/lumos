# L&T --- Lighting Design & BOM Generator

## Light-theme dashboard design specification

**Document type:** UI/UX implementation blueprint\
**Design reference:** Approved warm light-theme L&T dashboard\
**Project basis:** `PROJECT_OVERVIEW(1).md` --- Spatial Analysis to BOM
Generator for Lighting Design\
**Target enterprise:** Larsen & Toubro (L&T), Buildings & Factories IC /
EDRC / Smart World & LTTS\
**Revision:** 1.0

------------------------------------------------------------------------

## 1. Purpose and design intent

This document defines the dashboard as a high-fidelity implementation
target. It describes the approved warm light-theme reference in terms of
layout, placement, hierarchy, component structure, visual language,
content, and interaction expectations.

The product is an enterprise engineering workspace for turning
architectural spatial plans into lighting layouts, electrical routing
information, and a procurement-ready Bill of Materials / Bill of
Quantities (BOM / BOQ).

The dashboard should communicate three things immediately:

1.  **Project understanding:** which building or floor is being analysed
    and what the input contains.
2.  **Engineering visibility:** where luminaires are placed and how the
    lighting result is distributed spatially.
3.  **Commercial readiness:** what materials and quantities are being
    derived, and whether the design is checked against the selected
    standards.

The visual treatment is intentionally restrained. It should feel like a
precise engineering instrument, not a marketing website or a dense ERP
screen.

### 1.1 Non-negotiable visual direction

-   Use the **warm light theme** from the approved reference.
-   Do not revert to the dark SentinelMRO theme.
-   Do not use a cold, blue-tinted white background.
-   Keep the page predominantly ivory/off-white, with warm neutral
    surfaces and fine beige-grey borders.
-   Use deep teal for primary navigation and engineering emphasis.
-   Use green for successful/compliant states.
-   Use amber sparingly for processing, warnings, and selected secondary
    emphasis.
-   Keep the central floor-plan visual as the largest and most visually
    important workspace.
-   Preserve the dashboard's exact information architecture and relative
    placement as specified below.

> **Precision note:** The reference image establishes the visual
> composition and visible content. It does not provide source design
> tokens or measured CSS values. Hex values, pixel dimensions, and
> spacing values in this document are implementation recommendations
> calibrated to visually match the reference; treat them as design
> tokens to tune against the reference screenshot, not as recovered
> original source values.

------------------------------------------------------------------------

## 2. Product and engineering context

The project overview describes a browser-based spatial-analysis-to-BOM
workflow. It accepts architectural inputs such as DXF/CAD, PDF, or
vector geometry; extracts room boundaries and spatial features; applies
lighting criteria; synthesizes luminaire placement; calculates
illuminance and uniformity; routes electrical infrastructure; and
produces a multi-tier BOM / BOQ.

The intended engineering flow is:

1.  Import architectural layout.
2.  Extract and classify spaces.
3.  Analyse spatial geometry and room properties.
4.  Calculate lighting requirements and luminaire placement.
5.  Visualise the lighting result through a lux heatmap.
6.  Route conduits and cables using orthogonal / Manhattan routing.
7.  Calculate circuits, loads, and phase distribution.
8.  Generate the six-tier BOM / BOQ.
9.  Review compliance and export procurement outputs.

The source project brief references the following standards and
engineering areas: - IS 3646 and NBC 2016 for recommended illuminance. -
EN 12464 and ECBC as additional lighting/compliance references. - IS 732
and NEC for electrical installation and circuit considerations. - RCR,
UF, MF, SHR, point-by-point illuminance, and uniformity. - Manhattan
routing, vertical drops, conduit fill, cable sizing, circuit splitting,
and phase balancing. - Six BOM tiers: luminaires; drivers and emergency;
conduits and enclosures; wiring and cabling; switchgear and controls;
mounting hardware and labour.

The dashboard is a high-level command surface for these capabilities.
Detailed calculations belong in the dedicated design, analysis, routing,
and BOQ views.

------------------------------------------------------------------------

## 3. Canvas, viewport, and overall composition

### 3.1 Reference proportions

The approved reference is a wide desktop dashboard, approximately
**16:9** in composition. It uses nearly the full viewport width with a
small, consistent outer margin.

Recommended implementation target: - Design canvas: 1600 × 900 px. -
Minimum desktop layout target: 1280 px wide. - Outer horizontal page
padding: 24--28 px. - Outer top padding below navigation: 30--34 px. -
Main content uses a three-column arrangement. - A full-width workflow
strip anchors the bottom of the dashboard.

At 1600 px viewport width, a practical grid is: - Left column:
approximately 340 px. - Centre column: approximately 890 px. - Right
column: approximately 340 px. - Horizontal gaps: approximately 14--18
px.

Use a responsive grid rather than hard-coded absolute positioning. The
reference proportions should remain visually stable at the target
desktop size.

### 3.2 Page zones

The page is organised into three horizontal zones:

  ------------------------------------------------------------------------
  Zone                            Approximate height Purpose
  --------------------- ---------------------------- ---------------------
  Brand header                                 60 px Brand, product name,
                                                     enterprise context,
                                                     user profile

  Primary navigation                           54 px Main product
                                                     destinations

  Dashboard workspace               Remaining height Project cards,
                                                     floor-plan workspace,
                                                     BOM/compliance,
                                                     pipeline
  ------------------------------------------------------------------------

The dashboard workspace has: - Left: project overview and recent
projects. - Centre: lighting layout and lux heatmap. - Right: BOM / BOQ
summary and design compliance. - Bottom: end-to-end design pipeline.

### 3.3 Background

Use a warm near-white page background. It should be light enough to feel
open, but not pure white. A very subtle warm tint is important because
it distinguishes this design from a cold, blue-grey enterprise UI.

Suggested token: - `--page-bg: #FBF8F4`

Avoid strong gradients, textured backgrounds, decorative illustrations,
or large shadows.

------------------------------------------------------------------------

## 4. Colour palette and theme tokens

The palette is derived from the approved warm reference and the
restrained teal/green/amber direction. Values below are proposed
implementation tokens.

### 4.1 Core palette

  -----------------------------------------------------------------------
  Token                   Suggested HEX           Usage
  ----------------------- ----------------------- -----------------------
  Warm ivory              `#FBF8F4`               Main page background

  Soft ivory              `#FFFCF8`               Main card surface

  Warm white              `#FFFFFF`               Inner panels, controls,
                                                  table rows

  Pale sand               `#F5EFE8`               Subtle selected
                                                  backgrounds and
                                                  secondary surfaces

  Warm border             `#E7DED4`               Card outlines and
                                                  separators

  Strong border           `#D9CEC2`               Active outlines and
                                                  stronger divisions

  Primary text            `#202321`               Main headings and
                                                  important values

  Secondary text          `#62645F`               Supporting text and
                                                  descriptions

  Muted text              `#8A8982`               Metadata, labels,
                                                  helper copy

  Deep teal               `#087F73`               Primary brand/action
                                                  accent

  Teal                    `#0B9B8A`               Active navigation,
                                                  icons, selected
                                                  controls

  Pale teal               `#E5F4EF`               Selected cards and
                                                  subtle active fills

  Deep green              `#087A4B`               Compliant / completed
                                                  state

  Soft green              `#E5F4E9`               Success-state
                                                  background

  Amber                   `#D97706`               Processing / warning /
                                                  secondary emphasis

  Pale amber              `#FFF0D9`               Warning-state
                                                  background

  Cyan-teal heat          `#35B9A4`               Mid-range lux
                                                  visualisation

  Warm yellow heat        `#F1D66A`               High lux visualisation
  -----------------------------------------------------------------------

### 4.2 Colour application rules

-   Use teal for the active Dashboard navigation underline, primary
    icons, selected tabs, and the New Project / Generate BOM actions.
-   Use dark teal text on pale teal fills for selected states.
-   Use green only for positive system states such as Completed and
    Compliant.
-   Use amber for Processing and attention-needed states. Do not use
    amber as a general decorative accent.
-   Use charcoal rather than pure black for primary text.
-   Use warm grey-beige borders rather than blue-grey borders.
-   Keep the overall saturation low. The interface should feel calm and
    professional.

### 4.3 Heatmap colour scale

The floor-plan heatmap is the one area where stronger colour is
justified because colour carries engineering information.

Suggested continuous scale: - Low illuminance: muted teal /
blue-green. - Mid illuminance: green. - High illuminance: yellow. - Very
high illuminance: warm yellow.

The legend must remain visible beside the floor plan and should be
labelled **Lux**. Do not use the heatmap palette for unrelated UI
components.

------------------------------------------------------------------------

## 5. Typography

Use a clean, highly legible sans-serif family. Suitable implementation
choices include Inter, IBM Plex Sans, or a similar neutral UI typeface.
Use one family consistently unless a monospaced face is needed for
technical identifiers.

### 5.1 Type hierarchy

  Element                        Recommended size Weight
  ---------------------------- ------------------ -----------
  Product name in header                16--18 px 600
  Navigation labels                         14 px 500
  Panel titles                          17--18 px 600
  Project names                         14--15 px 600
  Main body copy                            14 px 400
  Table labels and values               13--14 px 400 / 500
  Metadata and status labels            11--12 px 500
  Pipeline stage title                      14 px 600
  Pipeline helper text                  12--13 px 400

Use consistent line heights: - Headings: 1.2--1.3. - Body: 1.45--1.6. -
Metadata: 1.35--1.45.

Use tabular numerals for quantities, costs, dimensions, and measurements
so columns align cleanly.

------------------------------------------------------------------------

## 6. Header and primary navigation

### 6.1 Brand header

**Placement:** full-width top row, approximately 60 px high.

**Left-to-right order:** 1. L&T mark. 2. Vertical divider. 3. Product
title: **Lighting Design & BOM Generator**. 4. Flexible empty space. 5.
Enterprise context indicators: - EDRC with green status dot. - B&F
MEP. - Smart World. 6. Circular user/profile control.

**Alignment:** - Vertically centre all elements. - Keep the L&T mark
aligned to the left page padding. - Use a 24--30 px gap between brand
and divider. - Keep enterprise context grouped at the far right. - Use
subtle separators between context labels.

**Visual treatment:** - Background: warm ivory. - Bottom border: warm
border token. - Logo: dark charcoal. - Product title: secondary
charcoal. - Status dot: green. - Profile control: circular, thin warm
border, no heavy fill.

The header should be quiet. It identifies the platform and enterprise
context without competing with the dashboard content.

### 6.2 Primary navigation

**Placement:** directly beneath the brand header, full width,
approximately 54 px high.

**Visible navigation items, in order:** - Dashboard - Projects -
Design - BOM / BOQ - Standards - Library

**Alignment:** - Left aligned. - Horizontal row. - Each item combines a
small outline icon and label. - Use consistent horizontal gaps and equal
vertical centring. - Active item is Dashboard.

**Active state:** - Deep teal icon and text. - Thin teal underline along
the bottom edge of the active navigation item. - No large filled pill;
keep the state minimal.

**Inactive state:** - Charcoal-grey icon and label. - No underline. -
Hover can use a pale sand background.

------------------------------------------------------------------------

## 7. Main dashboard grid

The main dashboard begins below navigation with approximately 30--34 px
of top spacing.

### 7.1 Three-column layout

  Column   Position          Content
  -------- ----------------- -----------------------------------------
  Left     First / left      Project Overview and Recent Projects
  Centre   Middle / widest   Lighting Layout · Lux Heatmap
  Right    Last / right      BOM / BOQ Summary and Design Compliance

Recommended desktop grid:

``` css
.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(280px, 0.95fr) minmax(600px, 2.45fr) minmax(280px, 0.95fr);
  gap: 14px;
  align-items: stretch;
}
```

The centre column should be visibly wider than either side column. It
contains the primary engineering visual and must dominate the first
scan.

### 7.2 Card styling

All primary cards share: - Warm white / soft ivory surface. - 1 px warm
border. - 12--14 px corner radius. - Very subtle shadow, or no shadow
where the border is sufficient. - 16--20 px internal padding. -
Consistent panel-title alignment. - No heavy gradients or glossy
effects.

Suggested tokens:

``` css
--card-bg: #FFFCF8;
--card-border: #E7DED4;
--card-radius: 13px;
--card-padding: 18px;
--card-shadow: 0 1px 3px rgba(55, 42, 28, 0.04);
```

------------------------------------------------------------------------

## 8. Left column --- Project Overview

### 8.1 Placement and dimensions

-   Top card in the left column.
-   Approximately 215 px high at the reference desktop size.
-   Full width of the left column.
-   Recent Projects card sits immediately below with approximately
    16--18 px vertical gap.

### 8.2 Content order

1.  Building / project outline icon.
2.  Heading: **Project Overview**.
3.  Subtitle: **Spatial Analysis to BOM Generator**.
4.  Short explanatory copy:
    -   Automated lighting design.
    -   Electrical routing.
    -   Procurement-ready BOQ generation.
5.  Thin divider.
6.  Full-width outlined action: **+ New Project**.

### 8.3 Alignment and spacing

-   Icon and heading share one horizontal row.
-   Subtitle sits below the heading, aligned to the heading text rather
    than the icon.
-   Description uses two short lines.
-   Divider spans nearly the full inner width.
-   New Project action spans the card width and is centred.
-   Keep the action visually prominent without making it oversized.

### 8.4 Button treatment

-   40--42 px height.
-   8--10 px radius.
-   1 px teal border.
-   Pale teal fill or near-white fill.
-   Teal plus icon and label.
-   Hover: slightly stronger pale teal fill.
-   Focus: visible teal focus ring.

**Why this panel exists:** it gives the user an immediate entry point
into the core workflow and explains the system's purpose without forcing
them to navigate away.

------------------------------------------------------------------------

## 9. Left column --- Recent Projects

### 9.1 Placement

-   Directly below Project Overview.
-   Same width as the card above.
-   Approximately 300 px high in the reference composition.

### 9.2 Header row

-   Left: **Recent Projects**.
-   Right: **View All**.
-   Use a 16--18 px semibold title.
-   Use a smaller muted action label.

### 9.3 Project list

The reference shows four rows:

  Project                            Area Status
  ---------------------- ---------------- ------------
  Tech Park -- Block A       50,000 sq.ft Completed
  Data Center -- L1          38,400 sq.ft In Design
  Hospital -- OPD            72,000 sq.ft Processing
  Factory -- Unit 2        1,20,000 sq.ft Draft

These are the visible reference examples. In a live system, bind rows to
actual project records; do not present these example values as live
system data unless they are seeded demo data.

Each row contains: 1. Small building/project icon in a pale neutral
square. 2. Project name. 3. Area beneath the name. 4. Status pill
aligned to the right.

### 9.4 Status colours

-   Completed: pale green background, deep green text.
-   In Design: pale teal/blue-green background, restrained teal text.
-   Processing: pale amber background, amber text.
-   Draft: pale sand background, muted charcoal text.

Use small pills with compact horizontal padding. Status should be
readable but not overpower the project name.

### 9.5 Row separators

-   Use a 1 px warm border between rows.
-   Do not place each row inside a separate heavy card.
-   Keep row heights consistent.
-   Align all project names and areas to the same left edge.

**Why this panel exists:** it makes previous work discoverable and
communicates project status at a glance.

------------------------------------------------------------------------

## 10. Centre column --- Lighting Layout and Lux Heatmap

### 10.1 Importance and placement

This is the primary workspace and largest card on the page.

-   Centre column.
-   Starts level with Project Overview.
-   Extends approximately the combined height of the two left cards.
-   Its floor-plan graphic occupies most of the panel's inner area.

The visual should attract the user's eye before the smaller summary
cards.

### 10.2 Panel header

Left side: - Small technical/spatial icon. - Title: **Lighting Layout ·
Lux Heatmap**.

Right side: - Segmented view control: - Layout - Lux Map - Routing - 3D

The reference shows **Layout** selected.

### 10.3 Segmented control styling

-   Single outlined container.
-   Four compact adjacent segments.
-   Selected segment uses deep teal fill and white text.
-   Unselected segments use transparent/ivory fill and charcoal text.
-   Thin internal separators.
-   8--10 px outer radius.
-   32--34 px control height.

### 10.4 Floor-plan canvas

The floor plan is centred in the card and uses a technical architectural
line drawing.

Visible reference characteristics: - Large, irregular rectangular
office-floor footprint. - Multiple rooms and circulation areas. -
Meeting-room furniture and workstation groupings. - Door swings,
partitions, and architectural details. - Repeated luminaire markers
placed across rooms. - Subtle green/teal illuminance overlay. - Strong
enough line contrast to preserve the floor-plan geometry.

**Rendering guidance:** - Keep the floor plan horizontally centred. -
Maintain a generous clear margin around its edges. - Do not crop the
floor-plan boundary. - Preserve the architectural linework above the
heatmap overlay. - Keep luminaire symbols consistent in size and
shape. - Avoid excessive glow or bloom; the heatmap should be readable
as data, not decoration.

### 10.5 Lux legend

-   Position to the right of the floor-plan graphic.
-   Label: **Lux**.
-   Vertical gradient bar.
-   Numeric labels shown in descending order.
-   Reference values: 750, 500, 300, 200, 100.

These labels are part of the visible reference example. In a production
view, the legend should be derived from the active heatmap range and
clearly indicate units.

### 10.6 Bottom floor-plan information strip

Place a compact strip below the floor plan, aligned to the left edge of
the canvas.

Visible reference values: - Office Floor -- L1 - Area: 50,000 sq.ft -
Avg. Lux: 512 lx - Uniformity: 0.82

Separate each value with thin vertical dividers. Use a small green
status dot before the floor name.

These are reference/demo values, not universal expected results.
Production values must be calculated from the active plan and lighting
engine.

### 10.7 Canvas controls

At the lower right: - Fit-to-view / focus control. - Minus zoom. - Plus
zoom.

Use small square or softly rounded outlined controls. Keep them aligned
on one horizontal baseline.

### 10.8 Interaction expectations

-   Layout: shows architectural plan and fixture arrangement.
-   Lux Map: overlays illuminance distribution.
-   Routing: shows conduit and cable paths, ideally with separate visual
    layers.
-   3D: opens a spatial/3D representation when available.
-   Zoom controls change canvas scale.
-   Fit-to-view restores the entire plan to the visible canvas.

**Why this panel exists:** it makes the spatial result tangible and
allows engineers to inspect layout quality rather than relying only on
numerical summaries.

------------------------------------------------------------------------

## 11. Right column --- BOM / BOQ Summary

### 11.1 Placement

-   Top card in the right column.
-   Aligned with the top of Project Overview and the lighting canvas.
-   Approximately 330 px high in the reference composition.

### 11.2 Header

-   Stacked-layers icon in teal.
-   Title: **BOM / BOQ Summary**.

### 11.3 Summary table

The visible reference contains five rows:

  Item                      Quantity
  ---------------------- -----------
  Luminaire (LED)          1,248 Nos
  Conduit (20 / 25 mm)      18,420 m
  Cable (3C / 4C)           54,860 m
  Junction Box             1,092 Nos
  MCB / DB                    48 Nos

Use two-column alignment: - Item name left aligned. - Quantity and unit
right aligned. - Thin horizontal separators between rows. - No heavy
vertical grid lines. - Bold or medium-weight numeric values.

The listed values are visible reference/demo content. The actual product
must calculate quantities from the active plan, routing, fixture
selection, circuit design, and BOM rules.

### 11.4 Generate action

At the bottom of the card: - Full-width button: **Generate BOM /
BOQ**. - Download/export icon at left of label. - Teal border and pale
teal fill. - 42--44 px height. - 8--10 px radius.

The action should generate the detailed BOM / BOQ for the current
project, not merely navigate to a static preview.

**Why this panel exists:** it makes the commercial output visible early
and reinforces that the tool calculates more than fixture counts.

------------------------------------------------------------------------

## 12. Right column --- Design Compliance

### 12.1 Placement

-   Immediately below BOM / BOQ Summary.
-   Same width as the summary card.
-   Approximately 185 px high.
-   Vertical gap from the upper card: 16--18 px.

### 12.2 Content

1.  Shield/check icon.
2.  Heading: **Design Compliance**.
3.  Standards line:
    -   IS 3646
    -   NBC 2016
    -   EN 12464
    -   ECBC
4.  Status strip:
    -   Check icon.
    -   **Compliant**.
    -   **View Report** action.

### 12.3 Styling

-   Teal outline icon.
-   Standards shown as one compact line or wrapping naturally on
    narrower widths.
-   Status strip uses a pale green background and green border.
-   Compliant label in deep green.
-   View Report aligned to the far right in teal.

### 12.4 Important implementation rule

Do not hard-code "Compliant" as a permanent state. The status must be
generated from the actual checks performed by the system. If checks are
incomplete, show an appropriate state such as Pending or Needs Review.
The project brief identifies standards and compliance rules, but a
dashboard label alone is not proof that every calculation has passed.

**Why this panel exists:** it makes the standards basis and review state
visible without forcing the user to open a separate compliance report.

------------------------------------------------------------------------

## 13. Bottom section --- Design Pipeline

### 13.1 Placement

-   Full width beneath all three dashboard columns.
-   Approximately 165--170 px high in the reference.
-   24--26 px horizontal page margin.
-   16--18 px gap above.
-   One large rounded card.

### 13.2 Left introduction block

-   Stacked-layers icon.
-   Title: **Design Pipeline**.
-   Description: **End-to-end automated workflow from layout to
    procurement.**

This block occupies approximately 22% of the pipeline card width.

A vertical divider separates the introduction from the workflow stages.

### 13.3 Workflow stages

The pipeline shows five stages connected horizontally:

    Order Stage                Supporting description
  ------- -------------------- ------------------------
        1 Import Layout        DXF / DWG / PDF
        2 Spatial Analysis     Rooms · RCR · Classify
        3 Lighting Design      Lux · Grid · Fixtures
        4 Electrical Routing   Conduit · Cable · Load
        5 BOM / BOQ            Quantities · Cost

### 13.4 Stage visual design

Each stage contains: - Circular icon container. - Stage title beneath. -
Short helper text beneath the title.

Connect stages with thin horizontal lines. Lines should align to the
vertical centre of the circular icon containers.

The first stage is visually active in the reference: - Teal outline. -
Pale teal or white interior. - Teal icon.

Other stages use warm neutral borders and charcoal icons.

### 13.5 Pipeline behaviour

The pipeline should reflect actual processing state: - Not started. - In
progress. - Completed. - Needs attention / failed.

Do not make all stages appear complete when only a layout has been
imported. The active stage should be visually distinct, while completed
stages can use a green or teal check indicator.

**Why this section exists:** it explains the complete process and gives
the user a mental model of how a floor plan becomes a procurement
output.

------------------------------------------------------------------------

## 14. Information architecture and navigation behaviour

The primary navigation should map to distinct product workspaces:

  -----------------------------------------------------------------------
  Navigation                          Intended purpose
  ----------------------------------- -----------------------------------
  Dashboard                           Project overview, current
                                      floor-plan status, summary metrics

  Projects                            Project list, floors, versions,
                                      revisions, and project metadata

  Design                              Spatial analysis, lighting
                                      calculations, fixture placement,
                                      heatmaps

  BOM / BOQ                           Detailed material schedule,
                                      quantities, pricing, and exports

  Standards                           Standards library, rules, target
                                      illuminance, and compliance
                                      settings

  Library                             Fixture catalogue, photometric
                                      data, and reusable project assets
  -----------------------------------------------------------------------

The dashboard is a summary and launch point. Avoid placing every
engineering control directly on the dashboard. Keep advanced controls in
their relevant workspace.

------------------------------------------------------------------------

## 15. Engineering content that should connect to the dashboard

The dashboard's visible summary should be backed by the project engine
described in the project overview.

### 15.1 Spatial analysis

Relevant data: - Room area. - Perimeter. - Aspect ratio. - Ceiling
height and workplane height. - Room cavity height. - Surface
reflectance. - Room classification. - Target illuminance. - Glare and
uniformity criteria.

### 15.2 Lighting design

Relevant data: - RCR. - Luminaire photometric data. - UF and MF. -
Required luminaire count. - Grid arrangement and spacing. - SHR
validation. - Point-by-point illuminance. - Average and minimum
illuminance. - Uniformity ratio.

### 15.3 Electrical routing

Relevant data: - Primary trunk routes. - Secondary branches. -
Daisy-chain runs. - Vertical drops. - Cable and conduit sizes. - Conduit
fill. - Pull-box intervals. - Circuit splitting. - Phase balancing. -
Wastage allowance.

### 15.4 BOM / BOQ hierarchy

The source brief defines six tiers. The detailed BOQ view should
preserve these categories:

1.  **Luminaires** --- LED troffers, linear battens, downlights,
    high-bays, cleanroom luminaires.
2.  **Drivers & Emergency** --- DALI-2 / 1-10V / fixed-output drivers,
    emergency inverters, battery packs.
3.  **Conduits & Enclosures** --- GI / rigid PVC conduits, junction
    boxes, elbows, couplers.
4.  **Wiring & Cabling** --- copper wires, phase, neutral, and earth
    conductors.
5.  **Switchgear & Controls** --- DBs, MCBs, RCCBs, PIR sensors, modular
    switches.
6.  **Mounting Hardware & Labor** --- suspension hardware, fasteners,
    saddles, bushes, installation labour.

The dashboard shows a compact summary; the detailed BOM screen should
expose all six tiers and their derivation rules.

------------------------------------------------------------------------

## 16. Components and reusable UI patterns

Build the dashboard from reusable components rather than one monolithic
page.

Suggested component tree:

``` text
AppShell
├── BrandHeader
├── PrimaryNavigation
└── DashboardPage
    ├── DashboardGrid
    │   ├── LeftColumn
    │   │   ├── ProjectOverviewCard
    │   │   └── RecentProjectsCard
    │   ├── LightingWorkspaceCard
    │   │   ├── WorkspaceHeader
    │   │   ├── ViewModeTabs
    │   │   ├── FloorPlanCanvas
    │   │   ├── LuxLegend
    │   │   ├── FloorPlanMetrics
    │   │   └── CanvasControls
    │   └── RightColumn
    │       ├── BOMSummaryCard
    │       └── ComplianceCard
    └── DesignPipelineCard
```

Reusable primitives: - `PanelCard` - `PanelHeader` - `OutlineIcon` -
`StatusPill` - `MetricRow` - `SegmentedTabs` - `PrimaryOutlineButton` -
`FloorPlanToolbarButton` - `Divider` - `PipelineStep`

Maintain consistent padding, radius, border, and typography across these
components.

------------------------------------------------------------------------

## 17. Spacing, alignment, and sizing tokens

Use a consistent spacing scale:

  Token         Value Typical use
  ----------- ------- ----------------------------
  `space-1`      4 px Icon-to-label micro gap
  `space-2`      8 px Compact control spacing
  `space-3`     12 px Row / small component gaps
  `space-4`     16 px Card-to-card gap
  `space-5`     20 px Card inner padding
  `space-6`     24 px Major section spacing
  `space-8`     32 px Workspace top offset

Alignment rules: - Align all major card tops across the three columns. -
Align panel titles to a common internal left edge. - Align project row
names and areas vertically. - Align BOM quantity values to the right
edge. - Align the floor-plan metrics strip with the canvas content. -
Keep the right column's two cards exactly on the same width. - Keep the
pipeline title block and five stages vertically centred.

Avoid arbitrary per-card spacing. Use the spacing scale consistently.

------------------------------------------------------------------------

## 18. Borders, radii, shadows, and surfaces

### 18.1 Borders

-   Main card: 1 px warm beige-grey.
-   Inner separators: 1 px, slightly lighter.
-   Active control: 1 px teal.
-   Focus state: 2 px visible teal outline with offset.

### 18.2 Corner radii

  Component                      Radius
  ------------------------- -----------
  Main cards                  12--14 px
  Buttons                      8--10 px
  Status pills                   999 px
  Icon containers              8--10 px
  Circular pipeline icons           50%
  Segmented control                9 px

### 18.3 Shadows

Keep shadows almost imperceptible: - Main cards: subtle warm shadow. -
Buttons: no strong drop shadow. - Menus/popovers: slightly stronger
shadow only when floating above content.

The reference relies primarily on surface contrast and borders, not
depth effects.

------------------------------------------------------------------------

## 19. Iconography

Use a consistent outline icon family such as Lucide.

Recommended icon concepts: - Project Overview: building / office. -
Recent Projects: building or file. - Lighting Layout: layers / lightbulb
/ grid. - BOM / BOQ: stacked layers or package. - Compliance:
shield-check. - Import Layout: upload. - Spatial Analysis: scan /
grid. - Lighting Design: lightbulb. - Electrical Routing: route /
nodes. - BOM / BOQ pipeline: file-text.

Icon rules: - Use one consistent stroke weight. - Standard sizes: 18--20
px for panel headings, 16 px for navigation, 20--24 px for pipeline
icons. - Teal for primary function icons. - Charcoal for neutral
navigation icons. - Green only for success states. - Avoid mixing
filled, outlined, and multi-colour icon styles.

------------------------------------------------------------------------

## 20. Responsive behaviour

The reference is a desktop-first engineering dashboard. Responsive
behaviour should preserve hierarchy rather than compress every card into
a tiny grid.

### 20.1 Large desktop --- 1440 px and above

-   Keep the three-column layout.
-   Centre column remains widest.
-   Pipeline remains full width.
-   Floor plan has enough area to be inspected without excessive zoom.

### 20.2 Laptop --- 1024 to 1439 px

-   Reduce outer margins to 18--20 px.
-   Reduce card padding slightly.
-   Preserve the three columns only if the centre canvas remains usable.
-   Otherwise move the right column below the centre workspace.

### 20.3 Tablet --- 768 to 1023 px

-   Use two-column layout.
-   Left column and right summary cards may share a row.
-   Lighting workspace spans full width.
-   Pipeline may wrap into two rows.
-   Keep floor-plan controls visible.

### 20.4 Mobile --- below 768 px

Stack in this order: 1. Brand header. 2. Compact navigation / menu. 3.
Project Overview. 4. Lighting Layout and Heatmap. 5. BOM / BOQ Summary.
6. Design Compliance. 7. Recent Projects. 8. Design Pipeline.

On mobile: - Floor-plan canvas must support pan and zoom. - Heatmap
legend should remain accessible. - Tables may horizontally scroll or
switch to stacked item rows. - Do not hide important compliance or
quantity information.

------------------------------------------------------------------------

## 21. Accessibility and usability requirements

-   Maintain readable contrast between text and warm backgrounds.
-   Never communicate status by colour alone; include text labels and/or
    icons.
-   All controls must be keyboard accessible.
-   Provide visible focus indicators.
-   Use descriptive labels for icon-only controls, including zoom and
    fit-to-view.
-   Provide accessible names for tabs and clearly expose the selected
    tab.
-   Ensure status pills remain readable at normal zoom.
-   Do not use tiny text for essential engineering values.
-   Do not rely on the heatmap alone; provide numerical illuminance and
    uniformity summaries.
-   Provide a text/table alternative for floor-plan information where
    practical.

------------------------------------------------------------------------

## 22. Interaction and state specification

  -----------------------------------------------------------------------
  Component               Interaction             Expected result
  ----------------------- ----------------------- -----------------------
  Dashboard navigation    Select                  Opens dashboard
                                                  overview

  Projects navigation     Select                  Opens project list

  Design navigation       Select                  Opens design workspace

  BOM / BOQ navigation    Select                  Opens detailed material
                                                  schedule

  Standards navigation    Select                  Opens standards and
                                                  compliance settings

  Library navigation      Select                  Opens fixture and asset
                                                  library

  New Project             Click                   Starts project creation
                                                  / plan import

  Recent project row      Click                   Opens selected project

  View All                Click                   Opens complete project
                                                  list

  Layout tab              Select                  Displays plan and
                                                  fixture arrangement

  Lux Map tab             Select                  Displays illuminance
                                                  heatmap

  Routing tab             Select                  Displays conduit and
                                                  cable paths

  3D tab                  Select                  Opens 3D view if
                                                  available

  Fit-to-view             Click                   Fits complete plan to
                                                  canvas

  Zoom plus/minus         Click                   Changes canvas zoom

  Generate BOM / BOQ      Click                   Generates detailed
                                                  material schedule

  View Report             Click                   Opens compliance report

  Pipeline stage          Click, if enabled       Opens the corresponding
                                                  workflow step
  -----------------------------------------------------------------------

Show loading, empty, error, and success states. Avoid leaving buttons
visually active if the underlying feature is not implemented.

------------------------------------------------------------------------

## 23. Data integrity and demo-content rules

The approved reference contains example project names and example
quantities. These values should be treated as visual reference content
unless they are intentionally loaded as demo data.

Do not imply that: - A project is compliant before its checks have
run. - A BOM quantity is final before routing and fixture calculations
complete. - A lux value is verified without a completed photometric
calculation. - A project status is live unless it is connected to the
actual project state.

The UI should clearly distinguish: - Calculated values. - User-entered
values. - Defaults or assumptions. - Estimated quantities. - Final /
approved quantities.

For engineering review, provide traceability from each BOM line item
back to the floor, room, circuit, route, or fixture calculation that
produced it.

------------------------------------------------------------------------

## 24. Recommended implementation structure

The project overview identifies a proposed stack of Next.js 16, React
19, TypeScript, Tailwind CSS v4, and an HTML5 Canvas spatial rendering
engine. The UI can be structured around reusable React components and a
dedicated floor-plan rendering layer.

Suggested frontend modules:

``` text
src/
├── app/
│   └── dashboard/
├── components/
│   ├── shell/
│   │   ├── BrandHeader
│   │   └── PrimaryNavigation
│   ├── dashboard/
│   │   ├── ProjectOverviewCard
│   │   ├── RecentProjectsCard
│   │   ├── LightingWorkspaceCard
│   │   ├── BOMSummaryCard
│   │   ├── ComplianceCard
│   │   └── DesignPipelineCard
│   ├── floorplan/
│   │   ├── FloorPlanCanvas
│   │   ├── LuxHeatmapLayer
│   │   ├── FixtureLayer
│   │   ├── RoutingLayer
│   │   └── CanvasControls
│   └── ui/
│       ├── PanelCard
│       ├── StatusPill
│       ├── SegmentedTabs
│       └── ActionButton
├── data/
├── hooks/
├── lib/
└── styles/
    └── tokens.css
```

Keep the geometry, lighting calculations, routing, and BOM generation
logic separate from presentation components. The dashboard should
consume typed project and calculation results rather than embedding
engineering calculations in UI code.

------------------------------------------------------------------------

## 25. Suggested CSS design tokens

``` css
:root {
  /* Surfaces */
  --color-page: #FBF8F4;
  --color-surface: #FFFCF8;
  --color-surface-raised: #FFFFFF;
  --color-surface-muted: #F5EFE8;

  /* Borders */
  --color-border: #E7DED4;
  --color-border-strong: #D9CEC2;
  --color-divider: #EEE7DF;

  /* Text */
  --color-text: #202321;
  --color-text-secondary: #62645F;
  --color-text-muted: #8A8982;

  /* Brand accents */
  --color-teal: #0B9B8A;
  --color-teal-deep: #087F73;
  --color-teal-soft: #E5F4EF;

  /* Semantic */
  --color-success: #087A4B;
  --color-success-soft: #E5F4E9;
  --color-warning: #D97706;
  --color-warning-soft: #FFF0D9;
  --color-info: #267F79;

  /* Geometry */
  --radius-card: 13px;
  --radius-control: 9px;
  --radius-pill: 999px;

  /* Spacing */
  --page-gutter: 26px;
  --card-padding: 18px;
  --grid-gap: 16px;

  /* Elevation */
  --shadow-card: 0 1px 3px rgba(55, 42, 28, 0.04);
}
```

------------------------------------------------------------------------

## 26. Pixel-consistency review checklist

Use this checklist when comparing the implementation with the approved
warm light-theme reference.

### Global composition

-   [ ] Warm ivory background; no cold blue cast.
-   [ ] Header and navigation occupy two distinct horizontal rows.
-   [ ] Main dashboard begins with consistent top spacing.
-   [ ] Three-column desktop composition is preserved.
-   [ ] Centre lighting workspace is visibly the largest panel.
-   [ ] Bottom pipeline spans the full dashboard width.

### Header and navigation

-   [ ] L&T logo is left aligned.
-   [ ] Product title sits after a vertical divider.
-   [ ] EDRC, B&F MEP, Smart World, and profile control are right
    aligned.
-   [ ] Dashboard is the active navigation item.
-   [ ] Active underline is teal and thin.

### Left column

-   [ ] Project Overview is the upper card.
-   [ ] New Project action spans the card width.
-   [ ] Recent Projects sits directly below.
-   [ ] Project names, areas, and status pills align consistently.
-   [ ] Status colours are semantic and restrained.

### Centre workspace

-   [ ] Lighting Layout · Lux Heatmap title is at upper left.
-   [ ] Layout / Lux Map / Routing / 3D tabs are at upper right.
-   [ ] Floor plan is centred and not clipped.
-   [ ] Heatmap overlay does not obscure architectural linework.
-   [ ] Lux legend is to the right of the plan.
-   [ ] Floor and analysis metrics sit below the canvas.
-   [ ] Fit, zoom out, and zoom in controls align at bottom right.

### Right column

-   [ ] BOM / BOQ Summary is above Design Compliance.
-   [ ] Quantities align to the right.
-   [ ] Row separators are subtle.
-   [ ] Generate BOM / BOQ button spans the inner card width.
-   [ ] Compliance standards are visible.
-   [ ] Compliance state uses a pale green strip and readable text.

### Pipeline

-   [ ] Pipeline card spans the full content width.
-   [ ] Introductory block is on the left.
-   [ ] Vertical divider separates introduction from stages.
-   [ ] Five stages appear in the correct order.
-   [ ] Connector lines align through icon centres.
-   [ ] Active stage is teal; inactive stages are neutral.

### Visual system

-   [ ] Warm beige-grey borders, not blue-grey borders.
-   [ ] Rounded corners are consistent.
-   [ ] Shadows are subtle.
-   [ ] Typography hierarchy is consistent.
-   [ ] Icons use one outline style.
-   [ ] Teal is the primary accent; green and amber are semantic.
-   [ ] No unnecessary gradients, decoration, or oversized effects.

### Functional integrity

-   [ ] Every visible control has a real action.
-   [ ] Tabs switch the visual layer.
-   [ ] Zoom and fit controls work.
-   [ ] BOM generation uses actual calculation results.
-   [ ] Compliance status reflects completed checks.
-   [ ] Pipeline state reflects the actual workflow.
-   [ ] Demo values are clearly distinguished from live engineering
    results.

------------------------------------------------------------------------

## 27. Final design definition

The approved L&T dashboard is a **warm, minimal, enterprise engineering
interface** built around a three-column workspace and a full-width
workflow pipeline.

Its defining characteristics are: - Warm ivory canvas and white/cream
cards. - Fine beige-grey borders and restrained rounded corners. - Deep
teal as the primary interaction colour. - Green for successful and
compliant states. - Amber for warnings and processing. - A large central
architectural floor plan with a readable lux heatmap. - Compact project
and BOM summaries at the sides. - A clear five-stage pipeline along the
bottom. - A calm typographic hierarchy and minimal iconography.

The final implementation should preserve this information architecture
and visual balance at the target desktop viewport. It should be visually
close to the approved reference while remaining responsive, accessible,
data-driven, and technically honest about calculated versus illustrative
values.
