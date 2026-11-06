import { SpaceDefinition, FixtureSpec, PhotometricResult, Point2D } from './types';

/**
 * Calculates Room Cavity Ratio (RCR) per Zonal Cavity Method.
 * RCR = (2.5 * h_rc * Perimeter) / Area
 */
export function calculateRCR(space: SpaceDefinition): number {
  const h_rc = space.ceilingHeight - space.workplaneHeight;
  const perimeter = 2 * (space.length + space.width);
  if (space.area <= 0) return 1.0;
  return Number(((2.5 * h_rc * perimeter) / space.area).toFixed(2));
}

/**
 * Derives Coefficient of Utilization (UF) from RCR and surface reflectances
 * using standard CIE/IES recessed luminaire utilization interpolation table.
 */
export function calculateUF(rcr: number, reflectance: SpaceDefinition['reflectance']): number {
  // Base commercial office table for rho_c=0.70, rho_w=0.50, rho_f=0.20
  // RCR: [0,   1,    2,    3,    4,    5,    6,    7,    8,    9,   10]
  const baseUF = [0.90, 0.82, 0.74, 0.67, 0.61, 0.55, 0.50, 0.45, 0.41, 0.37, 0.33];
  
  const clampedRCR = Math.max(0, Math.min(10, rcr));
  const floorIdx = Math.floor(clampedRCR);
  const ceilIdx = Math.min(10, Math.ceil(clampedRCR));
  const frac = clampedRCR - floorIdx;
  
  const rawUF = baseUF[floorIdx] * (1 - frac) + baseUF[ceilIdx] * frac;
  
  // Minor adjustment factor for non-standard wall reflectances
  const wallFactor = (reflectance.wall / 0.50);
  return Number(Math.max(0.30, Math.min(0.92, rawUF * (0.9 + 0.1 * wallFactor))).toFixed(2));
}

/**
 * Executes full Zonal Cavity Method and Point-Grid Radiosity evaluation
 * to synthesize luminaire count, grid placement, and lux heatmap.
 */
export function computeSpacePhotometrics(
  space: SpaceDefinition,
  fixture: FixtureSpec
): { result: PhotometricResult; fixtureCoords: Point2D[] } {
  const rcr = calculateRCR(space);
  const uf = calculateUF(rcr, space.reflectance);
  const mf = 0.80; // Standard LED maintenance factor (clean indoor)
  
  // Total required lumens = (E_target * Area) / (UF * MF)
  const requiredLumens = (space.targetLux * space.area) / (uf * mf);
  
  // Raw luminaire count
  let rawN = Math.ceil(requiredLumens / fixture.lumenOutput);
  if (rawN < 1) rawN = 1;

  // Synthesize optimal orthogonal grid (Nx, Ny) matching room aspect ratio
  const ratio = space.length / space.width;
  let cols = Math.max(1, Math.round(Math.sqrt(rawN * ratio)));
  let rows = Math.max(1, Math.ceil(rawN / cols));
  let totalFixtures = cols * rows;

  const h_rc = space.ceilingHeight - space.workplaneHeight;
  const spacingX = space.length / cols;
  const spacingY = space.width / rows;
  const shr = Number((Math.max(spacingX, spacingY) / h_rc).toFixed(2));

  // Generate fixture coordinates (centered in each grid cell)
  const fixtureCoords: Point2D[] = [];
  const startX = spacingX / 2;
  const startY = spacingY / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      fixtureCoords.push({
        x: Number((startX + c * spacingX).toFixed(2)),
        y: Number((startY + r * spacingY).toFixed(2))
      });
    }
  }

  // Generate 10x10 Discrete Radiosity Sampling Grid for false-color lux heatmap
  const gridResolution = 10;
  const gridHeatmap: number[][] = [];
  let sumLux = 0;
  let minLux = Infinity;
  let maxLux = -Infinity;

  const stepX = space.length / gridResolution;
  const stepY = space.width / gridResolution;

  for (let gy = 0; gy < gridResolution; gy++) {
    const rowLux: number[] = [];
    const py = (gy + 0.5) * stepY;

    for (let gx = 0; gx < gridResolution; gx++) {
      const px = (gx + 0.5) * stepX;
      let pointLux = 0;

      // Inverse-square point contribution from all fixtures
      for (const f of fixtureCoords) {
        const dx = px - f.x;
        const dy = py - f.y;
        const distSq = dx * dx + dy * dy + h_rc * h_rc;
        const dist = Math.sqrt(distSq);
        const cosTheta = h_rc / dist;

        // Peak candela I0 = LumenOutput / (2 * PI * (1 - cos(half_beam)))
        const halfBeamRad = (fixture.beamAngleDeg / 2) * (Math.PI / 180);
        const i0 = fixture.lumenOutput / (2 * Math.PI * (1 - Math.cos(halfBeamRad)));
        
        // Cosine Lambertian falloff
        const candelaTheta = i0 * Math.pow(cosTheta, 1.2);
        const illuminance = (candelaTheta * cosTheta / distSq) * mf;
        pointLux += illuminance;
      }

      // Inter-reflected ambient component boost based on surface reflectances
      const ambientFactor = 1 + (space.reflectance.wall * 0.25 + space.reflectance.ceiling * 0.15);
      const finalLux = Math.round(pointLux * ambientFactor);

      rowLux.push(finalLux);
      sumLux += finalLux;
      if (finalLux < minLux) minLux = finalLux;
      if (finalLux > maxLux) maxLux = finalLux;
    }
    gridHeatmap.push(rowLux);
  }

  const avgLux = Math.round(sumLux / (gridResolution * gridResolution));
  const uniformityU0 = Number((minLux / (avgLux || 1)).toFixed(2));
  const totalWatts = totalFixtures * fixture.powerWatts;
  const lpdWattsPerM2 = Number((totalWatts / space.area).toFixed(1));

  // Compliance checks:
  // 1. Avg Lux within 5% of target or higher
  // 2. Uniformity U0 >= 0.60 (NBC 2016 Part 8)
  // 3. SHR <= 1.50 (IS 3646)
  // 4. LPD <= 9.5 W/m² (ECBC 2017)
  const isCompliant = 
    avgLux >= space.targetLux * 0.95 &&
    uniformityU0 >= 0.60 &&
    shr <= 1.50 &&
    lpdWattsPerM2 <= 9.5;

  return {
    result: {
      spaceId: space.id,
      rcr,
      utilizationFactor: uf,
      maintenanceFactor: mf,
      requiredLumens: Math.round(requiredLumens),
      fixtureCount: totalFixtures,
      gridRows: rows,
      gridCols: cols,
      spacingX: Number(spacingX.toFixed(2)),
      spacingY: Number(spacingY.toFixed(2)),
      shr,
      avgLux,
      minLux,
      maxLux,
      uniformityU0,
      lpdWattsPerM2,
      isCompliant,
      gridHeatmap
    },
    fixtureCoords
  };
}
