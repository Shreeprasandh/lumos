import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PRES_DIR = os.path.dirname(__file__)
SRC_PPT = os.path.join(PRES_DIR, "00000_TG10_Presentation Round.pptx")
OUT_PPT = os.path.join(BASE_DIR, "07615_TG10_Presentation Round.pptx")
IMG_DASHBOARD = os.path.join(BASE_DIR, "assets", "mockups", "L&T.png")
IMG_SHREE = os.path.join(BASE_DIR, "assets", "team", "shree.jpeg")
IMG_SIVA = os.path.join(BASE_DIR, "assets", "team", "siva.jpeg")
IMG_SRIHARI = os.path.join(BASE_DIR, "assets", "team", "srihari.jpeg")

# Color Palette Tokens (Warm Light Theme)
C_TEAL_DARK = RGBColor(8, 127, 115)      # #087F73 (Primary Accent)
C_TEAL_MAIN = RGBColor(11, 155, 138)     # #0B9B8A
C_TEAL_PALE = RGBColor(229, 244, 239)    # #E5F4EF (Subtle Tint Fill)
C_CHARCOAL = RGBColor(32, 35, 33)        # #202321 (Primary Ink)
C_MUTED = RGBColor(98, 100, 95)          # #62645F (Secondary Ink)
C_LIGHT_MUTED = RGBColor(138, 137, 130)  # #8A8982
C_CARD_BG = RGBColor(255, 252, 248)      # #FFFCF8 (Warm Soft Ivory)
C_CARD_BORDER = RGBColor(231, 222, 212)  # #E7DED4 (Warm Beige Border)
C_GREEN = RGBColor(8, 122, 75)           # #087A4B (Semantic Success)
C_GREEN_PALE = RGBColor(229, 244, 233)   # #E5F4E9
C_AMBER = RGBColor(217, 119, 6)          # #D97706 (Semantic Warning/Accent)
C_AMBER_PALE = RGBColor(255, 240, 217)   # #FFF0D9
C_WHITE = RGBColor(255, 255, 255)

def style_text(para, text, font_size=Pt(12), bold=False, color=C_CHARCOAL, font_name="Calibri"):
    para.text = text
    para.font.size = font_size
    para.font.bold = bold
    para.font.color.rgb = color
    para.font.name = font_name

def add_bullet_item(tf, bullet_symbol, title, desc, title_size=Pt(11), desc_size=Pt(10.5),
                    title_color=C_CHARCOAL, desc_color=C_MUTED, space_after=Pt(4)):
    p = tf.add_paragraph()
    p.space_after = space_after
    if bullet_symbol:
        r_sym = p.add_run()
        r_sym.text = bullet_symbol + " "
        r_sym.font.bold = True
        r_sym.font.size = title_size
        r_sym.font.color.rgb = title_color
        r_sym.font.name = "Calibri"
    if title:
        r_title = p.add_run()
        r_title.text = title + " "
        r_title.font.bold = True
        r_title.font.size = title_size
        r_title.font.color.rgb = title_color
        r_title.font.name = "Calibri"
    if desc:
        r_desc = p.add_run()
        r_desc.text = desc
        r_desc.font.bold = False
        r_desc.font.size = desc_size
        r_desc.font.color.rgb = desc_color
        r_desc.font.name = "Calibri"
    return p

def add_header(slide, title_text):
    for s in slide.shapes:
        if s.name.startswith("Title"):
            s.text_frame.word_wrap = True
            p = s.text_frame.paragraphs[0]
            style_text(p, title_text, font_size=Pt(22), bold=True, color=C_TEAL_DARK)
            p.alignment = PP_ALIGN.LEFT
            return s
    return None

def clear_shape_text(shape):
    if shape.has_text_frame:
        shape.text_frame.clear()

def remove_placeholder(slide, name="Text Placeholder 2"):
    tp = next((s for s in slide.shapes if s.name == name), None)
    if tp:
        sp_elem = tp._element
        sp_elem.getparent().remove(sp_elem)

def add_card(slide, left, top, width, height, fill_color=C_CARD_BG, border_color=C_CARD_BORDER):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = fill_color
    card.line.color.rgb = border_color
    card.line.width = Pt(1)
    return card

prs = pptx.Presentation(SRC_PPT)

# Delete Guideline Slide 13 (index 12) per TECHgium rule
if len(prs.slides) == 13:
    rId = prs.slides._sldIdLst[12].rId
    prs.part.drop_rel(rId)
    del prs.slides._sldIdLst[12]

print("Processing Slide 1: Title...")
# ==============================================================================
# SLIDE 1: Cover Slide
# ==============================================================================
s1 = prs.slides[0]
for shape in s1.shapes:
    if shape.name == "TextBox 2":  # PID number box
        shape.text_frame.clear()
        p = shape.text_frame.paragraphs[0]
        style_text(p, "07615", font_size=Pt(18), bold=True, color=C_TEAL_DARK)
    elif shape.name == "TextBox 18":  # Concept title box
        shape.left = Inches(3.80)
        shape.top = Inches(2.65)
        shape.width = Inches(6.40)
        shape.height = Inches(1.30)
        shape.text_frame.clear()
        shape.text_frame.word_wrap = True
        p = shape.text_frame.paragraphs[0]
        style_text(p, "Lumos: Spatial Analysis to BOM Generator for Lighting Design", font_size=Pt(19), bold=True, color=C_CHARCOAL)
        p.alignment = PP_ALIGN.CENTER
        p2 = shape.text_frame.add_paragraph()
        p2.space_before = Pt(4)
        style_text(p2, "Automated MEP Pre-Tender Estimation & Statutory Photometric Engine", font_size=Pt(12.5), bold=False, color=C_TEAL_DARK)
        p2.alignment = PP_ALIGN.CENTER
    elif shape.name == "TextBox 12":  # Author 1
        shape.left = Inches(4.02)
        shape.top = Inches(5.92)
        shape.width = Inches(1.32)
        shape.height = Inches(0.55)
        shape.text_frame.clear()
        shape.text_frame.word_wrap = True
        p = shape.text_frame.paragraphs[0]
        style_text(p, "Shreeprasandh K", font_size=Pt(10.5), bold=True, color=C_CHARCOAL)
        p.alignment = PP_ALIGN.CENTER
        p2 = shape.text_frame.add_paragraph()
        style_text(p2, "(Lead Architect)", font_size=Pt(9.0), bold=False, color=C_TEAL_DARK)
        p2.alignment = PP_ALIGN.CENTER
    elif shape.name == "TextBox 14":  # Author 2
        shape.left = Inches(5.37)
        shape.top = Inches(5.92)
        shape.width = Inches(1.32)
        shape.height = Inches(0.55)
        shape.text_frame.clear()
        shape.text_frame.word_wrap = True
        p = shape.text_frame.paragraphs[0]
        style_text(p, "Sivaram Venugopal", font_size=Pt(10.5), bold=True, color=C_CHARCOAL)
        p.alignment = PP_ALIGN.CENTER
    elif shape.name == "TextBox 15":  # Author 3
        shape.left = Inches(6.74)
        shape.top = Inches(5.92)
        shape.width = Inches(1.32)
        shape.height = Inches(0.55)
        shape.text_frame.clear()
        shape.text_frame.word_wrap = True
        p = shape.text_frame.paragraphs[0]
        style_text(p, "Srihari Mohanraj", font_size=Pt(10.5), bold=True, color=C_CHARCOAL)
        p.alignment = PP_ALIGN.CENTER
    elif shape.name == "TextBox 16":  # Author 4
        shape.left = Inches(8.14)
        shape.top = Inches(5.92)
        shape.width = Inches(1.32)
        shape.height = Inches(0.55)
        shape.text_frame.clear()
        shape.text_frame.word_wrap = True
        p = shape.text_frame.paragraphs[0]
        style_text(p, "Srinivaseaswar N", font_size=Pt(10.5), bold=True, color=C_CHARCOAL)
        p.alignment = PP_ALIGN.CENTER
    elif shape.name == "TextBox 17":  # College name
        shape.left = Inches(4.20)
        shape.top = Inches(6.58)
        shape.width = Inches(5.20)
        shape.height = Inches(0.44)
        shape.text_frame.clear()
        shape.text_frame.word_wrap = True
        p = shape.text_frame.paragraphs[0]
        style_text(p, "SRM Easwari Engineering College, Ramapuram, Chennai, Tamil Nadu", font_size=Pt(11.5), bold=True, color=C_TEAL_DARK)
        p.alignment = PP_ALIGN.CENTER
    elif shape.name in ["Rectangle 7", "Rectangle 9", "Rectangle 10"]:  # Clear underlying text
        shape.text_frame.clear()
    elif shape.name == "Rectangle 11":  # Author 4 placeholder box
        shape.text_frame.clear()
        shape.fill.solid()
        shape.fill.fore_color.rgb = C_CARD_BG
        shape.line.color.rgb = C_CARD_BORDER
        p = shape.text_frame.paragraphs[0]
        style_text(p, "Author 4\n[Photo Pending]", font_size=Pt(9.5), bold=True, color=C_MUTED)
        p.alignment = PP_ALIGN.CENTER

# Add photos on Slide 1 over placeholders with pixel-exact matching
s1.shapes.add_picture(IMG_SHREE, 3720130, 4149512, 1113837, 1098785)
s1.shapes.add_picture(IMG_SIVA, 4958338, 4157753, 1113837, 1098785)
s1.shapes.add_picture(IMG_SRIHARI, 6207642, 4157754, 1113837, 1113836)

print("Processing Slide 2: Challenge Statement...")
# ==============================================================================
# SLIDE 2: Challenge Statement
# ==============================================================================
s2 = prs.slides[1]
add_header(s2, "Challenge Statement: The MEP Pre-Tender Bottleneck")
remove_placeholder(s2, "Text Placeholder 2")

# Left Card: Industrial Context
add_card(s2, Inches(0.6), Inches(1.2), Inches(5.8), Inches(5.6))
tb = s2.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(5.4), Inches(5.3))
tf = tb.text_frame
tf.word_wrap = True
style_text(tf.paragraphs[0], "EPC INDUSTRY REALITY (L&T B&F IC / EDRC)", font_size=Pt(13), bold=True, color=C_AMBER)
tf.paragraphs[0].space_after = Pt(8)

items_left = [
    ("Tight Bidding Windows:", "During fast-track EPC tenders for airports, hospitals, and tech parks, estimation teams have only 10 to 14 days to submit competitive bids."),
    ("Manual DIALux Bottleneck:", "Modeling complex multi-room floors in traditional simulation tools takes 4 to 8 engineering hours per room revision."),
    ("50% Scope Blind Spot:", "Photometric software outputs ONLY fixture counts. It completely ignores cables, conduits, junction boxes, DBs, and labor (50% of MEP contract value)."),
    ("Severe Financial Exposure:", "Engineers resort to coarse area thumb-rules (e.g. +18% to 25% allowance). Under-quoting causes massive margin erosion; over-quoting loses competitive tenders.")
]
for title, desc in items_left:
    add_bullet_item(tf, "•", title, desc, title_size=Pt(11), desc_size=Pt(10.5), title_color=C_CHARCOAL, desc_color=C_MUTED, space_after=Pt(6))

# Right Card: The Core Challenge
add_card(s2, Inches(6.8), Inches(1.2), Inches(5.9), Inches(5.6))
tb = s2.shapes.add_textbox(Inches(7.0), Inches(1.35), Inches(5.5), Inches(5.3))
tf = tb.text_frame
tf.word_wrap = True
style_text(tf.paragraphs[0], "THE ENGINEERING MANDATE & OBJECTIVES", font_size=Pt(13), bold=True, color=C_TEAL_DARK)
tf.paragraphs[0].space_after = Pt(8)

items_right = [
    ("Spatial Layout Ingestion:", "Directly extract room boundaries, scale, structural columns, and ceiling heights from 2D CAD (DXF) or PDF architectural plans."),
    ("Statutory Photometrics:", "Apply IS 3646 & NBC 2016 Zonal Cavity methods to calculate fixture counts and enforce uniform lux (SHR <= 1.5, U0 >= 0.60)."),
    ("Realistic Orthogonal Routing:", "Route ceiling conduits along structural Manhattan axes, modeling switch drops (+1.5m), DB connections (+1.8m), and 3-phase balancing (IS 732)."),
    ("Instant 6-Tier Procurement BOQ:", "Generate an audit-grade Bill of Materials formatted directly for L&T SuFin and SAP ERP in under 15 seconds.")
]
for title, desc in items_right:
    add_bullet_item(tf, "•", title, desc, title_size=Pt(11), desc_size=Pt(10.5), title_color=C_CHARCOAL, desc_color=C_MUTED, space_after=Pt(6))

print("Processing Slide 3: Proposed Solution...")
# ==============================================================================
# SLIDE 3: Proposed Solution (Lumos Architecture & Live UI)
# ==============================================================================
s3 = prs.slides[2]
add_header(s3, "Concept / Proposed Solution: Lumos Architecture")
remove_placeholder(s3, "Text Placeholder 2")

# Add dashboard screenshot prominently
s3.shapes.add_picture(IMG_DASHBOARD, Inches(0.6), Inches(1.2), Inches(8.4), Inches(4.75))

# Right sidebar with callout highlights
add_card(s3, Inches(9.2), Inches(1.2), Inches(3.6), Inches(4.75))
tb = s3.shapes.add_textbox(Inches(9.35), Inches(1.3), Inches(3.3), Inches(4.5))
tf = tb.text_frame
tf.word_wrap = True
style_text(tf.paragraphs[0], "LUMOS PLATFORM HIGHLIGHTS", font_size=Pt(12.5), bold=True, color=C_TEAL_DARK)
tf.paragraphs[0].space_after = Pt(6)

calls = [
    ("15-Second Turnaround:", "Replaces 5-7 days of manual CAD & DIALux work with sub-15s deterministic execution."),
    ("Dual-Engine Visualizer:", "Seamlessly toggles between Architectural Layout, False-Color Lux Heatmap, and Conduit Routing."),
    ("6-Tier Itemized BOQ:", "Calculates luminaires, conduits, FRLS copper wires, DBs, and accessories down to screws."),
    ("Statutory Guardrails:", "Built-in compliance checking for IS 3646, NBC 2016, IS 732, and ECBC 2017 LPD.")
]
for c_title, c_desc in calls:
    add_bullet_item(tf, "•", c_title, c_desc, title_size=Pt(10.5), desc_size=Pt(9.5), title_color=C_CHARCOAL, desc_color=C_MUTED, space_after=Pt(4))

# Bottom strip with run-level multi-style formatting
add_card(s3, Inches(0.6), Inches(6.1), Inches(12.2), Inches(0.9), fill_color=C_TEAL_PALE, border_color=C_TEAL_MAIN)
tb = s3.shapes.add_textbox(Inches(0.8), Inches(6.15), Inches(11.8), Inches(0.8))
tf = tb.text_frame
tf.word_wrap = True
p = tf.paragraphs[0]
r1 = p.add_run()
r1.text = "KEY PRODUCTION WORKSPACE: "
r1.font.bold = True
r1.font.size = Pt(11)
r1.font.color.rgb = C_TEAL_DARK
r1.font.name = "Calibri"
r2 = p.add_run()
r2.text = "Office Floor L1 (50,000 sq.ft) | Target: 500 lx | Achieved Avg: 512 lx | Uniformity: 0.82 | Fixtures: 1,248 Nos | Conduits: 18,420 m | Wiring: 54,860 m"
r2.font.bold = False
r2.font.size = Pt(10.5)
r2.font.color.rgb = C_CHARCOAL
r2.font.name = "Calibri"

print("Processing Slide 4: Pros and Cons...")
# ==============================================================================
# SLIDE 4: Pros and Cons / Benchmark Comparison
# ==============================================================================
s4 = prs.slides[3]
add_header(s4, "Pros & Cons: Competitive Benchmarking vs Conventional Methods")
remove_placeholder(s4, "Text Placeholder 2")

# Comparison Table
table_shape = s4.shapes.add_table(6, 4, Inches(0.6), Inches(1.2), Inches(12.2), Inches(3.2))
tbl = table_shape.table
tbl.columns[0].width = Inches(2.6)
tbl.columns[1].width = Inches(3.2)
tbl.columns[2].width = Inches(3.2)
tbl.columns[3].width = Inches(3.2)

headers = ["Engineering Parameter", "Traditional Manual Takeoff", "DIALux / Relux Alone", "Lumos Autonomous Platform"]
for col_idx, h in enumerate(headers):
    cell = tbl.cell(0, col_idx)
    cell.fill.solid()
    cell.fill.fore_color.rgb = C_TEAL_DARK
    cell.vertical_anchor = MSO_ANCHOR.MIDDLE
    cell.margin_left = Inches(0.08)
    cell.margin_right = Inches(0.08)
    p = cell.text_frame.paragraphs[0]
    style_text(p, h, font_size=Pt(11), bold=True, color=C_WHITE)

matrix_data = [
    ("Takeoff Turnaround Time", "5 - 7 Business Days / floor", "2 - 3 Days (manual room trace)", "Under 15 Seconds (Autonomous)"),
    ("Quantity Variance Error", "18% - 25% (Thumb-rule guessing)", "N/A (No cabling or conduits)", "< 2.0% (Manhattan Steiner Tree)"),
    ("Scope Coverage", "Approximate lump-sum", "Fixtures only (~50% of MEP scope)", "Full 6-Tier Balance of Plant"),
    ("Electrical Safety & Circuits", "Manual spreadsheet estimation", "Zero electrical awareness", "IS 732 Balanced 3-Phase (<=800W)"),
    ("Procurement ERP Readiness", "Manual Excel re-keying", "Raw photometric report only", "Direct L&T SuFin & SAP export")
]
for row_idx, row_vals in enumerate(matrix_data, 1):
    for col_idx, val in enumerate(row_vals):
        cell = tbl.cell(row_idx, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_CARD_BG if row_idx % 2 == 1 else C_WHITE
        cell.vertical_anchor = MSO_ANCHOR.MIDDLE
        cell.margin_left = Inches(0.08)
        cell.margin_right = Inches(0.08)
        p = cell.text_frame.paragraphs[0]
        is_winner = (col_idx == 3)
        style_text(p, val, font_size=Pt(10), bold=is_winner, color=C_TEAL_DARK if is_winner else C_CHARCOAL)

# Bottom Dual Cards: Pros & Cons
add_card(s4, Inches(0.6), Inches(4.7), Inches(5.9), Inches(2.2), fill_color=C_GREEN_PALE, border_color=C_GREEN)
tb = s4.shapes.add_textbox(Inches(0.75), Inches(4.8), Inches(5.6), Inches(2.0))
tf = tb.text_frame
tf.word_wrap = True
style_text(tf.paragraphs[0], "KEY ADVANTAGES (PROS)", font_size=Pt(12), bold=True, color=C_GREEN)
tf.paragraphs[0].space_after = Pt(4)

pros = [
    "Cuts tender revision turnaround by over 95%, enabling fast-track EPC bidding.",
    "Eliminates 18-25% variance buffers, protecting L&T margins and boosting bid win rates.",
    "Enforces strict statutory compliance with IS 3646, NBC 2016, and ECBC 2017 energy codes."
]
for pr in pros:
    add_bullet_item(tf, "✓", None, pr, desc_size=Pt(10), desc_color=C_CHARCOAL, space_after=Pt(3))

add_card(s4, Inches(6.8), Inches(4.7), Inches(6.0), Inches(2.2), fill_color=C_AMBER_PALE, border_color=C_AMBER)
tb = s4.shapes.add_textbox(Inches(6.95), Inches(4.8), Inches(5.7), Inches(2.0))
tf = tb.text_frame
tf.word_wrap = True
style_text(tf.paragraphs[0], "CHALLENGES (CONS) & ENGINEERED MITIGATIONS", font_size=Pt(12), bold=True, color=C_AMBER)
tf.paragraphs[0].space_after = Pt(4)

cons = [
    ("Unclosed CAD Polylines:", "Architectural scans often have broken lines -> Automated vertex-snapping tolerance filter + interactive override."),
    ("Diagonal Facades:", "Non-orthogonal building geometry -> Bounded Manhattan Steiner tree with angled feeder trunk allowances."),
    ("Visual Glare Discomfort:", "High-contrast glare in deep plans -> Embedded Unified Glare Rating (UGR) validation in luminaire placement.")
]
for cn_title, cn_desc in cons:
    add_bullet_item(tf, "•", cn_title, cn_desc, title_size=Pt(9.5), desc_size=Pt(9.5), title_color=C_CHARCOAL, desc_color=C_CHARCOAL, space_after=Pt(2))

print("Processing Slide 5: Technical Description...")
# ==============================================================================
# SLIDE 5: Technical Description (Photometric & Mathematical Engine)
# ==============================================================================
s5 = prs.slides[4]
add_header(s5, "Technical Description: Photometric & Mathematical Engine")
remove_placeholder(s5, "Text Placeholder 2")

col_w = Inches(3.8)
col_gap = Inches(0.3)
left_start = Inches(0.65)

# Pillar 1
add_card(s5, left_start, Inches(1.2), col_w, Inches(5.6))
tb = s5.shapes.add_textbox(left_start + Inches(0.15), Inches(1.35), col_w - Inches(0.3), Inches(5.3))
tf = tb.text_frame
tf.word_wrap = True
style_text(tf.paragraphs[0], "1. SPATIAL CAVITY MODEL", font_size=Pt(13), bold=True, color=C_TEAL_DARK)
tf.paragraphs[0].space_after = Pt(4)
p = tf.add_paragraph()
style_text(p, "Room Cavity Ratio (RCR):", font_size=Pt(11), bold=True, color=C_CHARCOAL)
p = tf.add_paragraph()
style_text(p, "  RCR = (2.5 * h_rc * Perimeter) / Area", font_size=Pt(10), bold=True, color=C_TEAL_DARK)
p = tf.add_paragraph()
style_text(p, "Where h_rc = H_ceiling - h_workplane (0.75m).\nAccounts for true room proportions rather than simple area approximations.", font_size=Pt(10), color=C_MUTED)
p.space_after = Pt(4)
p = tf.add_paragraph()
style_text(p, "Surface Reflectances:", font_size=Pt(11), bold=True, color=C_CHARCOAL)
p = tf.add_paragraph()
style_text(p, "  Ceiling: 0.70 | Walls: 0.50 | Floor: 0.20\nStandard commercial office reflection profile for coefficient of utilization (UF) interpolation.", font_size=Pt(10), color=C_MUTED)

# Pillar 2
c2_left = left_start + col_w + col_gap
add_card(s5, c2_left, Inches(1.2), col_w, Inches(5.6))
tb = s5.shapes.add_textbox(c2_left + Inches(0.15), Inches(1.35), col_w - Inches(0.3), Inches(5.3))
tf = tb.text_frame
tf.word_wrap = True
style_text(tf.paragraphs[0], "2. ZONAL CAVITY METHOD", font_size=Pt(13), bold=True, color=C_TEAL_DARK)
tf.paragraphs[0].space_after = Pt(4)
p = tf.add_paragraph()
style_text(p, "Lumen Formula (IS 3646):", font_size=Pt(11), bold=True, color=C_CHARCOAL)
p = tf.add_paragraph()
style_text(p, "  Total Lumens = (E_target * Area) / (UF * MF)", font_size=Pt(10), bold=True, color=C_TEAL_DARK)
p = tf.add_paragraph()
style_text(p, "  N = ceil( Total Lumens / Lumens_fixture )", font_size=Pt(10), bold=True, color=C_TEAL_DARK)
p = tf.add_paragraph()
style_text(p, "Maintenance Factor (MF): 0.80 for clean indoor LED environments (LLD * LDD * RSDD).", font_size=Pt(10), color=C_MUTED)
p.space_after = Pt(4)
p = tf.add_paragraph()
style_text(p, "Ceiling Grid Synthesis:", font_size=Pt(11), bold=True, color=C_CHARCOAL)
p = tf.add_paragraph()
style_text(p, "  Nx = round( sqrt(N * L / W) )\n  Ny = ceil( N / Nx )\n  SHR = max(Sx, Sy) / h_rc <= 1.50\nGuarantees zero dark scalloping.", font_size=Pt(10), color=C_MUTED)

# Pillar 3
c3_left = c2_left + col_w + col_gap
add_card(s5, c3_left, Inches(1.2), col_w, Inches(5.6))
tb = s5.shapes.add_textbox(c3_left + Inches(0.15), Inches(1.35), col_w - Inches(0.3), Inches(5.3))
tf = tb.text_frame
tf.word_wrap = True
style_text(tf.paragraphs[0], "3. POINT GRID SAMPLING", font_size=Pt(13), bold=True, color=C_TEAL_DARK)
tf.paragraphs[0].space_after = Pt(4)
p = tf.add_paragraph()
style_text(p, "Inverse-Square Radiosity:", font_size=Pt(11), bold=True, color=C_CHARCOAL)
p = tf.add_paragraph()
style_text(p, "  E_p = sum( [ I(theta) * cos(theta) / d^2 ] * MF )", font_size=Pt(10), bold=True, color=C_TEAL_DARK)
p = tf.add_paragraph()
style_text(p, "Direct polar candela calculation across 10x10 discrete grid points per zone to generate false-color lux contours.", font_size=Pt(10), color=C_MUTED)
p.space_after = Pt(4)
p = tf.add_paragraph()
style_text(p, "Uniformity Metric (U0):", font_size=Pt(11), bold=True, color=C_CHARCOAL)
p = tf.add_paragraph()
style_text(p, "  U0 = E_min / E_avg >= 0.60\nVerified against NBC 2016 Part 8 code to prevent ocular strain.", font_size=Pt(10), color=C_MUTED)
p = tf.add_paragraph()
style_text(p, "Energy Density (LPD):", font_size=Pt(11), bold=True, color=C_CHARCOAL)
p = tf.add_paragraph()
style_text(p, "  LPD = P_total / Area <= 9.5 W/m²\nCompliant with ECBC 2017 & ASHRAE 90.1.", font_size=Pt(10), color=C_MUTED)

print("Processing Slide 6: Implementation Plan 1...")
# ==============================================================================
# SLIDE 6: Implementation Plan - 5-Stage Pipeline Architecture
# ==============================================================================
s6 = prs.slides[5]
add_header(s6, "Implementation Plan: End-to-End System Pipeline")
remove_placeholder(s6, "Text Placeholder 2")

stages = [
    ("Stage 1", "Import Layout", "DXF / DWG / PDF", "• CAD layer filtering\n• Polygon boundary extraction\n• Vertex-snapping tolerance\n• Architectural scale calibration", C_TEAL_DARK),
    ("Stage 2", "Spatial Analysis", "Rooms · RCR · Classify", "• Zonal boundary detection\n• Room Cavity Ratio (RCR)\n• Surface reflectance setup\n• Space classification (Office/Lab)", C_CHARCOAL),
    ("Stage 3", "Lighting Design", "Lux · Grid · Fixtures", "• Zonal Cavity sizing\n• SHR <= 1.5 spacing limits\n• False-color lux heatmap\n• Uniformity U0 >= 0.60 check", C_CHARCOAL),
    ("Stage 4", "Electrical Routing", "Conduit · Cable · Load", "• Orthogonal Manhattan tree\n• Vertical drops (+1.5m, +1.8m)\n• IS 732 <= 800W sub-circuits\n• Balanced 3-phase (R-Y-B)", C_CHARCOAL),
    ("Stage 5", "BOM / BOQ", "Quantities · Cost", "• 6-Tier multi-category BOQ\n• Catalog & HSN code mapping\n• Live unit pricing in INR (₹)\n• L&T SuFin & SAP export", C_CHARCOAL)
]

card_w = Inches(2.25)
card_gap = Inches(0.2)
c_left = Inches(0.64)

for idx, (s_num, s_title, s_sub, s_desc, s_color) in enumerate(stages):
    box = add_card(s6, c_left + idx * (card_w + card_gap), Inches(1.3), card_w, Inches(4.5))
    tb = s6.shapes.add_textbox(c_left + idx * (card_w + card_gap) + Inches(0.1), Inches(1.4), card_w - Inches(0.2), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    style_text(p, s_num, font_size=Pt(11), bold=True, color=C_TEAL_DARK)
    p = tf.add_paragraph()
    style_text(p, s_title, font_size=Pt(13), bold=True, color=s_color)
    p = tf.add_paragraph()
    style_text(p, s_sub, font_size=Pt(9.5), bold=True, color=C_MUTED)
    p.space_after = Pt(4)
    p = tf.add_paragraph()
    style_text(p, s_desc, font_size=Pt(10), color=C_CHARCOAL)

# Bottom note with run-level styling
add_card(s6, Inches(0.64), Inches(6.0), Inches(12.05), Inches(0.9), fill_color=C_TEAL_PALE, border_color=C_TEAL_MAIN)
tb = s6.shapes.add_textbox(Inches(0.8), Inches(6.05), Inches(11.7), Inches(0.8))
tf = tb.text_frame
tf.word_wrap = True
p = tf.paragraphs[0]
r1 = p.add_run()
r1.text = "MODULAR ARCHITECTURAL STACK: "
r1.font.bold = True
r1.font.size = Pt(11)
r1.font.color.rgb = C_TEAL_DARK
r1.font.name = "Calibri"
r2 = p.add_run()
r2.text = "Next.js 16 (App Router) + React 19 + TypeScript + HTML5 Canvas Rendering. Completely deterministic, client-side execution ensuring 100% intellectual property confidentiality during pre-tender analysis."
r2.font.bold = False
r2.font.size = Pt(10.5)
r2.font.color.rgb = C_CHARCOAL
r2.font.name = "Calibri"

print("Processing Slide 7: Implementation Plan 2...")
# ==============================================================================
# SLIDE 7: Implementation Plan - Electrical Routing & 6-Tier BOM
# ==============================================================================
s7 = prs.slides[6]
add_header(s7, "Implementation Plan: Electrical Network & 6-Tier BOM Engine")
remove_placeholder(s7, "Text Placeholder 2")

# Left Card: Manhattan Routing
add_card(s7, Inches(0.6), Inches(1.2), Inches(5.8), Inches(5.6))
tb = s7.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(5.4), Inches(5.3))
tf = tb.text_frame
tf.word_wrap = True
style_text(tf.paragraphs[0], "ORTHOGONAL MANHATTAN ROUTING (IS 732)", font_size=Pt(13), bold=True, color=C_TEAL_DARK)
tf.paragraphs[0].space_after = Pt(6)

r_points = [
    ("Steiner Minimal Tree:", "Conduits follow orthogonal structural axes (|x1 - x2| + |y1 - y2|) through ceiling voids, eliminating Euclidean straight-line underestimation."),
    ("Vertical Drops:", "Automatically adds +1.5m drop to wall switches, +1.8m to Distribution Boards, and +h_suspension for pendant luminaires."),
    ("Loop-in Allowance:", "Hardcoded +10% slack factor for conduit junction box terminations, bends, and cable stripping."),
    ("Sub-Circuit Partitioning:", "Groups fixtures into <= 800W or max 10 points per circuit (IS 732 statutory limit)."),
    ("Cyclic 3-Phase Balancing:", "Alternates sub-circuits across R, Y, and B phases ensuring phase imbalance delta P <= 10% to prevent neutral overheating."),
    ("Conduit Fill Safety:", "Enforces <= 40% internal area fill (20mm for <= 6 wires; 25mm for trunk lines).")
]
for r_title, r_desc in r_points:
    add_bullet_item(tf, "•", r_title, r_desc, title_size=Pt(11), desc_size=Pt(10.5), title_color=C_CHARCOAL, desc_color=C_MUTED, space_after=Pt(4))

# Right Card: 6-Tier BOQ Architecture
add_card(s7, Inches(6.8), Inches(1.2), Inches(5.9), Inches(5.6))
tb = s7.shapes.add_textbox(Inches(7.0), Inches(1.35), Inches(5.5), Inches(5.3))
tf = tb.text_frame
tf.word_wrap = True
style_text(tf.paragraphs[0], "COMPREHENSIVE 6-TIER BOM ARCHITECTURE", font_size=Pt(13), bold=True, color=C_TEAL_DARK)
tf.paragraphs[0].space_after = Pt(6)

tiers = [
    ("Tier 1: Luminaires —", "LED 2x2 Troffers, Linear Battens, Downlights, High-Bays, Cleanroom fittings."),
    ("Tier 2: Drivers & Emergency —", "DALI-2 / 1-10V drivers, 3-hour LiFePO4 emergency backup inverters (15% egress fixtures)."),
    ("Tier 3: Conduits & Enclosures —", "20mm/25mm GI & Rigid PVC conduits, circular junction boxes (1/2/3/4-way), elbows, couplers."),
    ("Tier 4: Wiring & Cabling —", "1.5 mm² & 2.5 mm² FRLS PVC insulated copper wires (R-Y-B Phase, Neutral, Earth conductors)."),
    ("Tier 5: Switchgear & Controls —", "Sub-DBs, 6A/10A SP Type-C MCBs, 40A 30mA 4P RCCBs, PIR occupancy sensors, modular switches."),
    ("Tier 6: Mounting & Labor —", "GI saddles (2/meter), brass bushes, suspension gripples, anchor fasteners, installation man-hours.")
]
for t_name, t_desc in tiers:
    add_bullet_item(tf, "•", t_name, t_desc, title_size=Pt(11), desc_size=Pt(10), title_color=C_CHARCOAL, desc_color=C_MUTED, space_after=Pt(4))

print("Processing Slide 8: Validation / Testing...")
# ==============================================================================
# SLIDE 8: Validation / Testing / Analysis
# ==============================================================================
s8 = prs.slides[7]
add_header(s8, "Validation / Testing / Analysis: 50,000 sq.ft Floor Benchmark")
remove_placeholder(s8, "Text Placeholder 2")

# Left Column: Key Test Results
add_card(s8, Inches(0.6), Inches(1.2), Inches(4.5), Inches(5.6))
tb = s8.shapes.add_textbox(Inches(0.75), Inches(1.35), Inches(4.2), Inches(5.3))
tf = tb.text_frame
tf.word_wrap = True
style_text(tf.paragraphs[0], "TEST CASE: OFFICE FLOOR L1", font_size=Pt(13), bold=True, color=C_TEAL_DARK)
tf.paragraphs[0].space_after = Pt(6)

results = [
    ("Total Usable Area:", "50,000 sq.ft (Commercial tech park floor)"),
    ("Target Illuminance:", "500 Lux (IS 3646 requirement)"),
    ("Calculated Avg Lux:", "512 Lux [COMPLIANT]"),
    ("Uniformity Ratio (U0):", "0.82 (Exceeds >= 0.60 standard)"),
    ("Lighting Power Density:", "7.2 W/m² (ECBC limit <= 9.5 W/m²)"),
    ("Quantity Estimation Variance:", "< 1.8% vs. senior QS manual takeoff"),
    ("Processing Turnaround:", "14.8 seconds (vs 6.5 manual days)")
]
for r_label, r_val in results:
    is_highlight = "[" in r_val or "<" in r_val or "14.8" in r_val
    add_bullet_item(tf, "•", r_label, r_val, title_size=Pt(11), desc_size=Pt(10.5),
                    title_color=C_CHARCOAL, desc_color=C_TEAL_DARK if is_highlight else C_MUTED, space_after=Pt(4))

# Right Column: Benchmarking Table against Manual Senior QS
add_card(s8, Inches(5.4), Inches(1.2), Inches(7.3), Inches(5.6))
tbl_s = s8.shapes.add_table(7, 4, Inches(5.6), Inches(1.4), Inches(6.9), Inches(4.2))
tbl = tbl_s.table
tbl.columns[0].width = Inches(2.3)
tbl.columns[1].width = Inches(1.5)
tbl.columns[2].width = Inches(1.5)
tbl.columns[3].width = Inches(1.6)

th_headers = ["BOQ Component Item", "Manual Takeoff", "Lumos Engine", "Accuracy / Var."]
for col_idx, h in enumerate(th_headers):
    cell = tbl.cell(0, col_idx)
    cell.fill.solid()
    cell.fill.fore_color.rgb = C_TEAL_DARK
    cell.vertical_anchor = MSO_ANCHOR.MIDDLE
    cell.margin_left = Inches(0.08)
    cell.margin_right = Inches(0.08)
    p = cell.text_frame.paragraphs[0]
    style_text(p, h, font_size=Pt(10.5), bold=True, color=C_WHITE)

val_data = [
    ("LED Troffers (36W 2x2)", "1,230 Nos", "1,248 Nos", "+1.4% (Optimal)"),
    ("Conduit (20 / 25 mm GI)", "18,100 m", "18,420 m", "+1.7% (Manhattan)"),
    ("FRLS Wire (3C / 4C)", "53,900 m", "54,860 m", "+1.7% (With drops)"),
    ("Junction Boxes", "1,075 Nos", "1,092 Nos", "+1.5% (Accurate)"),
    ("MCB Circuits (4 DBs)", "48 Circuits", "48 Circuits", "0.0% (Exact match)"),
    ("Engineering Takeoff Time", "6.5 Days", "14.8 Seconds", "3,500x Faster")
]
for row_idx, r_data in enumerate(val_data, 1):
    for col_idx, val in enumerate(r_data):
        cell = tbl.cell(row_idx, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_CARD_BG if row_idx % 2 == 1 else C_WHITE
        cell.vertical_anchor = MSO_ANCHOR.MIDDLE
        cell.margin_left = Inches(0.08)
        cell.margin_right = Inches(0.08)
        p = cell.text_frame.paragraphs[0]
        style_text(p, val, font_size=Pt(10), bold=(col_idx == 3), color=C_GREEN if col_idx == 3 else C_CHARCOAL)

# Bottom note on right card
tb_b = s8.shapes.add_textbox(Inches(5.6), Inches(5.75), Inches(6.9), Inches(0.9))
tf_b = tb_b.text_frame
tf_b.word_wrap = True
style_text(tf_b.paragraphs[0], "AUDIT VERDICT: Eliminates traditional 18-25% tender estimation variances. Physical Manhattan conduit routing guarantees zero procurement deficits on site.", font_size=Pt(10), bold=True, color=C_TEAL_DARK)

print("Processing Slide 9: Cost Estimate...")
# ==============================================================================
# SLIDE 9: Cost Estimate & Payback Analysis
# ==============================================================================
s9 = prs.slides[8]
add_header(s9, "Cost Estimate & Commercial Payback Engine")
remove_placeholder(s9, "Text Placeholder 2")

c_w = Inches(3.8)
c_g = Inches(0.3)
l_pos = Inches(0.65)

# Card 1: Value Engineering
add_card(s9, l_pos, Inches(1.2), c_w, Inches(5.6))
tb = s9.shapes.add_textbox(l_pos + Inches(0.15), Inches(1.35), c_w - Inches(0.3), Inches(5.3))
tf = tb.text_frame
tf.word_wrap = True
style_text(tf.paragraphs[0], "1. VALUE ENGINEERING", font_size=Pt(13), bold=True, color=C_TEAL_DARK)
tf.paragraphs[0].space_after = Pt(6)

ve_points = [
    ("Standard vs Ultra LED:", "Interactive toggle between Standard LED (100 lm/W) and Ultra-High Efficiency (140 lm/W)."),
    ("Fixture Reduction:", "-15% total luminaires required to achieve target 500 Lux."),
    ("Infrastructure Savings:", "-12% electrical conduit and wiring meters."),
    ("Annual OPEX Savings:", "₹4,80,000 / year in energy costs for a 50k sq.ft floor."),
    ("Simple Payback:", "14.2 months on incremental luminaire CAPEX.")
]
for title, desc in ve_points:
    add_bullet_item(tf, "•", title, desc, title_size=Pt(11), desc_size=Pt(10), title_color=C_CHARCOAL, desc_color=C_MUTED, space_after=Pt(4))

# Card 2: Tender Bidding Precision
c2_pos = l_pos + c_w + c_g
add_card(s9, c2_pos, Inches(1.2), c_w, Inches(5.6))
tb = s9.shapes.add_textbox(c2_pos + Inches(0.15), Inches(1.35), c_w - Inches(0.3), Inches(5.3))
tf = tb.text_frame
tf.word_wrap = True
style_text(tf.paragraphs[0], "2. BID MARGIN PROTECTION", font_size=Pt(13), bold=True, color=C_TEAL_DARK)
tf.paragraphs[0].space_after = Pt(6)

bid_points = [
    ("Contingency Elimination:", "Traditional bids include 18-25% contingency cushions to absorb quantity surveyor estimation errors."),
    ("Sub-2% Variance Shield:", "Deterministic Manhattan routing cuts variance to < 2.0%, protecting tender profit margins."),
    ("Winning Price Point:", "Allows L&T bidding teams to quote 5-8% more competitively without sacrificing internal target IRR."),
    ("Zero Rework:", "Accurate BOQs prevent post-award contractor disputes and site delivery shortages.")
]
for title, desc in bid_points:
    add_bullet_item(tf, "•", title, desc, title_size=Pt(11), desc_size=Pt(10), title_color=C_CHARCOAL, desc_color=C_MUTED, space_after=Pt(4))

# Card 3: SuFin & SAP ERP Integration
c3_pos = c2_pos + c_w + c_g
add_card(s9, c3_pos, Inches(1.2), c_w, Inches(5.6))
tb = s9.shapes.add_textbox(c3_pos + Inches(0.15), Inches(1.35), c_w - Inches(0.3), Inches(5.3))
tf = tb.text_frame
tf.word_wrap = True
style_text(tf.paragraphs[0], "3. L&T SUFIN & SAP READY", font_size=Pt(13), bold=True, color=C_TEAL_DARK)
tf.paragraphs[0].space_after = Pt(6)

sufin_points = [
    ("Standardized Cataloging:", "Maps all 6 tiers directly to manufacturer catalog codes and HSN tax codes."),
    ("Direct SuFin Export:", "One-click CSV/XML export importable into L&T SuFin (B2B marketplace) for live vendor RFQs."),
    ("SAP Material Master:", "Auto-populates SAP MM (Materials Management) line items with unit rates in INR (₹)."),
    ("Turnaround Speed:", "Cuts tender procurement requisition from 2 weeks to under 2 minutes.")
]
for title, desc in sufin_points:
    add_bullet_item(tf, "•", title, desc, title_size=Pt(11), desc_size=Pt(10), title_color=C_CHARCOAL, desc_color=C_MUTED, space_after=Pt(4))

print("Processing Slide 10: Assumptions...")
# ==============================================================================
# SLIDE 10: Assumptions & Operational Boundaries
# ==============================================================================
s10 = prs.slides[9]
add_header(s10, "Engineering Assumptions & Operational Boundaries")
remove_placeholder(s10, "Text Placeholder 2")

half_w = Inches(5.8)
add_card(s10, Inches(0.6), Inches(1.2), half_w, Inches(5.6))
tb = s10.shapes.add_textbox(Inches(0.8), Inches(1.35), half_w - Inches(0.4), Inches(5.3))
tf = tb.text_frame
tf.word_wrap = True
style_text(tf.paragraphs[0], "SPATIAL & PHOTOMETRIC BOUNDARIES", font_size=Pt(13), bold=True, color=C_TEAL_DARK)
tf.paragraphs[0].space_after = Pt(6)

sp_points = [
    ("Ceiling Heights:", "Assumed uniform per defined room polygon (ranging from 3.2m to 4.5m across commercial zones)."),
    ("Working Plane:", "Fixed at statutory 0.75m desk height for office/lab task areas; 0.0m (floor level) for corridors and circulation."),
    ("Surface Reflectances:", "Calibrated to clean commercial standards: Ceiling rho_c = 0.70, Walls rho_w = 0.50, Floor rho_f = 0.20."),
    ("Maintenance Factor (MF):", "Fixed at 0.80 based on L80B10 LED depreciation at 50,000 operating hours in clean indoor environments."),
    ("Uniformity Buffer:", "Excludes perimeter 0.5m wall band to prevent false scalloping flags per standard CIE guidelines.")
]
for title, desc in sp_points:
    add_bullet_item(tf, "•", title, desc, title_size=Pt(11), desc_size=Pt(10.5), title_color=C_CHARCOAL, desc_color=C_MUTED, space_after=Pt(5))

add_card(s10, Inches(6.8), Inches(1.2), half_w + Inches(0.2), Inches(5.6))
tb = s10.shapes.add_textbox(Inches(7.0), Inches(1.35), half_w - Inches(0.2), Inches(5.3))
tf = tb.text_frame
tf.word_wrap = True
style_text(tf.paragraphs[0], "ELECTRICAL & SYSTEM BOUNDARIES", font_size=Pt(13), bold=True, color=C_TEAL_DARK)
tf.paragraphs[0].space_after = Pt(6)

el_points = [
    ("Circuit Loading Constraint:", "Every branch lighting circuit strictly limited to <= 800W and max 10 points per IS 732."),
    ("Permissible Voltage Drop:", "Engineered to keep total cumulative drop from Distribution Board to farthest fixture under 3.0%."),
    ("Thermal Conduit Fill:", "Conduit cross-sectional fill ratio strictly capped at 40% to prevent conductor heat build-up."),
    ("Phase Allocation:", "Balanced cyclically across Red, Yellow, Blue phases with max allowable phase variance delta P <= 10%."),
    ("Platform Architecture:", "Browser-native client-side engine (Next.js 16 + Canvas); accepts DXF/DWG/PDF vector polylines.")
]
for title, desc in el_points:
    add_bullet_item(tf, "•", title, desc, title_size=Pt(11), desc_size=Pt(10.5), title_color=C_CHARCOAL, desc_color=C_MUTED, space_after=Pt(5))

print("Processing Slide 11: References...")
# ==============================================================================
# SLIDE 11: References & Statutory Standards
# ==============================================================================
s11 = prs.slides[10]
add_header(s11, "References & Statutory Standards")
remove_placeholder(s11, "Text Placeholder 2")

add_card(s11, Inches(0.6), Inches(1.2), half_w, Inches(5.6))
tb = s11.shapes.add_textbox(Inches(0.8), Inches(1.35), half_w - Inches(0.4), Inches(5.3))
tf = tb.text_frame
tf.word_wrap = True
style_text(tf.paragraphs[0], "INDIAN STATUTORY CODES & STANDARDS", font_size=Pt(13), bold=True, color=C_TEAL_DARK)
tf.paragraphs[0].space_after = Pt(6)

in_refs = [
    ("IS 3646 (Parts 1 - 3):", "Bureau of Indian Standards: Code of practice for interior illumination. Mandates lux levels, glare limits (UGR), and color rendering (CRI)."),
    ("NBC 2016 (Part 8, Section 1):", "National Building Code of India: Lighting and natural ventilation engineering specifications for commercial buildings."),
    ("IS 732 (2019 Revision):", "Code of practice for electrical wiring installations: System design, circuit capacities (<=800W), and conductor sizing."),
    ("ECBC 2017:", "Energy Conservation Building Code (Bureau of Energy Efficiency, India): Lighting Power Density (LPD) compliance limits in W/m².")
]
for title, desc in in_refs:
    add_bullet_item(tf, "[•]", title, desc, title_size=Pt(11), desc_size=Pt(10.5), title_color=C_CHARCOAL, desc_color=C_MUTED, space_after=Pt(6))

add_card(s11, Inches(6.8), Inches(1.2), half_w + Inches(0.2), Inches(5.6))
tb = s11.shapes.add_textbox(Inches(7.0), Inches(1.35), half_w - Inches(0.2), Inches(5.3))
tf = tb.text_frame
tf.word_wrap = True
style_text(tf.paragraphs[0], "INTERNATIONAL STANDARDS & LITERATURE", font_size=Pt(13), bold=True, color=C_TEAL_DARK)
tf.paragraphs[0].space_after = Pt(6)

intl_refs = [
    ("EN 12464-1 / CIE S 008:", "Light and lighting: Lighting of work places (Indoor workplaces criteria for visual comfort and performance)."),
    ("ASHRAE Standard 90.1-2022:", "Energy Standard for Buildings Except Low-Rise Residential Buildings (Building Area Method for lighting density)."),
    ("IES LM-63 & EULUMDAT (.ldt):", "Standard file format for electronic transfer of photometric data and polar intensity distribution curves."),
    ("IEEE 519 Standard:", "Recommended practices and requirements for harmonic control in electrical power systems.")
]
for title, desc in intl_refs:
    add_bullet_item(tf, "[•]", title, desc, title_size=Pt(11), desc_size=Pt(10.5), title_color=C_CHARCOAL, desc_color=C_MUTED, space_after=Pt(6))

print("Processing Slide 12: Thank You...")
# ==============================================================================
# SLIDE 12: Thank You & Jury Q&A
# ==============================================================================
s12 = prs.slides[11]
# Remove any residual Title placeholder
remove_placeholder(s12, "Title 5")

# Position card neatly in right-hand canvas (respecting TECHgium left-hand artwork)
add_card(s12, Inches(5.0), Inches(1.2), Inches(7.5), Inches(5.4), fill_color=C_CARD_BG, border_color=C_TEAL_DARK)
tb = s12.shapes.add_textbox(Inches(5.2), Inches(1.4), Inches(7.1), Inches(5.0))
tf = tb.text_frame
tf.word_wrap = True

p = tf.paragraphs[0]
style_text(p, "THANK YOU", font_size=Pt(36), bold=True, color=C_TEAL_DARK)
p.alignment = PP_ALIGN.CENTER

p = tf.add_paragraph()
p.space_before = Pt(8)
style_text(p, "Lumos: Spatial Analysis to BOM Generator for Lighting Design", font_size=Pt(17), bold=True, color=C_CHARCOAL)
p.alignment = PP_ALIGN.CENTER

p = tf.add_paragraph()
p.space_before = Pt(4)
style_text(p, "PID: TG0907615 | TECHgium® 10th Edition", font_size=Pt(13.5), bold=True, color=C_AMBER)
p.alignment = PP_ALIGN.CENTER

p = tf.add_paragraph()
p.space_before = Pt(8)
style_text(p, "Team: Shreeprasandh K | Sivaram Venugopal | Srihari Mohanraj | Srinivaseaswar N", font_size=Pt(12), bold=False, color=C_CHARCOAL)
p.alignment = PP_ALIGN.CENTER

p = tf.add_paragraph()
p.space_before = Pt(4)
style_text(p, "SRM Easwari Engineering College, Ramapuram, Chennai, Tamil Nadu", font_size=Pt(11.5), bold=True, color=C_TEAL_MAIN)
p.alignment = PP_ALIGN.CENTER

p = tf.add_paragraph()
p.space_before = Pt(16)
style_text(p, "“Transforming multi-week manual MEP estimation into a sub-15-second deterministic engineering pipeline.”", font_size=Pt(12), bold=True, color=C_MUTED)
p.alignment = PP_ALIGN.CENTER

p = tf.add_paragraph()
p.space_before = Pt(16)
style_text(p, "Ready for Jury Q & A", font_size=Pt(20), bold=True, color=C_TEAL_DARK)
p.alignment = PP_ALIGN.CENTER

prs.save(OUT_PPT)
print("Successfully regenerated presentation to:", OUT_PPT)
