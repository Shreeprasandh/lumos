'use client';

import React, { useState } from 'react';
import BrandHeader from '@/components/layout/BrandHeader';
import PrimaryNav from '@/components/layout/PrimaryNav';
import FloorPlanCanvas from '@/components/workspace/FloorPlanCanvas';
import HairlineIsometricCanvas from '@/components/workspace/HairlineIsometricCanvas';
import { buildDefaultProject, DEFAULT_FIXTURE_SPEC } from '@/engine/sampleData';
import { computeSpacePhotometrics } from '@/engine/photometrics';
import { 
  Sliders, 
  Lightbulb, 
  Layers, 
  CheckCircle2, 
  Compass, 
  RotateCcw,
  Sparkles,
  Maximize2
} from 'lucide-react';

export default function DesignPage() {
  const [project, setProject] = useState(() => buildDefaultProject());
  const [viewType, setViewType] = useState<'2d' | '3d'>('2d');

  // Room geometry controls
  const [roomLength, setRoomLength] = useState(38);
  const [roomWidth, setRoomWidth] = useState(24);
  const [ceilingHeight, setCeilingHeight] = useState(3.6);
  const [workplaneHeight, setWorkplaneHeight] = useState(0.85);
  const [targetLux, setTargetLux] = useState(500);
  const [selectedFixtureId, setSelectedFixtureId] = useState('FIX-600X600-LED-36W');

  // Dynamic recalculation
  const activeSpace = {
    ...project.spaces[0],
    length: roomLength,
    width: roomWidth,
    ceilingHeight: ceilingHeight,
    workplaneHeight: workplaneHeight,
    area: roomLength * roomWidth,
    targetLux: targetLux
  };

  const activeFixture = DEFAULT_FIXTURE_SPEC;
  const photoResult = computeSpacePhotometrics(activeSpace, activeFixture);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F4]">
      {/* 1. Brand Header */}
      <BrandHeader />

      {/* 2. Primary Navigation */}
      <PrimaryNav activeTab="design" />

      {/* 3. Main Design Studio */}
      <main className="flex-1 p-6 max-w-[1680px] mx-auto w-full flex flex-col space-y-4">
        {/* Top Title & Viewport Mode Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-[20px] font-semibold text-[#202321] tracking-tight">
              Spatial Analysis & Photometric Design Studio
            </h1>
            <p className="text-[13px] text-[#62645F] mt-0.5">
              IS 3646 Zonal Cavity Lumen synthesis, 3D hairline axonometric radiosity, and SHR spacing optimization.
            </p>
          </div>

          {/* 2D / 3D Dual Engine Switcher */}
          <div className="flex items-center space-x-2 bg-[#FFFCF8] border border-[#E7DED4] p-1 rounded-xl shadow-2xs text-[12.5px]">
            <button
              onClick={() => setViewType('2d')}
              className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
                viewType === '2d'
                  ? 'bg-[#087F73] text-white shadow-2xs'
                  : 'text-[#62645F] hover:text-[#202321]'
              }`}
            >
              2D Plan & Heatmap
            </button>
            <button
              onClick={() => setViewType('3d')}
              className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
                viewType === '3d'
                  ? 'bg-[#087F73] text-white shadow-2xs'
                  : 'text-[#62645F] hover:text-[#202321]'
              }`}
            >
              3D Axonometric Model
            </button>
          </div>
        </div>

        {/* Dual Column Layout: Left Controls / Right Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Left Column: Spatial Cavity & Fixture Parameters (4 cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            {/* Room Cavity Geometry Card */}
            <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] p-5 shadow-2xs select-none">
              <div className="flex items-center space-x-2 mb-4">
                <Sliders className="w-4.5 h-4.5 text-[#087F73]" />
                <h2 className="text-[14.5px] font-semibold text-[#202321] tracking-tight">
                  Room Cavity Parameters
                </h2>
              </div>

              <div className="space-y-3.5 text-[12.5px]">
                {/* Length Slider */}
                <div>
                  <div className="flex justify-between text-[#62645F] mb-1">
                    <span>Room Length (m)</span>
                    <span className="font-semibold text-[#202321]">{roomLength} m</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    value={roomLength}
                    onChange={(e) => setRoomLength(Number(e.target.value))}
                    className="w-full accent-[#087F73] cursor-pointer"
                  />
                </div>

                {/* Width Slider */}
                <div>
                  <div className="flex justify-between text-[#62645F] mb-1">
                    <span>Room Width (m)</span>
                    <span className="font-semibold text-[#202321]">{roomWidth} m</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="45"
                    value={roomWidth}
                    onChange={(e) => setRoomWidth(Number(e.target.value))}
                    className="w-full accent-[#087F73] cursor-pointer"
                  />
                </div>

                {/* Ceiling Height */}
                <div>
                  <div className="flex justify-between text-[#62645F] mb-1">
                    <span>Ceiling Height (m)</span>
                    <span className="font-semibold text-[#202321]">{ceilingHeight} m</span>
                  </div>
                  <input
                    type="range"
                    min="2.8"
                    max="6.0"
                    step="0.1"
                    value={ceilingHeight}
                    onChange={(e) => setCeilingHeight(Number(e.target.value))}
                    className="w-full accent-[#087F73] cursor-pointer"
                  />
                </div>

                {/* Target Lux */}
                <div>
                  <div className="flex justify-between text-[#62645F] mb-1">
                    <span>Target Illuminance (IS 3646)</span>
                    <span className="font-semibold text-[#087F73]">{targetLux} Lux</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {[300, 500, 750].map((lx) => (
                      <button
                        key={lx}
                        onClick={() => setTargetLux(lx)}
                        className={`py-1 rounded-md text-[11.5px] border transition-colors cursor-pointer ${
                          targetLux === lx
                            ? 'bg-[#E5F4EF] border-[#087F73] text-[#087F73] font-semibold'
                            : 'bg-[#FFFFFF] border-[#E7DED4] text-[#62645F]'
                        }`}
                      >
                        {lx} Lux
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Calculated Photometric Solvers Card */}
            <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] p-5 shadow-2xs select-none">
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb className="w-4.5 h-4.5 text-[#087F73]" />
                <h2 className="text-[14.5px] font-semibold text-[#202321] tracking-tight">
                  Zonal Cavity Synthesis (IS 3646)
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-2.5 my-3 text-[12px]">
                <div className="bg-[#FFFFFF] border border-[#E7DED4] rounded-lg p-2.5">
                  <span className="text-[#8A8982] text-[11px] block">Room Cavity Ratio (RCR)</span>
                  <span className="font-bold text-[#202321] text-[14px]">
                    {photoResult.result.rcr}
                  </span>
                </div>

                <div className="bg-[#FFFFFF] border border-[#E7DED4] rounded-lg p-2.5">
                  <span className="text-[#8A8982] text-[11px] block">Utilization Factor (UF)</span>
                  <span className="font-bold text-[#202321] text-[14px]">
                    {photoResult.result.utilizationFactor}
                  </span>
                </div>

                <div className="bg-[#FFFFFF] border border-[#E7DED4] rounded-lg p-2.5">
                  <span className="text-[#8A8982] text-[11px] block">Synthesized Fixtures</span>
                  <span className="font-bold text-[#087F73] text-[14px]">
                    {photoResult.result.fixtureCount} Nos
                  </span>
                  <span className="text-[#8A8982] text-[10px] block">
                    {photoResult.result.gridRows} × {photoResult.result.gridCols} Grid
                  </span>
                </div>

                <div className="bg-[#FFFFFF] border border-[#E7DED4] rounded-lg p-2.5">
                  <span className="text-[#8A8982] text-[11px] block">Uniformity (U0)</span>
                  <span className="font-bold text-[#087A4B] text-[14px]">
                    {photoResult.result.uniformityU0}
                  </span>
                  <span className="text-[#8A8982] text-[10px] block">Target ≥ 0.60 (NBC)</span>
                </div>
              </div>

              {/* Statutory Pass Banner */}
              <div className="mt-3 p-2.5 rounded-lg bg-[#E5F4E9] border border-[#087A4B]/20 flex items-center justify-between text-[11.5px]">
                <div className="flex items-center space-x-1.5 text-[#087A4B] font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>IS 3646 & ECBC Compliant</span>
                </div>
                <span className="font-bold text-[#087A4B]">{photoResult.result.lpdWattsPerM2} W/m²</span>
              </div>
            </div>
          </div>

          {/* Right Column: Spatial Viewport (8 cols) */}
          <div className="lg:col-span-8 flex flex-col">
            {viewType === '2d' ? (
              <FloorPlanCanvas project={project} />
            ) : (
              <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] p-5 shadow-2xs h-full flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3 border-b border-[#E7DED4]">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#087F73]" />
                    <h2 className="text-[14.5px] font-semibold text-[#202321]">
                      Interactive Hairline Isometric Axonometric Engine
                    </h2>
                  </div>
                  <span className="text-[12px] text-[#8A8982]">
                    Layer Explosion · Ceiling Raceways · Photometrics
                  </span>
                </div>
                <div className="my-3 flex-1 flex items-center justify-center">
                  <HairlineIsometricCanvas project={project} height={560} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
