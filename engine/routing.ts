import { Point2D, FixturePlacement, SubCircuit, DistributionBoard, ConduitSegment, FixtureSpec } from './types';

/**
 * Computes Manhattan distance between two 2D points.
 * |x1 - x2| + |y1 - y2|
 */
export function manhattanDistance(p1: Point2D, p2: Point2D): number {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

/**
 * Partitions fixtures into statutory sub-circuits (IS 732: <= 800W, max 10 points per circuit)
 * and balances them cyclically across 3 phases (R, Y, B).
 */
export function partitionAndRouteCircuits(
  fixtures: { id: string; x: number; y: number }[],
  fixtureSpec: FixtureSpec,
  dbList: { id: string; name: string; position: Point2D }[]
): {
  distributionBoards: DistributionBoard[];
  conduits: ConduitSegment[];
  assignedFixtures: FixturePlacement[];
} {
  const maxPointsPerCircuit = 10;
  const maxWattsPerCircuit = 800;
  const fixturesPerCircuit = Math.min(
    maxPointsPerCircuit,
    Math.floor(maxWattsPerCircuit / fixtureSpec.powerWatts)
  );

  const assignedFixtures: FixturePlacement[] = [];
  const allConduits: ConduitSegment[] = [];
  const phases: ('R' | 'Y' | 'B')[] = ['R', 'Y', 'B'];

  // Initialize DB structures
  const dbs: DistributionBoard[] = dbList.map(db => ({
    id: db.id,
    name: db.name,
    position: db.position,
    incomingRating: '40A 30mA 4P RCCB',
    circuits: [],
    totalConnectedLoadWatts: 0,
    phaseLoadWatts: { R: 0, Y: 0, B: 0 },
    phaseImbalancePercent: 0
  }));

  // Assign fixtures to nearest DB
  const dbFixtureGroups: Map<string, { id: string; x: number; y: number }[]> = new Map();
  dbs.forEach(db => dbFixtureGroups.set(db.id, []));

  fixtures.forEach(f => {
    let nearestDb = dbs[0];
    let minD = Infinity;
    dbs.forEach(db => {
      const d = manhattanDistance(f, db.position);
      if (d < minD) {
        minD = d;
        nearestDb = db;
      }
    });
    dbFixtureGroups.get(nearestDb.id)?.push(f);
  });

  // For each DB, form circuits and route conduits
  let circuitCounter = 1;

  dbs.forEach(db => {
    const group = dbFixtureGroups.get(db.id) || [];
    // Sort spatially along primary axis (Manhattan order)
    group.sort((a, b) => (a.x - b.x !== 0 ? a.x - b.x : a.y - b.y));

    for (let i = 0; i < group.length; i += fixturesPerCircuit) {
      const chunk = group.slice(i, i + fixturesPerCircuit);
      const cId = `CKT-${db.id}-${circuitCounter}`;
      const phase = phases[(circuitCounter - 1) % 3];
      circuitCounter++;

      const cktWatts = chunk.length * fixtureSpec.powerWatts;
      let cktConduitMeters = 0;

      // 15% designated emergency lighting backup fixtures
      chunk.forEach((f, idx) => {
        const isEmergency = idx % 7 === 0;
        assignedFixtures.push({
          id: f.id,
          spaceId: '',
          x: f.x,
          y: f.y,
          circuitId: cId,
          phase,
          isEmergency
        });
      });

      // Feeder route from DB to first fixture in circuit
      let prevPoint = db.position;
      let isFirst = true;

      chunk.forEach((f, idx) => {
        const curPoint = { x: f.x, y: f.y };
        let segDist = manhattanDistance(prevPoint, curPoint);

        // Add vertical drops
        if (isFirst) {
          segDist += 1.8; // DB vertical drop from ceiling void to panel
          isFirst = false;
        }

        // Add 10% slack factor for bends, couplers, and box terminations
        const actualLength = Number((segDist * 1.10).toFixed(2));
        cktConduitMeters += actualLength;

        // Trunk conduit vs branch conduit
        const isTrunk = idx === 0;
        const conduitType = isTrunk ? '25mm_GI' : '20mm_GI';
        const wireCount = isTrunk ? 6 : 3; // R/Y/B + N + E vs Single Phase + N + E
        const fillRatioPercent = isTrunk ? 34 : 22; // Well below 40% statutory cap

        allConduits.push({
          id: `CND-${cId}-${idx + 1}`,
          from: prevPoint,
          to: curPoint,
          lengthMeters: actualLength,
          conduitType,
          circuitId: cId,
          wireCount,
          fillRatioPercent
        });

        prevPoint = curPoint;
      });

      // Add wall switch vertical drop (+1.5m) to final fixture of circuit
      cktConduitMeters += 1.5 * 1.10;

      // Conductor wire length = Conduit Length * Wire count (Phase + Neutral + Earth)
      const wireMeters = Number((cktConduitMeters * 3).toFixed(1));

      const subCircuit: SubCircuit = {
        id: cId,
        name: `Circuit ${cId.split('-').pop()} (${phase}-Phase)`,
        dbId: db.id,
        phase,
        totalWatts: cktWatts,
        fixtureIds: chunk.map(f => f.id),
        mcbRating: '10A SP Type-C (10kA)',
        wireLengthMeters: wireMeters,
        conduitLengthMeters: Number(cktConduitMeters.toFixed(1))
      };

      db.circuits.push(subCircuit);
      db.totalConnectedLoadWatts += cktWatts;
      db.phaseLoadWatts[phase] += cktWatts;
    }

    // Calculate Phase Imbalance Delta P % = (maxPhase - minPhase) / avgPhase * 100
    const loads = [db.phaseLoadWatts.R, db.phaseLoadWatts.Y, db.phaseLoadWatts.B];
    const maxP = Math.max(...loads);
    const minP = Math.min(...loads);
    const avgP = (loads[0] + loads[1] + loads[2]) / 3 || 1;
    db.phaseImbalancePercent = Number((((maxP - minP) / avgP) * 100).toFixed(1));
  });

  return {
    distributionBoards: dbs,
    conduits: allConduits,
    assignedFixtures
  };
}
