'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ProjectData } from '@/engine/types';
import { 
  RotateCcw, 
  Layers, 
  Lightbulb, 
  Compass, 
  Maximize2,
  Sliders,
  CheckCircle2,
  Eye
} from 'lucide-react';

interface HairlineIsometricCanvasProps {
  project: ProjectData;
  height?: number;
  zoomLevel?: number;
  onResetZoom?: () => void;
}

export default function HairlineIsometricCanvas({
  project,
  height = 520,
  zoomLevel = 1.0,
  onResetZoom
}: HairlineIsometricCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Layer Toggles
  const [showWalls, setShowWalls] = useState(true);
  const [showFurniture, setShowFurniture] = useState(true);
  const [showLuminaires, setShowLuminaires] = useState(true);
  const [showConduits, setShowConduits] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [explodeFactor, setExplodeFactor] = useState(0.0); // 0.0 (assembled) to 1.0 (fully exploded)

  // Interactive Pointer Physics
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);

  // Canvas Dimensions
  const WIDTH = 1000;
  const CANVAS_HEIGHT = Math.max(380, height - 82);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let targetRot = { x: 0, y: 0 };
    let currentRot = { x: 0, y: 0 };
    let rafId: number;
    let isMoving = false;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      // Decoupled micro-tilt bounds (Max 10 deg)
      targetRot = {
        x: -deltaY * 6,
        y: deltaX * 8
      };

      if (!isMoving) {
        isMoving = true;
        loop();
      }
    };

    const loop = () => {
      currentRot.x += (targetRot.x - currentRot.x) * 0.12;
      currentRot.y += (targetRot.y - currentRot.y) * 0.12;
      setRotation({ x: currentRot.x, y: currentRot.y });

      const diff = Math.abs(targetRot.x - currentRot.x) + Math.abs(targetRot.y - currentRot.y);
      if (diff > 0.02) {
        rafId = requestAnimationFrame(loop);
      } else {
        isMoving = false;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // MATHEMATICAL ISOMETRIC PROJECTION ENGINE
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, WIDTH, CANVAS_HEIGHT);
    ctx.save();

    // Warm background fill
    ctx.fillStyle = '#FFFCF8';
    ctx.fillRect(0, 0, WIDTH, CANVAS_HEIGHT);

    // Geometric Center Calculation (CAD floor boundary center is at x: 440, y: 250)
    const centerX = WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2 + 35;

    // Isometric projection angles (30 degrees standard isometric)
    const cos30 = Math.cos(Math.PI / 6); // 0.866
    const sin30 = Math.sin(Math.PI / 6); // 0.500
    const scale = 0.76 * zoomLevel;

    // Apply interactive pointer micro-tilt
    const radY = (rotation.y * Math.PI) / 180;
    const cosY = Math.cos(radY);
    const sinY = Math.sin(radY);

    // Projection Function: Converts CAD (x, y, z) into Isometric Canvas (X, Y)
    const projectIso = (x: number, y: number, z = 0, layerOffset = 0) => {
      // Offset relative to CAD centroid (440, 250)
      const cx = (x - 440);
      const cy = (y - 250);

      // Rotate slightly on Y axis with pointer
      const rx = cx * cosY - cy * sinY;
      const ry = cx * sinY + cy * cosY;

      // Isometric mapping with balanced layer explosion lift
      const isoX = centerX + (rx - ry) * cos30 * scale;
      const totalZ = z + layerOffset * explodeFactor;
      const isoY = centerY + (rx + ry) * sin30 * scale - totalZ * scale * 1.5;

      return { x: isoX, y: isoY };
    };

    // -------------------------------------------------------------------------
    // LAYER 1: BASE FLOOR & HEATMAP UNDERLAY (z = 0)
    // -------------------------------------------------------------------------
    // CAD Floor Boundary Points
    const boundaryPoints = [
      { x: 115, y: 62 },
      { x: 785, y: 62 },
      { x: 785, y: 430 },
      { x: 605, y: 430 },
      { x: 605, y: 442 },
      { x: 285, y: 442 },
      { x: 285, y: 430 },
      { x: 115, y: 430 },
      { x: 115, y: 310 },
      { x: 95, y: 310 },
      { x: 95, y: 170 },
      { x: 115, y: 170 }
    ];

    // Draw Floor Slab (Warm Ivory Fill + 1px Hairline Border)
    ctx.beginPath();
    boundaryPoints.forEach((pt, idx) => {
      const p = projectIso(pt.x, pt.y, 0, 0);
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fillStyle = '#F5EFE8';
    ctx.fill();
    ctx.strokeStyle = '#D9CEC2';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Heatmap Lux Pools on Floor (If enabled)
    if (showHeatmap) {
      const lightHotspots = [
        { x: 190, y: 130, lux: 350 },
        { x: 230, y: 130, lux: 380 },
        { x: 340, y: 118, lux: 510 },
        { x: 420, y: 118, lux: 510 },
        { x: 490, y: 125, lux: 490 },
        { x: 675, y: 125, lux: 530 },
        { x: 180, y: 255, lux: 460 },
        { x: 230, y: 255, lux: 520 },
        { x: 340, y: 255, lux: 680 },
        { x: 420, y: 255, lux: 710 },
        { x: 490, y: 255, lux: 660 },
        { x: 550, y: 255, lux: 520 },
        { x: 230, y: 345, lux: 510 },
        { x: 340, y: 345, lux: 540 },
        { x: 420, y: 345, lux: 540 },
        { x: 615, y: 230, lux: 490 },
        { x: 685, y: 230, lux: 490 },
        { x: 705, y: 330, lux: 490 }
      ];

      lightHotspots.forEach(lp => {
        const p = projectIso(lp.x, lp.y, 0, 0);
        const radiusX = 42 * scale;
        const radiusY = 22 * scale;

        const grad = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, radiusX);
        if (lp.lux >= 650) {
          grad.addColorStop(0, 'rgba(241, 214, 106, 0.65)'); // Warm yellow
          grad.addColorStop(0.4, 'rgba(16, 185, 129, 0.40)'); // Emerald green
          grad.addColorStop(0.8, 'rgba(53, 185, 164, 0.15)'); // Cyan/teal
          grad.addColorStop(1, 'rgba(53, 185, 164, 0)');
        } else if (lp.lux >= 480) {
          grad.addColorStop(0, 'rgba(16, 185, 129, 0.50)');
          grad.addColorStop(0.5, 'rgba(53, 185, 164, 0.25)');
          grad.addColorStop(1, 'rgba(53, 185, 164, 0)');
        } else {
          grad.addColorStop(0, 'rgba(53, 185, 164, 0.40)');
          grad.addColorStop(0.6, 'rgba(11, 155, 138, 0.15)');
          grad.addColorStop(1, 'rgba(11, 155, 138, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // -------------------------------------------------------------------------
    // LAYER 2: ARCHITECTURAL WALLS & DOORS (z = 0 to 24px wall height)
    // -------------------------------------------------------------------------
    if (showWalls) {
      const wallHeight = 22; // Height of extruded walls
      const wallOffset = 15; // Explode elevation offset

      // Helper to draw an extruded wall section
      const drawExtrudedWall = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
        const b1 = projectIso(p1.x, p1.y, 0, wallOffset);
        const b2 = projectIso(p2.x, p2.y, 0, wallOffset);
        const t1 = projectIso(p1.x, p1.y, wallHeight, wallOffset);
        const t2 = projectIso(p2.x, p2.y, wallHeight, wallOffset);

        // Wall vertical face
        ctx.beginPath();
        ctx.moveTo(b1.x, b1.y);
        ctx.lineTo(b2.x, b2.y);
        ctx.lineTo(t2.x, t2.y);
        ctx.lineTo(t1.x, t1.y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 252, 248, 0.75)';
        ctx.fill();
        ctx.strokeStyle = '#202321';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Top line
        ctx.beginPath();
        ctx.moveTo(t1.x, t1.y);
        ctx.lineTo(t2.x, t2.y);
        ctx.strokeStyle = '#087F73';
        ctx.lineWidth = 1.0;
        ctx.stroke();
      };

      // Extrude Perimeter Wall Segments
      for (let i = 0; i < boundaryPoints.length; i++) {
        const nextIdx = (i + 1) % boundaryPoints.length;
        drawExtrudedWall(boundaryPoints[i], boundaryPoints[nextIdx]);
      }

      // Interior Partitions (Conference Room & Cabins)
      // Top-Right Boardroom Walls
      drawExtrudedWall({ x: 585, y: 66 }, { x: 585, y: 181 });
      drawExtrudedWall({ x: 585, y: 181 }, { x: 781, y: 181 });

      // Right Cabins Partitions
      drawExtrudedWall({ x: 635, y: 185 }, { x: 635, y: 280 });
      drawExtrudedWall({ x: 635, y: 280 }, { x: 781, y: 280 });
      drawExtrudedWall({ x: 635, y: 285 }, { x: 635, y: 426 });

      // Staircase Cores
      drawExtrudedWall({ x: 210, y: 66 }, { x: 210, y: 191 });
      drawExtrudedWall({ x: 210, y: 191 }, { x: 275, y: 191 });
    }

    // -------------------------------------------------------------------------
    // LAYER 3: WORKSTATION PODS & CONFERENCE FURNITURE (z = 10px)
    // -------------------------------------------------------------------------
    if (showFurniture) {
      const furnOffset = 35; // Explode elevation offset

      // Helper to draw an isometric box (Desk / Table / Screen)
      const drawIsoBox = (
        x: number, 
        y: number, 
        w: number, 
        h: number, 
        elevation: number, 
        thickness: number, 
        stroke = '#087F73', 
        fill = '#FFFFFF'
      ) => {
        const p1 = projectIso(x, y, elevation + thickness, furnOffset);
        const p2 = projectIso(x + w, y, elevation + thickness, furnOffset);
        const p3 = projectIso(x + w, y + h, elevation + thickness, furnOffset);
        const p4 = projectIso(x, y + h, elevation + thickness, furnOffset);

        // Top Face
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.0;
        ctx.stroke();

        // Side Depth Faces
        const pb1 = projectIso(x, y, elevation, furnOffset);
        const pb2 = projectIso(x + w, y, elevation, furnOffset);
        const pb3 = projectIso(x + w, y + h, elevation, furnOffset);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(pb1.x, pb1.y);
        ctx.lineTo(pb2.x, pb2.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(pb2.x, pb2.y);
        ctx.lineTo(pb3.x, pb3.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.stroke();
      };

      // Top-Right Boardroom Table (Long rectangular conference table)
      drawIsoBox(620, 100, 125, 48, 0, 8, '#087F73', '#FFFCF8');

      // 10 Conference Chairs
      for (let c = 0; c < 5; c++) {
        // Top row chairs
        drawIsoBox(630 + c * 23, 88, 14, 10, 0, 10, '#62645F', '#FFFFFF');
        // Bottom row chairs
        drawIsoBox(630 + c * 23, 150, 14, 10, 0, 10, '#62645F', '#FFFFFF');
      }

      // 8 Central Workstation Pods (4 Desks each in 2x2 pods)
      const pods = [
        // Top Pods
        { x: 335, y: 95 }, { x: 435, y: 95 },
        // Middle Pods Row 1
        { x: 210, y: 310 }, { x: 300, y: 310 }, { x: 390, y: 310 }, { x: 480, y: 310 },
        // Middle Pods Row 2
        { x: 210, y: 365 }, { x: 300, y: 365 }, { x: 390, y: 365 }, { x: 480, y: 365 }
      ];

      pods.forEach(p => {
        // Desk Surface
        drawIsoBox(p.x, p.y, 34, 28, 0, 7, '#0B9B8A', '#FFFFFF');
        // Dual Monitor Screens (Upright)
        drawIsoBox(p.x + 8, p.y + 6, 18, 5, 7, 8, '#087F73', '#E5F4EF');
      });

      // Breakout Lounge Table (Bottom Left)
      drawIsoBox(135, 290, 32, 32, 0, 7, '#087F73', '#FFFFFF');
    }

    // -------------------------------------------------------------------------
    // LAYER 4: SUSPENDED LUMINAIRES (z = 45px ceiling level)
    // -------------------------------------------------------------------------
    if (showLuminaires) {
      const lumOffset = 75; // Explode elevation offset
      const lumElevation = 45;

      const luminaires = [
        // Top area
        { x: 190, y: 130 }, { x: 230, y: 130 }, { x: 230, y: 190 },
        { x: 340, y: 118 }, { x: 420, y: 118 }, { x: 490, y: 125 },
        // Conference Room (2 Troffers)
        { x: 675, y: 125 }, { x: 745, y: 125 },
        // Central Horizontal Aisle (7 Luminaires across main corridor)
        { x: 180, y: 255 }, { x: 230, y: 255 }, { x: 340, y: 255 },
        { x: 420, y: 255 }, { x: 490, y: 255 }, { x: 550, y: 255 }, { x: 620, y: 255 },
        // Workstation Cluster Aisles
        { x: 230, y: 345 }, { x: 340, y: 345 }, { x: 420, y: 345 },
        // Manager Cabins
        { x: 685, y: 230 }, { x: 705, y: 330 }, { x: 615, y: 405 }, { x: 675, y: 405 }
      ];

      luminaires.forEach(lum => {
        const floorPt = projectIso(lum.x, lum.y, 0, 0);
        const ceilingPt = projectIso(lum.x, lum.y, lumElevation, lumOffset);

        // Fine vertical suspension wire from ceiling to luminaire
        ctx.beginPath();
        ctx.moveTo(ceilingPt.x, ceilingPt.y - 12);
        ctx.lineTo(ceilingPt.x, ceilingPt.y);
        ctx.strokeStyle = '#8A8982';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Hairline Troffer Housing (600x600 LED Square)
        const s = 14;
        const tp1 = projectIso(lum.x - s / 2, lum.y - s / 2, lumElevation, lumOffset);
        const tp2 = projectIso(lum.x + s / 2, lum.y - s / 2, lumElevation, lumOffset);
        const tp3 = projectIso(lum.x + s / 2, lum.y + s / 2, lumElevation, lumOffset);
        const tp4 = projectIso(lum.x - s / 2, lum.y + s / 2, lumElevation, lumOffset);

        ctx.beginPath();
        ctx.moveTo(tp1.x, tp1.y);
        ctx.lineTo(tp2.x, tp2.y);
        ctx.lineTo(tp3.x, tp3.y);
        ctx.lineTo(tp4.x, tp4.y);
        ctx.closePath();
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.strokeStyle = '#087F73';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Inner glowing LED diffuser aperture
        ctx.fillStyle = '#F1D66A'; // Warm gold emitter
        ctx.beginPath();
        ctx.arc(ceilingPt.x, ceilingPt.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Optional: faint projection cone down to floor workplane
        if (explodeFactor > 0.2) {
          ctx.beginPath();
          ctx.moveTo(ceilingPt.x, ceilingPt.y);
          ctx.lineTo(floorPt.x - 15 * scale, floorPt.y);
          ctx.lineTo(floorPt.x + 15 * scale, floorPt.y);
          ctx.closePath();
          ctx.fillStyle = 'rgba(241, 214, 106, 0.05)';
          ctx.fill();
        }
      });
    }

    // -------------------------------------------------------------------------
    // LAYER 5: CEILING RACENWAY CONDUIT ROUTING (z = 58px void elevation)
    // -------------------------------------------------------------------------
    if (showConduits) {
      const conduitOffset = 110; // Explode elevation offset
      const conduitZ = 58;

      // Primary 25mm Heavy Gauge GI Trunk (Corridor Spine)
      // From DB-1 at North Shaft across the central corridor
      const trunkPoints = [
        { x: 210, y: 191 }, // DB-1 Location
        { x: 210, y: 255 }, // 90° Turn into Main Spine
        { x: 620, y: 255 }, // Spine Run across corridor
        { x: 620, y: 125 }  // Turn to Boardroom & Cabins
      ];

      // Draw Main Trunk (Deep Teal Thick Hairline)
      ctx.beginPath();
      trunkPoints.forEach((pt, idx) => {
        const p = projectIso(pt.x, pt.y, conduitZ, conduitOffset);
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.strokeStyle = '#087F73';
      ctx.lineWidth = 2.4;
      ctx.stroke();

      // Branch Runs (20mm GI into Workstations & Rooms)
      const branchRuns = [
        // Pod Branch 1
        [{ x: 340, y: 255 }, { x: 340, y: 310 }, { x: 340, y: 365 }],
        // Pod Branch 2
        [{ x: 420, y: 255 }, { x: 420, y: 310 }, { x: 420, y: 365 }],
        // North Pods Branch
        [{ x: 340, y: 255 }, { x: 340, y: 118 }, { x: 420, y: 118 }],
        // South Cabins Branch
        [{ x: 620, y: 255 }, { x: 685, y: 255 }, { x: 685, y: 330 }],
        // West Lounge Branch
        [{ x: 210, y: 255 }, { x: 135, y: 255 }, { x: 135, y: 290 }]
      ];

      branchRuns.forEach(run => {
        ctx.beginPath();
        run.forEach((pt, idx) => {
          const p = projectIso(pt.x, pt.y, conduitZ, conduitOffset);
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.strokeStyle = '#0B9B8A';
        ctx.lineWidth = 1.4;
        ctx.stroke();
      });

      // Galvanized Junction Boxes (At every tee junction)
      const junctionBoxes = [
        { x: 210, y: 255 },
        { x: 340, y: 255 },
        { x: 420, y: 255 },
        { x: 620, y: 255 },
        { x: 340, y: 118 },
        { x: 340, y: 310 },
        { x: 420, y: 310 }
      ];

      junctionBoxes.forEach(jb => {
        const p = projectIso(jb.x, jb.y, conduitZ, conduitOffset);
        // Circular Junction Box Body
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#087F73';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // Distribution Board Badges (DB-1 & DB-2)
      const db1 = projectIso(210, 191, conduitZ, conduitOffset);
      ctx.fillStyle = '#D97706'; // Amber DB badge
      ctx.fillRect(db1.x - 7, db1.y - 7, 14, 14);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(db1.x - 7, db1.y - 7, 14, 14);
      ctx.fillStyle = '#202321';
      ctx.font = 'bold 9px system-ui, sans-serif';
      ctx.fillText('DB-1', db1.x + 9, db1.y + 3);
    }

    ctx.restore();
  }, [
    project, 
    showWalls, 
    showFurniture, 
    showLuminaires, 
    showConduits, 
    showHeatmap, 
    explodeFactor, 
    rotation, 
    zoomLevel, 
    CANVAS_HEIGHT
  ]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full select-none flex flex-col justify-start"
    >
      {/* Top Bar: ONLY Explode Layers Slider & Tip */}
      <div className="w-full h-9 px-3 mb-1.5 rounded-lg border border-[#E7DED4] bg-[#FBF8F4] flex items-center justify-between gap-3 text-[12px] whitespace-nowrap">
        {/* Left: Explode Layer Slider */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <Layers className="w-3.5 h-3.5 text-[#087F73] shrink-0" />
          <span className="font-semibold text-[#202321] text-[12px] whitespace-nowrap shrink-0">
            Explode Layers:
          </span>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={explodeFactor}
            onChange={(e) => setExplodeFactor(Number(e.target.value))}
            className="w-28 sm:w-40 h-1.5 bg-[#E7DED4] rounded-full accent-[#087F73] cursor-pointer shrink-0"
          />

          <span className="font-mono text-[11px] font-bold text-[#087F73] bg-[#E5F4EF] border border-[#087F73]/20 px-2 py-0.5 rounded min-w-[36px] text-center shrink-0">
            {Math.round(explodeFactor * 100)}%
          </span>
        </div>

        {/* Right: Interaction Hint */}
        <span className="text-[11px] text-[#8A8982] shrink truncate text-right">
          Hover model to tilt
        </span>
      </div>

      {/* Clean Unobstructed 3D Axonometric Canvas */}
      <div className="relative w-full flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full h-auto block rounded-lg cursor-crosshair"
        />
      </div>

      {/* Bottom Bar: Layer Toggles Strip & Reset View */}
      <div className="w-full h-8.5 px-3 mt-1.5 rounded-lg border border-[#E7DED4] bg-[#FBF8F4] flex items-center justify-between text-[11px] whitespace-nowrap overflow-x-auto">
        <div className="flex items-center space-x-1.5 shrink-0">
          <span className="text-[#62645F] font-medium mr-1">Layers:</span>
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            title="Toggle Lux Heatmap"
            className={`px-2.5 py-0.5 rounded-md cursor-pointer transition-colors shrink-0 ${
              showHeatmap 
                ? 'bg-[#E5F4EF] text-[#087F73] font-semibold border border-[#087F73]/30' 
                : 'bg-[#FFFFFF] border border-[#E7DED4] text-[#8A8982]'
            }`}
          >
            <span>Heatmap</span>
          </button>

          <button
            onClick={() => setShowFurniture(!showFurniture)}
            title="Toggle Workstations"
            className={`px-2.5 py-0.5 rounded-md cursor-pointer transition-colors shrink-0 ${
              showFurniture 
                ? 'bg-[#E5F4EF] text-[#087F73] font-semibold border border-[#087F73]/30' 
                : 'bg-[#FFFFFF] border border-[#E7DED4] text-[#8A8982]'
            }`}
          >
            <span>Furniture</span>
          </button>

          <button
            onClick={() => setShowLuminaires(!showLuminaires)}
            title="Toggle Luminaires"
            className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-md cursor-pointer transition-colors shrink-0 ${
              showLuminaires 
                ? 'bg-[#E5F4EF] text-[#087F73] font-semibold border border-[#087F73]/30' 
                : 'bg-[#FFFFFF] border border-[#E7DED4] text-[#8A8982]'
            }`}
          >
            <Lightbulb className="w-3 h-3" />
            <span>Lights</span>
          </button>

          <button
            onClick={() => setShowConduits(!showConduits)}
            title="Toggle Conduit Raceways"
            className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-md cursor-pointer transition-colors shrink-0 ${
              showConduits 
                ? 'bg-[#E5F4EF] text-[#087F73] font-semibold border border-[#087F73]/30' 
                : 'bg-[#FFFFFF] border border-[#E7DED4] text-[#8A8982]'
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>Conduits</span>
          </button>
        </div>

        <button
          onClick={() => { setExplodeFactor(0.0); onResetZoom?.(); }}
          title="Reset Isometric View & Zoom"
          className="flex items-center space-x-1 px-2.5 py-0.5 rounded-md border border-[#E7DED4] bg-[#FFFFFF] hover:border-[#087F73] text-[#62645F] text-[11px] cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3 h-3 text-[#087F73]" />
          <span>Reset View</span>
        </button>
      </div>
    </div>
  );
}
