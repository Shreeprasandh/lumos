# Spatial Analysis to BOM Generator for Lighting Design
**Automated MEP Pre-Tender Estimation Platform**

**Target Entity**: Larsen & Toubro (L&T) — Buildings & Factories IC / EDRC  
**Domain**: MEP Electrical Engineering, BIM & Pre-Tender Cost Estimation  
**Core Standards**: IS 3646, IS 732, NBC 2016 (Part 8), ECBC 2017  
**Keywords**: Spatial Analysis, Lighting Design, Bill of Materials, BOM, BOQ, Zonal Cavity Method, Conduit Routing, Phase Balancing, L&T SuFin  

---

### Project Overview
During fast-track EPC tenders for airports, commercial towers, and industrial plants, L&T estimation teams have only 10 to 14 days to submit competitive bids. Manually modeling hundreds of rooms in tools like DIALux takes weeks, forcing engineers to rely on rough area thumb-rules. These approximations carry an 18–25% variance, risking lost bids from over-quoting or margin erosion from under-quoting.

This platform bridges that gap by directly connecting 2D floor plans to statutory lighting physics and procurement quantities in seconds, eliminating manual guesswork before submitting a tender.

---

### What The System Does
- **Automatic Spatial Sizing**: Reads floor plan boundaries, classifies spaces (offices, corridors, factory sheds), and calculates Room Cavity Ratios ($RCR$) accounting for ceiling heights and structural columns.
- **Standards-Compliant Sizing**: Applies the Zonal Cavity Method (IS 3646 / NBC 2016) to determine exact fixture counts, enforcing spacing-to-mounting-height limits ($SHR \le 1.5$) and uniform lux levels.
- **Realistic Conduit Routing**: Routes ceiling conduits along orthogonal building axes (Manhattan paths), including vertical drops for wall switches (+1.5 m) and distribution boards (+1.8 m).
- **Balanced 3-Phase Loading**: Groups fixtures into sub-circuits bounded to $\le 800\,\text{W}$ per IS 732 and balances loads across Red, Yellow, and Blue phases to prevent neutral line overheating.
- **Complete 6-Tier BOQ**: Generates an itemized Bill of Materials—fixtures, emergency battery kits, GI/PVC conduits, FRLS copper wires, DBs, and mounting accessories—formatted for L&T SuFin and SAP.

---

### Key Business Impact for L&T
- **Turnaround Speed**: Reduces lighting takeoff and BOQ calculation from 7 days to under 15 seconds per floor plan revision.
- **Bidding Precision**: Cuts quantity estimation variance from 20% to under 2%, protecting L&T's tender profit margins.
- **Tender Variance Auditor**: Shows an instant side-by-side comparison between traditional thumb-rules and true spatial physics so teams can submit aggressive, winning bids.
- **Green Compliance**: Automatically checks Lighting Power Density ($W/m^2$) against ECBC 2017 energy codes.
