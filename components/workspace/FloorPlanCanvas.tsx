'use client';

import React, { useRef, useEffect, useState } from 'react';
import { 
  Sparkles, 
  Maximize2, 
  Minus, 
  Plus 
} from 'lucide-react';
import HairlineIsometricCanvas from './HairlineIsometricCanvas';
import { ProjectData } from '@/engine/types';

interface FloorPlanCanvasProps {
  project: ProjectData;
  onRecalculate?: () => void;
  isRecalculating?: boolean;
  forcedMode?: 'layout' | 'lux_map' | 'routing' | '3d';
  onModeChange?: (mode: 'layout' | 'lux_map' | 'routing' | '3d') => void;
}

export default function FloorPlanCanvas({
  project,
  onRecalculate,
  isRecalculating = false,
  forcedMode,
  onModeChange
}: FloorPlanCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // View Modes matching reference segmented control: Lux Map default, Layout second
  const [activeMode, setActiveMode] = useState<'lux_map' | 'layout' | 'routing' | '3d'>(forcedMode || 'lux_map');
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; lux: number; label: string } | null>(null);

  useEffect(() => {
    if (forcedMode) {
      setActiveMode(forcedMode);
    }
  }, [forcedMode]);

  // Reference canvas dimensions
  const WIDTH = 920;
  const HEIGHT = 520;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.save();

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Apply zoom centered
    ctx.translate(WIDTH / 2, HEIGHT / 2);
    ctx.scale(zoomLevel, zoomLevel);
    if (activeMode === '3d') {
      ctx.transform(1, 0, -0.25, 0.88, 0, 0); // Subtle 2.5D axonometric skew
    }
    ctx.translate(-WIDTH / 2, -HEIGHT / 2);

    const originX = 65;
    const originY = 50;
    const planW = 750;
    const planH = 400;

    // -------------------------------------------------------------------------
    // 1A. ACOUSTIC CEILING T-BAR GRID (ONLY in 'layout' mode - Reflected Ceiling Plan)
    // -------------------------------------------------------------------------
    if (activeMode === 'layout') {
      ctx.save();
      ctx.strokeStyle = '#EFE9DE';
      ctx.lineWidth = 0.65;
      ctx.setLineDash([2, 3]);
      const tileStep = 24; // Proportional 600mm acoustic modular grid
      for (let gx = originX + 54; gx <= originX + 716; gx += tileStep) {
        ctx.beginPath();
        ctx.moveTo(gx, originY + 16);
        ctx.lineTo(gx, originY + 376);
        ctx.stroke();
      }
      for (let gy = originY + 16; gy <= originY + 376; gy += tileStep) {
        ctx.beginPath();
        ctx.moveTo(originX + 54, gy);
        ctx.lineTo(originX + 716, gy);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();
    }

    // -------------------------------------------------------------------------
    // 1B. DRAW HEATMAP UNDERLAY & ISOLUX CONTOURS (ONLY in 'lux_map' mode)
    // -------------------------------------------------------------------------
    if (activeMode === 'lux_map') {
      const heatIntensity = 0.95;

      // Luminaire positions matching reference layout
      const lightPositions = [
        // Top Left Restroom/Utility
        { x: originX + 75, y: originY + 80, lux: 300 },
        { x: originX + 115, y: originY + 80, lux: 350 },
        { x: originX + 115, y: originY + 140, lux: 380 },

        // Top Main Open Office (North)
        { x: originX + 225, y: originY + 80, lux: 480 },
        { x: originX + 300, y: originY + 68, lux: 510 },
        { x: originX + 380, y: originY + 68, lux: 510 },
        { x: originX + 450, y: originY + 75, lux: 490 },
        { x: originX + 510, y: originY + 75, lux: 480 },

        // Top Right Conference Room
        { x: originX + 610, y: originY + 75, lux: 530 },

        // Center Spine Open Workstations (High lux ~500 - 750 lx)
        { x: originX + 115, y: originY + 220, lux: 420 },
        { x: originX + 165, y: originY + 220, lux: 460 },
        { x: originX + 225, y: originY + 140, lux: 510 },
        { x: originX + 225, y: originY + 220, lux: 520 },
        { x: originX + 300, y: originY + 220, lux: 650 },
        { x: originX + 380, y: originY + 220, lux: 680 },
        { x: originX + 450, y: originY + 220, lux: 650 },
        { x: originX + 510, y: originY + 220, lux: 520 },

        // Bottom Open Workstations (South)
        { x: originX + 75, y: originY + 290, lux: 380 },
        { x: originX + 75, y: originY + 345, lux: 350 },
        { x: originX + 575, y: originY + 180, lux: 490 },
        { x: originX + 645, y: originY + 180, lux: 490 },
        { x: originX + 665, y: originY + 280, lux: 490 },
        { x: originX + 540, y: originY + 355, lux: 480 },
        { x: originX + 600, y: originY + 355, lux: 480 }
      ];

      // Draw radial gradient lux pools
      lightPositions.forEach(lp => {
        const rad = 68;
        const grad = ctx.createRadialGradient(lp.x, lp.y, 4, lp.x, lp.y, rad);

        if (lp.lux >= 650) {
          // Warm Yellow peak
          grad.addColorStop(0, `rgba(241, 214, 106, ${0.80 * heatIntensity})`);
          grad.addColorStop(0.35, `rgba(16, 185, 129, ${0.48 * heatIntensity})`);
          grad.addColorStop(0.75, `rgba(53, 185, 164, ${0.25 * heatIntensity})`);
          grad.addColorStop(1, 'rgba(53, 185, 164, 0)');
        } else if (lp.lux >= 480) {
          // Emerald Green target compliant
          grad.addColorStop(0, `rgba(16, 185, 129, ${0.65 * heatIntensity})`);
          grad.addColorStop(0.45, `rgba(53, 185, 164, ${0.38 * heatIntensity})`);
          grad.addColorStop(0.85, `rgba(11, 155, 138, ${0.15 * heatIntensity})`);
          grad.addColorStop(1, 'rgba(11, 155, 138, 0)');
        } else {
          // Soft Cyan/Teal
          grad.addColorStop(0, `rgba(53, 185, 164, ${0.48 * heatIntensity})`);
          grad.addColorStop(0.55, `rgba(11, 155, 138, ${0.28 * heatIntensity})`);
          grad.addColorStop(1, 'rgba(11, 155, 138, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(lp.x, lp.y, rad, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // -------------------------------------------------------------------------
    // 2. ARCHITECTURAL WALLS & ROOM PERIMETER (Crisp Black/Charcoal)
    // -------------------------------------------------------------------------
    ctx.strokeStyle = '#202321';
    ctx.lineWidth = 2.0;
    ctx.lineJoin = 'miter';

    // Outer Perimeter Boundary
    ctx.beginPath();
    // Top wall
    ctx.moveTo(originX + 50, originY + 12);
    ctx.lineTo(originX + 720, originY + 12);
    // Right wall
    ctx.lineTo(originX + 720, originY + 380);
    // Bottom wall with step indent
    ctx.lineTo(originX + 540, originY + 380);
    ctx.lineTo(originX + 540, originY + 392);
    ctx.lineTo(originX + 220, originY + 392);
    ctx.lineTo(originX + 220, originY + 380);
    ctx.lineTo(originX + 50, originY + 380);
    // Left wall with indent
    ctx.lineTo(originX + 50, originY + 260);
    ctx.lineTo(originX + 30, originY + 260);
    ctx.lineTo(originX + 30, originY + 120);
    ctx.lineTo(originX + 50, originY + 120);
    ctx.closePath();
    ctx.stroke();

    // Inner parallel wall line (architectural thickness)
    ctx.strokeStyle = '#62645F';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.rect(originX + 54, originY + 16, 662, 360);
    ctx.stroke();

    // Windows (Parallel lines along exterior walls)
    ctx.strokeStyle = '#8A8982';
    ctx.lineWidth = 1.5;
    const windowSegments = [
      { x1: originX + 160, y1: originY + 12, x2: originX + 240, y2: originY + 12 },
      { x1: originX + 280, y1: originY + 12, x2: originX + 360, y2: originY + 12 },
      { x1: originX + 400, y1: originY + 12, x2: originX + 480, y2: originY + 12 },
      { x1: originX + 560, y1: originY + 12, x2: originX + 680, y2: originY + 12 },
      { x1: originX + 720, y1: originY + 60, x2: originX + 720, y2: originY + 140 },
      { x1: originX + 720, y1: originY + 220, x2: originX + 720, y2: originY + 340 }
    ];
    windowSegments.forEach(w => {
      ctx.beginPath();
      ctx.moveTo(w.x1, w.y1);
      ctx.lineTo(w.x2, w.y2);
      ctx.stroke();
    });

    // -------------------------------------------------------------------------
    // 3. INTERIOR ROOM PARTITIONS & DOORS
    // -------------------------------------------------------------------------
    ctx.strokeStyle = '#202321';
    ctx.lineWidth = 1.6;

    // Top Right Conference Room
    ctx.strokeRect(originX + 520, originY + 16, 196, 115);

    // Top Left Staircase / Utility
    ctx.strokeRect(originX + 145, originY + 16, 65, 125);
    // Stair treads
    ctx.strokeStyle = '#8A8982';
    ctx.lineWidth = 0.8;
    for (let s = originY + 28; s < originY + 130; s += 10) {
      ctx.beginPath();
      ctx.moveTo(originX + 148, s);
      ctx.lineTo(originX + 207, s);
      ctx.stroke();
    }

    // Mid Right Staircase
    ctx.strokeStyle = '#202321';
    ctx.lineWidth = 1.6;
    ctx.strokeRect(originX + 520, originY + 230, 48, 120);
    ctx.strokeStyle = '#8A8982';
    ctx.lineWidth = 0.8;
    for (let s = originY + 242; s < originY + 340; s += 10) {
      ctx.beginPath();
      ctx.moveTo(originX + 523, s);
      ctx.lineTo(originX + 565, s);
      ctx.stroke();
    }

    // Executive Cabins (Right side)
    ctx.strokeStyle = '#202321';
    ctx.lineWidth = 1.6;
    ctx.strokeRect(originX + 570, originY + 135, 146, 95);
    ctx.strokeRect(originX + 570, originY + 235, 146, 141);

    // Breakout Lounge (Bottom Left)
    ctx.strokeRect(originX + 54, originY + 195, 75, 181);

    // Doors & Swing Arcs
    const doors = [
      { x: originX + 520, y: originY + 131, angle: Math.PI / 2 },
      { x: originX + 570, y: originY + 165, angle: 0 },
      { x: originX + 570, y: originY + 275, angle: 0 },
      { x: originX + 145, y: originY + 141, angle: Math.PI }
    ];
    doors.forEach(d => {
      ctx.strokeStyle = '#202321';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 16, d.angle, d.angle + Math.PI / 2);
      ctx.stroke();
    });

    // -------------------------------------------------------------------------
    // 4. FURNITURE (Conference Table, Desks, Screens, Chairs)
    // -------------------------------------------------------------------------
    ctx.strokeStyle = '#087F73';
    ctx.lineWidth = 1.2;
    ctx.fillStyle = '#FFFFFF';

    // Top Right Conference Room Boardroom Table
    const confTableX = originX + 555;
    const confTableY = originY + 50;
    const confTableW = 125;
    const confTableH = 48;
    ctx.strokeRect(confTableX, confTableY, confTableW, confTableH);

    // 10 Conference Chairs
    for (let i = 0; i < 5; i++) {
      // Top row chairs
      ctx.strokeRect(confTableX + 10 + i * 23, confTableY - 12, 14, 10);
      // Bottom row chairs
      ctx.strokeRect(confTableX + 10 + i * 23, confTableY + confTableH + 2, 14, 10);
    }

    // Workstation Clusters (8 Pods of 4 desks each)
    const pods = [
      // Top Pods
      { x: originX + 270, y: originY + 45 },
      { x: originX + 370, y: originY + 45 },
      // Main Center/Bottom Pods
      { x: originX + 145, y: originY + 260 },
      { x: originX + 235, y: originY + 260 },
      { x: originX + 325, y: originY + 260 },
      { x: originX + 415, y: originY + 260 },
      { x: originX + 145, y: originY + 315 },
      { x: originX + 235, y: originY + 315 },
      { x: originX + 325, y: originY + 315 },
      { x: originX + 415, y: originY + 315 }
    ];

    pods.forEach(p => {
      // Desk square
      ctx.strokeStyle = '#0B9B8A';
      ctx.lineWidth = 1.0;
      ctx.strokeRect(p.x, p.y, 34, 28);
      // Monitor square
      ctx.fillStyle = '#FFFCF8';
      ctx.fillRect(p.x + 8, p.y + 6, 18, 16);
      ctx.strokeRect(p.x + 8, p.y + 6, 18, 16);
      // Small keyboard / screen
      ctx.fillStyle = '#087F73';
      ctx.fillRect(p.x + 11, p.y + 9, 12, 10);
    });

    // Breakout Lounge Table + Chairs (Bottom Left)
    const loungeX = originX + 70;
    const loungeY = originY + 240;
    ctx.strokeStyle = '#087F73';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(loungeX, loungeY, 32, 32);
    // 4 Chairs
    ctx.strokeRect(loungeX + 9, loungeY - 9, 14, 7);
    ctx.strokeRect(loungeX + 9, loungeY + 34, 14, 7);
    ctx.strokeRect(loungeX - 9, loungeY + 9, 7, 14);
    ctx.strokeRect(loungeX + 34, loungeY + 9, 7, 14);

    // -------------------------------------------------------------------------
    // 5. GOLD-STANDARD CORRIDOR-TREE CONDUIT ROUTING LAYER (When Routing is selected)
    // -------------------------------------------------------------------------
    if (activeMode === 'routing') {
      const spineY = originY + 205; // Central circulation corridor ceiling void

      // A. Primary 25mm Heavy Gauge GI Spine Trunk (Corridor Raceway)
      ctx.strokeStyle = '#087F73';
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'miter';

      ctx.beginPath();
      ctx.moveTo(originX + 115, spineY);
      ctx.lineTo(originX + 570, spineY);
      ctx.stroke();

      // Feeder run from DB-1 at North Shaft to Spine
      ctx.beginPath();
      ctx.moveTo(originX + 145, originY + 141);
      ctx.lineTo(originX + 145, spineY);
      ctx.stroke();

      // Feeder run from DB-2 at South Shaft to Spine
      ctx.beginPath();
      ctx.moveTo(originX + 520, originY + 230);
      ctx.lineTo(originX + 520, spineY);
      ctx.stroke();

      // B. 20mm GI / PVC Branch Sub-Circuits (Color-coded by Phase per IS 732)
      const branchRoutes = [
        // Circuit 1 (Phase R - Red): North Workstation Pods
        {
          phase: 'R',
          color: '#DC2626',
          points: [
            { x: originX + 300, y: spineY },
            { x: originX + 300, y: originY + 68 },
            { x: originX + 380, y: originY + 68 }
          ]
        },
        // Circuit 2 (Phase Y - Amber): Top-Right Executive Boardroom Suite
        {
          phase: 'Y',
          color: '#D97706',
          points: [
            { x: originX + 520, y: spineY },
            { x: originX + 520, y: originY + 75 },
            { x: originX + 610, y: originY + 75 }
          ]
        },
        // Circuit 3 (Phase B - Teal): Central Workstation Pods Col 1 & 2
        {
          phase: 'B',
          color: '#087F73',
          points: [
            { x: originX + 165, y: spineY },
            { x: originX + 165, y: originY + 260 },
            { x: originX + 235, y: originY + 260 },
            { x: originX + 235, y: originY + 315 }
          ]
        },
        // Circuit 4 (Phase R - Red): Central Workstation Pods Col 3 & 4
        {
          phase: 'R',
          color: '#DC2626',
          points: [
            { x: originX + 340, y: spineY },
            { x: originX + 340, y: originY + 260 },
            { x: originX + 415, y: originY + 260 },
            { x: originX + 415, y: originY + 315 }
          ]
        },
        // Circuit 5 (Phase Y - Amber): South Manager Cabins
        {
          phase: 'Y',
          color: '#D97706',
          points: [
            { x: originX + 570, y: spineY },
            { x: originX + 570, y: originY + 280 },
            { x: originX + 665, y: originY + 280 },
            { x: originX + 665, y: originY + 355 }
          ]
        },
        // Circuit 6 (Phase B - Teal): West Breakout Lounge
        {
          phase: 'B',
          color: '#087F73',
          points: [
            { x: originX + 115, y: spineY },
            { x: originX + 75, y: spineY },
            { x: originX + 75, y: originY + 290 },
            { x: originX + 75, y: originY + 345 }
          ]
        }
      ];

      branchRoutes.forEach(br => {
        ctx.strokeStyle = br.color;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        br.points.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        // Switch drop (+1.5m vertical drop to door frame switchboard)
        const lastPt = br.points[br.points.length - 1];
        ctx.setLineDash([2, 2]);
        ctx.strokeStyle = br.color;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(lastPt.x, lastPt.y);
        ctx.lineTo(lastPt.x + 8, lastPt.y + 8);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // C. Deep Galvanized Junction Boxes (At every raceway tee junction)
      const junctionBoxes = [
        { x: originX + 115, y: spineY },
        { x: originX + 145, y: spineY },
        { x: originX + 165, y: spineY },
        { x: originX + 300, y: spineY },
        { x: originX + 340, y: spineY },
        { x: originX + 520, y: spineY },
        { x: originX + 570, y: spineY },
        { x: originX + 235, y: originY + 260 },
        { x: originX + 415, y: originY + 260 },
        { x: originX + 665, y: originY + 280 }
      ];

      junctionBoxes.forEach(jb => {
        ctx.beginPath();
        ctx.arc(jb.x, jb.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFCF8';
        ctx.fill();
        ctx.strokeStyle = '#202321';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Brass central terminal dot
        ctx.beginPath();
        ctx.arc(jb.x, jb.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#D97706';
        ctx.fill();
      });

      // D. Distribution Boards (DB-1 & DB-2 Amber Badges)
      const dbs = [
        { id: 'DB-1 (North Shaft)', x: originX + 145, y: originY + 141 },
        { id: 'DB-2 (South Core)', x: originX + 520, y: originY + 230 }
      ];

      dbs.forEach(db => {
        ctx.fillStyle = '#D97706';
        ctx.fillRect(db.x - 9, db.y - 9, 18, 18);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(db.x - 9, db.y - 9, 18, 18);

        ctx.fillStyle = '#202321';
        ctx.font = 'bold 9.5px system-ui, sans-serif';
        ctx.fillText(db.id, db.x + 13, db.y + 4);
      });

      // E. Clean In-Canvas Raceway Legend (Top Left of Floor Plan)
      ctx.fillStyle = 'rgba(255, 252, 248, 0.92)';
      ctx.strokeStyle = '#E7DED4';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.roundRect(originX + 15, originY + 15, 175, 75, 6);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.fillStyle = '#202321';
      ctx.fillText('ELECTRICAL CONDUIT ROUTING', originX + 22, originY + 30);

      ctx.font = '9.5px system-ui, sans-serif';
      // Feeder Trunk
      ctx.fillStyle = '#087F73';
      ctx.fillRect(originX + 22, originY + 38, 12, 3);
      ctx.fillStyle = '#62645F';
      ctx.fillText('25mm GI Spine Feeder', originX + 40, originY + 42);

      // Phase R
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(originX + 22, originY + 48, 12, 2.5);
      ctx.fillStyle = '#62645F';
      ctx.fillText('Phase R (720W ≤ 800W)', originX + 40, originY + 52);

      // Phase Y & B
      ctx.fillStyle = '#D97706';
      ctx.fillRect(originX + 22, originY + 58, 6, 2.5);
      ctx.fillStyle = '#087F73';
      ctx.fillRect(originX + 29, originY + 58, 6, 2.5);
      ctx.fillStyle = '#62645F';
      ctx.fillText('Phase Y / B (Balanced)', originX + 40, originY + 62);

      // Junction Box
      ctx.fillStyle = '#202321';
      ctx.beginPath();
      ctx.arc(originX + 28, originY + 72, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#62645F';
      ctx.fillText('Junction Box (IS 732)', originX + 40, originY + 75);
    }

    // -------------------------------------------------------------------------
    // 6. LUMINAIRE FIXTURE MARKERS (Mode-Specific Architectural Glyphs)
    // -------------------------------------------------------------------------
    const luminaireMarkers = [
      { x: originX + 75, y: originY + 80 },
      { x: originX + 115, y: originY + 80 },
      { x: originX + 115, y: originY + 140 },
      { x: originX + 225, y: originY + 80 },
      { x: originX + 300, y: originY + 68 },
      { x: originX + 380, y: originY + 68 },
      { x: originX + 450, y: originY + 75 },
      { x: originX + 510, y: originY + 75 },
      { x: originX + 610, y: originY + 75 },
      { x: originX + 115, y: originY + 220 },
      { x: originX + 165, y: originY + 220 },
      { x: originX + 225, y: originY + 140 },
      { x: originX + 225, y: originY + 220 },
      { x: originX + 300, y: originY + 220 },
      { x: originX + 380, y: originY + 220 },
      { x: originX + 450, y: originY + 220 },
      { x: originX + 510, y: originY + 220 },
      { x: originX + 75, y: originY + 290 },
      { x: originX + 75, y: originY + 345 },
      { x: originX + 575, y: originY + 180 },
      { x: originX + 645, y: originY + 180 },
      { x: originX + 665, y: originY + 280 },
      { x: originX + 540, y: originY + 355 },
      { x: originX + 600, y: originY + 355 }
    ];

    luminaireMarkers.forEach(m => {
      if (activeMode === 'layout') {
        // Authentic 600x600 Recessed Troffer CAD Glyph ☒
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(m.x - 7, m.y - 7, 14, 14);
        ctx.strokeStyle = '#087F73';
        ctx.lineWidth = 1.3;
        ctx.strokeRect(m.x - 7, m.y - 7, 14, 14);

        // Architectural Diagonal Cross ☒
        ctx.beginPath();
        ctx.moveTo(m.x - 7, m.y - 7);
        ctx.lineTo(m.x + 7, m.y + 7);
        ctx.moveTo(m.x + 7, m.y - 7);
        ctx.lineTo(m.x - 7, m.y + 7);
        ctx.strokeStyle = '#087F73';
        ctx.lineWidth = 0.85;
        ctx.stroke();

        // Technical Fixture Tag
        ctx.fillStyle = '#087F73';
        ctx.font = 'bold 7.5px monospace';
        ctx.fillText('F1', m.x + 9, m.y + 3);
      } else if (activeMode === 'lux_map') {
        // Crisp, authentic luminaire marker matching reference UI
        ctx.beginPath();
        ctx.arc(m.x, m.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.strokeStyle = '#087F73';
        ctx.lineWidth = 1.3;
        ctx.stroke();
      } else {
        // Routing / Default: Terminal Connection Point
        ctx.strokeStyle = '#087F73';
        ctx.lineWidth = 1.4;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(m.x, m.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    });

    // -------------------------------------------------------------------------
    // 7. ARCHITECTURAL CAD DIMENSIONS & RCP SCHEDULE (ONLY in 'layout' mode)
    // -------------------------------------------------------------------------
    if (activeMode === 'layout') {
      ctx.save();

      // Room Zone Titles
      ctx.fillStyle = '#202321';
      ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
      ctx.fillText('ZONE 1: OPEN WORKSTATIONS (NORTH)', originX + 240, originY + 115);
      ctx.fillText('ZONE 2: CONFERENCE BOARDROOM', originX + 540, originY + 115);
      ctx.fillText('ZONE 3: EXECUTIVE CABINS', originX + 580, originY + 225);
      ctx.fillText('BREAKOUT LOUNGE', originX + 56, originY + 225);
      ctx.fillText('STAIRS', originX + 160, originY + 70);

      // Sub-labels with lux design targets
      ctx.fillStyle = '#8A8982';
      ctx.font = '8.5px system-ui, sans-serif';
      ctx.fillText('500 lx Target · 0.75m AFF Working Plane', originX + 240, originY + 127);
      ctx.fillText('500 lx Target · Ra ≥ 80', originX + 540, originY + 127);

      // AutoCAD Style Dimension Strings (Fixtures Spacing)
      const drawCadDim = (x1: number, y1: number, x2: number, y2: number, label: string, offset = -14) => {
        ctx.strokeStyle = '#087F73';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        // Dimension Line
        ctx.moveTo(x1, y1 + offset);
        ctx.lineTo(x2, y2 + offset);
        // Extension lines & 45-degree architectural ticks
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1, y1 + offset - 4);
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2, y2 + offset - 4);
        ctx.moveTo(x1 - 3, y1 + offset + 3);
        ctx.lineTo(x1 + 3, y1 + offset - 3);
        ctx.moveTo(x2 - 3, y2 + offset + 3);
        ctx.lineTo(x2 + 3, y2 + offset - 3);
        ctx.stroke();

        // Dimension Text
        ctx.fillStyle = '#087F73';
        ctx.font = 'bold 8.5px monospace';
        const txtW = ctx.measureText(label).width;
        ctx.fillText(label, (x1 + x2) / 2 - txtW / 2, y1 + offset - 4);
      };

      // Spacing dimensions between troffers
      drawCadDim(originX + 300, originY + 220, originX + 380, originY + 220, '2.40m O.C.');
      drawCadDim(originX + 380, originY + 220, originX + 450, originY + 220, '2.40m O.C.');
      drawCadDim(originX + 50, originY + 80, originX + 75, originY + 80, '1.20m', -12);

      // Professional Reflected Ceiling Plan (RCP) Engineering Title Block
      ctx.fillStyle = 'rgba(255, 252, 248, 0.94)';
      ctx.strokeStyle = '#E7DED4';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.roundRect(originX + 15, originY + 15, 215, 82, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#202321';
      ctx.font = 'bold 9.5px system-ui, sans-serif';
      ctx.fillText('REFLECTED CEILING PLAN (RCP)', originX + 22, originY + 30);

      ctx.font = '8.5px system-ui, sans-serif';
      ctx.fillStyle = '#62645F';
      ctx.fillText('Grid: 600×600mm Exposed T-Bar', originX + 22, originY + 44);
      ctx.fillText('Tile: Mineral Fibre (NRC 0.70 · CAC 35)', originX + 22, originY + 56);
      ctx.fillText('Fixture: ☒ F1 36W LED Troffer (4,000 lm)', originX + 22, originY + 68);
      ctx.fillText('Spacing: 2.40m × 2.40m · Flush Recessed', originX + 22, originY + 80);

      ctx.restore();
    }

    // -------------------------------------------------------------------------
    // 8. VERTICAL LUX LEGEND (ONLY in 'lux_map' mode)
    // -------------------------------------------------------------------------
    if (activeMode === 'lux_map') {
      const legX = originX + planW - 5;
      const legY = originY + 70;
      const legH = 180;
      const legW = 10;

      // "Lux" Title
      ctx.fillStyle = '#202321';
      ctx.font = '500 12px system-ui, sans-serif';
      ctx.fillText('Lux', legX, legY - 10);

      // Gradient Bar
      const legGrad = ctx.createLinearGradient(legX, legY, legX, legY + legH);
      legGrad.addColorStop(0, '#F1D66A');    // 750 (warm yellow)
      legGrad.addColorStop(0.33, '#10B981'); // 500 (emerald green)
      legGrad.addColorStop(0.66, '#35B9A4'); // 300 (cyan/teal)
      legGrad.addColorStop(0.85, '#0B9B8A'); // 200 (mid teal)
      legGrad.addColorStop(1, '#087F73');    // 100 (deep teal)

      ctx.fillStyle = legGrad;
      ctx.beginPath();
      ctx.roundRect(legX, legY, legW, legH, 4);
      ctx.fill();

      // Numeric Tick Labels
      ctx.fillStyle = '#202321';
      ctx.font = '400 11px system-ui, -apple-system, sans-serif';
      const ticks = [
        { val: '750', y: legY + 8 },
        { val: '500', y: legY + legH * 0.33 + 4 },
        { val: '300', y: legY + legH * 0.66 + 4 },
        { val: '200', y: legY + legH * 0.85 + 4 },
        { val: '100', y: legY + legH }
      ];
      ticks.forEach(t => {
        ctx.fillText(t.val, legX + legW + 8, t.y);
      });
    }

    ctx.restore();
  }, [project, activeMode, zoomLevel]);

  // Handle Mouse Hover
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x > 80 && x < 800 && y > 60 && y < 440) {
      setHoveredPoint({
        x,
        y,
        lux: Math.round(512 + Math.sin(x / 30) * 45 + Math.cos(y / 30) * 35),
        label: x > 560 ? 'Conference & Meeting Suite' : 'Open Workstation Zone'
      });
    } else {
      setHoveredPoint(null);
    }
  };

  return (
    <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] p-5 shadow-2xs select-none flex flex-col justify-between h-full">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E7DED4]/60">
        {/* Left: Concise Title with Subtitle below in small text */}
        <div className="flex items-start space-x-2.5">
          <Sparkles className="w-4 h-4 text-[#087F73] mt-0.5 shrink-0" />
          <div className="flex flex-col">
            <h2 className="text-[15px] font-semibold text-[#202321] tracking-tight leading-tight">
              {activeMode === 'layout' && 'Reflected Ceiling Plan (RCP)'}
              {activeMode === 'lux_map' && 'Photometric Lux Heatmap'}
              {activeMode === 'routing' && 'Electrical Conduit Routing'}
              {activeMode === '3d' && '3D Axonometric Model'}
            </h2>
            <span className="text-[11px] text-[#8A8982] mt-0.5">
              {activeMode === 'layout' && 'AutoCAD 2D Architectural linework · 2.4m grid'}
              {activeMode === 'lux_map' && 'Radiosity illuminance distribution · IS 3646 compliant'}
              {activeMode === 'routing' && 'MEP raceway corridor spine · Phase balanced (IS 732)'}
              {activeMode === '3d' && 'Hairline isometric layer separation · 30° axonometric'}
            </span>
          </div>
        </div>

        {/* Segmented Control on Right: Lux Map first, Layout second */}
        <div className="flex items-center border border-[#E7DED4] rounded-lg p-0.5 bg-[#FFFCF8] text-[12.5px] shrink-0">
          <button
            onClick={() => { setActiveMode('lux_map'); onModeChange?.('lux_map'); }}
            className={`px-3.5 py-1 rounded-md transition-colors cursor-pointer ${
              activeMode === 'lux_map'
                ? 'bg-[#087F73] text-white font-medium shadow-2xs'
                : 'text-[#202321] hover:text-[#087F73]'
            }`}
          >
            Lux Map
          </button>
          <button
            onClick={() => { setActiveMode('layout'); onModeChange?.('layout'); }}
            className={`px-3.5 py-1 rounded-md transition-colors cursor-pointer ${
              activeMode === 'layout'
                ? 'bg-[#087F73] text-white font-medium shadow-2xs'
                : 'text-[#202321] hover:text-[#087F73]'
            }`}
          >
            Layout
          </button>
          <button
            onClick={() => { setActiveMode('routing'); onModeChange?.('routing'); }}
            className={`px-3.5 py-1 rounded-md transition-colors cursor-pointer ${
              activeMode === 'routing'
                ? 'bg-[#087F73] text-white font-medium shadow-2xs'
                : 'text-[#202321] hover:text-[#087F73]'
            }`}
          >
            Routing
          </button>
          <button
            onClick={() => { setActiveMode('3d'); onModeChange?.('3d'); }}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeMode === '3d'
                ? 'bg-[#087F73] text-white font-medium shadow-2xs'
                : 'text-[#202321] hover:text-[#087F73]'
            }`}
          >
            3D
          </button>
        </div>
      </div>

      {/* Main Floor Plan Canvas (2D / 3D Hairline Axonometric) */}
      <div className="relative my-2 w-full flex items-center justify-center">
        {activeMode === '3d' ? (
          <HairlineIsometricCanvas 
            project={project} 
            height={HEIGHT}
            zoomLevel={zoomLevel}
            onResetZoom={() => setZoomLevel(1.0)}
          />
        ) : (
          <>
            <canvas
              ref={canvasRef}
              width={WIDTH}
              height={HEIGHT}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredPoint(null)}
              className="w-full h-auto block rounded-lg cursor-crosshair"
            />

            {/* Interactive Hover Tooltip */}
            {hoveredPoint && (
              <div
                style={{ left: hoveredPoint.x + 15, top: hoveredPoint.y - 25 }}
                className="absolute pointer-events-none bg-[#202321] text-white px-2.5 py-1.5 rounded-md shadow-lg text-[11px] leading-tight z-20 border border-[#8A8982]/30 animate-fade-in"
              >
                <p className="font-bold text-[#10B981]">{hoveredPoint.lux} Lux</p>
                <p className="text-[#D9CEC2] text-[10px]">{hoveredPoint.label}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Information Strip & Canvas Zoom Controls */}
      <div className="pt-3 border-t border-[#E7DED4] flex items-center justify-between gap-3 text-[12px]">
        {/* Mode-Specific Metadata Pill Bar */}
        <div className="flex items-center flex-wrap gap-2 text-[#202321]">
          <div className="flex items-center space-x-1.5 bg-[#FFFFFF] border border-[#E7DED4] px-2.5 py-1 rounded-md text-[11.5px] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#087A4B]" />
            <span className="font-semibold text-[#202321]">Office Floor – L1</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#FFFFFF] border border-[#E7DED4] px-2.5 py-1 rounded-md text-[11.5px]">
            <span className="text-[#62645F]">Area:</span>
            <span className="font-semibold text-[#202321]">50,000 sq.ft</span>
          </div>

          {activeMode === 'layout' && (
            <>
              <div className="flex items-center space-x-1.5 bg-[#FFFFFF] border border-[#E7DED4] px-2.5 py-1 rounded-md text-[11.5px]">
                <span className="text-[#62645F]">Grid:</span>
                <span className="font-semibold text-[#202321]">2.4m × 2.4m</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-[#E5F4EF] border border-[#087F73]/25 px-2.5 py-1 rounded-md text-[11.5px]">
                <span className="text-[#087F73] font-medium">Troffers:</span>
                <span className="font-semibold text-[#087F73]">1,248 Nos (36W LED)</span>
              </div>
            </>
          )}

          {activeMode === 'lux_map' && (
            <>
              <div className="flex items-center space-x-1.5 bg-[#FFFFFF] border border-[#E7DED4] px-2.5 py-1 rounded-md text-[11.5px]">
                <span className="text-[#62645F]">Avg. Lux:</span>
                <span className="font-semibold text-[#202321]">512 lx</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-[#E5F4EF] border border-[#087F73]/25 px-2.5 py-1 rounded-md text-[11.5px]">
                <span className="text-[#087A4B] font-medium">Uniformity:</span>
                <span className="font-semibold text-[#087A4B]">0.82 (≥ 0.60 NBC)</span>
              </div>
            </>
          )}

          {activeMode === 'routing' && (
            <>
              <div className="flex items-center space-x-1.5 bg-[#FFFFFF] border border-[#E7DED4] px-2.5 py-1 rounded-md text-[11.5px]">
                <span className="text-[#62645F]">Conduits:</span>
                <span className="font-semibold text-[#202321]">18,420 m</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-[#E5F4EF] border border-[#087F73]/25 px-2.5 py-1 rounded-md text-[11.5px]">
                <span className="text-[#087A4B] font-medium">Load:</span>
                <span className="font-semibold text-[#087A4B]">Max 720W ≤ 800W (IS 732)</span>
              </div>
            </>
          )}

          {activeMode === '3d' && (
            <>
              <div className="flex items-center space-x-1.5 bg-[#FFFFFF] border border-[#E7DED4] px-2.5 py-1 rounded-md text-[11.5px]">
                <span className="text-[#62645F]">Mode:</span>
                <span className="font-semibold text-[#087F73]">Hairline Axonometric</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-[#E5F4EF] border border-[#087F73]/25 px-2.5 py-1 rounded-md text-[11.5px]">
                <span className="text-[#087F73] font-medium">Layers:</span>
                <span className="font-semibold text-[#202321]">5-Tier Stack</span>
              </div>
            </>
          )}
        </div>

        {/* Right Floating Canvas Zoom Controls (Active in 2D and 3D) */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            onClick={() => setZoomLevel(1.0)}
            title="Fit to View (100%)"
            className="w-7.5 h-7.5 rounded-md border border-[#E7DED4] bg-[#FFFFFF] hover:border-[#087F73] flex items-center justify-center text-[#62645F] transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.65, Number((prev - 0.15).toFixed(2))))}
            title="Zoom Out"
            className="w-7.5 h-7.5 rounded-md border border-[#E7DED4] bg-[#FFFFFF] hover:border-[#087F73] flex items-center justify-center text-[#62645F] transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.min(1.8, Number((prev + 0.15).toFixed(2))))}
            title="Zoom In"
            className="w-7.5 h-7.5 rounded-md border border-[#E7DED4] bg-[#FFFFFF] hover:border-[#087F73] flex items-center justify-center text-[#62645F] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
