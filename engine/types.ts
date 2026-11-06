export type SpaceType = 
  | 'open_office'
  | 'executive_office'
  | 'conference_room'
  | 'corridor'
  | 'laboratory'
  | 'cafeteria'
  | 'restroom';

export interface Point2D {
  x: number;
  y: number;
}

export interface SpaceDefinition {
  id: string;
  name: string;
  type: SpaceType;
  polygon: Point2D[];
  length: number; // meters
  width: number;  // meters
  area: number;   // m²
  ceilingHeight: number; // meters (e.g. 3.2m)
  workplaneHeight: number; // meters (e.g. 0.75m)
  targetLux: number; // e.g. 500 lx (IS 3646)
  reflectance: {
    ceiling: number; // 0.70
    wall: number;    // 0.50
    floor: number;   // 0.20
  };
}

export interface FixtureSpec {
  id: string;
  model: string;
  category: 'troffer_2x2' | 'linear_batten' | 'downlight' | 'high_bay' | 'cleanroom';
  powerWatts: number;
  lumenOutput: number;
  efficacyLmPerW: number;
  cct: string;
  cri: number;
  beamAngleDeg: number;
  ugr: number;
  unitCostINR: number;
  catalogCode: string;
  hsnCode: string;
}

export interface FixturePlacement {
  id: string;
  spaceId: string;
  x: number;
  y: number;
  circuitId: string;
  phase: 'R' | 'Y' | 'B';
  isEmergency: boolean; // 15% egress backup
}

export interface PhotometricResult {
  spaceId: string;
  rcr: number; // Room Cavity Ratio
  utilizationFactor: number; // UF
  maintenanceFactor: number; // MF = 0.80
  requiredLumens: number;
  fixtureCount: number;
  gridRows: number;
  gridCols: number;
  spacingX: number;
  spacingY: number;
  shr: number; // Spacing-to-Height Ratio (<= 1.50)
  avgLux: number;
  minLux: number;
  maxLux: number;
  uniformityU0: number; // E_min / E_avg (>= 0.60)
  lpdWattsPerM2: number; // Lighting Power Density (<= 9.5 W/m²)
  isCompliant: boolean;
  gridHeatmap: number[][]; // 10x10 matrix of calculated lux values
}

export interface ConduitSegment {
  id: string;
  from: Point2D;
  to: Point2D;
  lengthMeters: number;
  conduitType: '20mm_GI' | '25mm_GI';
  circuitId: string;
  wireCount: number;
  fillRatioPercent: number; // <= 40%
}

export interface SubCircuit {
  id: string;
  name: string;
  dbId: string;
  phase: 'R' | 'Y' | 'B';
  totalWatts: number; // <= 800W (IS 732)
  fixtureIds: string[];
  mcbRating: string; // e.g. "10A SP Type-C"
  wireLengthMeters: number;
  conduitLengthMeters: number;
}

export interface DistributionBoard {
  id: string;
  name: string;
  position: Point2D;
  incomingRating: string; // "40A 30mA 4P RCCB"
  circuits: SubCircuit[];
  totalConnectedLoadWatts: number;
  phaseLoadWatts: {
    R: number;
    Y: number;
    B: number;
  };
  phaseImbalancePercent: number; // <= 10%
}

export interface BomItem {
  id: string;
  tier: 1 | 2 | 3 | 4 | 5 | 6;
  tierName: string;
  itemDescription: string;
  catalogCode: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  unitRateINR: number;
  totalAmountINR: number;
}

export interface ProjectData {
  id: string;
  name: string;
  code: string;
  building: string;
  floor: string;
  grossAreaSqFt: number;
  grossAreaM2: number;
  spaces: SpaceDefinition[];
  fixtures: FixturePlacement[];
  fixtureSpec: FixtureSpec;
  photometrics: Record<string, PhotometricResult>;
  distributionBoards: DistributionBoard[];
  conduits: ConduitSegment[];
  bomItems: BomItem[];
  totalCostINR: number;
  status: 'Draft' | 'Processing' | 'Completed';
  lastCalculated: string;
}
