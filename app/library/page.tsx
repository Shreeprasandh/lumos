'use client';

import React, { useState } from 'react';
import BrandHeader from '@/components/layout/BrandHeader';
import PrimaryNav from '@/components/layout/PrimaryNav';
import { 
  Hexagon, 
  Search, 
  Filter, 
  Lightbulb, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Download, 
  ExternalLink 
} from 'lucide-react';

interface CatalogFixture {
  id: string;
  catalogCode: string;
  modelName: string;
  category: 'Recessed Troffer' | 'Downlight' | 'Linear Batten' | 'High Bay' | 'Cleanroom';
  powerWatts: number;
  lumenOutput: number;
  efficacyLmPerW: number;
  cctKelvin: number;
  cri: number;
  beamAngleDeg: number;
  dimensionsMm: string;
  ipRating: string;
  suFinRateINR: number;
  applications: string;
}

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handleDownloadIES = (fix: CatalogFixture) => {
    const iesData = `IESNA:LM-63-2002
[TEST] LUMOS-PHO-${fix.catalogCode}
[MANUFAC] Lumos Architectural Lighting
[LUMCAT] ${fix.catalogCode}
[LUMINAIRE] ${fix.modelName}
[LAMPCAT] High-Efficacy SMD LED
TILT=NONE
1 ${fix.lumenOutput} 1.0 11 1 1 2 0.6 0.6 0.08
1.0 1.0 ${fix.powerWatts}
0 10 20 30 40 50 60 70 80 90 100
0
${Math.round(fix.lumenOutput / 3.14)} ${Math.round(fix.lumenOutput / 3.25)} ${Math.round(fix.lumenOutput / 3.55)} ${Math.round(fix.lumenOutput / 4.1)} ${Math.round(fix.lumenOutput / 5.2)} ${Math.round(fix.lumenOutput / 7.5)} ${Math.round(fix.lumenOutput / 12.0)} 25 10 0 0
`;
    const blob = new Blob([iesData], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fix.catalogCode}.ies`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice(`Downloaded IES Photometric Profile: ${fix.catalogCode}.ies`);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const fixtures: CatalogFixture[] = [
    {
      id: 'FIX-600X600-LED-36W',
      catalogCode: 'LT-LED-TRF-6060-36W',
      modelName: 'AeroLite Pro 600x600 Recessed Troffer',
      category: 'Recessed Troffer',
      powerWatts: 36,
      lumenOutput: 4000,
      efficacyLmPerW: 111,
      cctKelvin: 4000,
      cri: 82,
      beamAngleDeg: 110,
      dimensionsMm: '595 × 595 × 38 mm',
      ipRating: 'IP20',
      suFinRateINR: 2450,
      applications: 'Open Workstations, Boardrooms, Executive Cabins'
    },
    {
      id: 'FIX-DOWNLIGHT-18W',
      catalogCode: 'LT-LED-DL-RD-18W',
      modelName: 'OptiSpot Circular Recessed Downlight',
      category: 'Downlight',
      powerWatts: 18,
      lumenOutput: 1800,
      efficacyLmPerW: 100,
      cctKelvin: 3000,
      cri: 85,
      beamAngleDeg: 60,
      dimensionsMm: '175 ⌀ × 65 mm',
      ipRating: 'IP44',
      suFinRateINR: 1150,
      applications: 'Corridors, Reception Lobbies, Restrooms'
    },
    {
      id: 'FIX-BATTEN-28W',
      catalogCode: 'LT-LED-BAT-1200-28W',
      modelName: 'LineaSlim 1200mm Surface Batten',
      category: 'Linear Batten',
      powerWatts: 28,
      lumenOutput: 3200,
      efficacyLmPerW: 114,
      cctKelvin: 6500,
      cri: 80,
      beamAngleDeg: 120,
      dimensionsMm: '1180 × 55 × 45 mm',
      ipRating: 'IP20',
      suFinRateINR: 850,
      applications: 'Utility Corridors, Server Ancillary Rooms'
    },
    {
      id: 'FIX-HIGHBAY-120W',
      catalogCode: 'LT-LED-HB-UFO-120W',
      modelName: 'TitanBay Industrial High-Bay Luminaire',
      category: 'High Bay',
      powerWatts: 120,
      lumenOutput: 16800,
      efficacyLmPerW: 140,
      cctKelvin: 5000,
      cri: 75,
      beamAngleDeg: 120,
      dimensionsMm: '340 ⌀ × 140 mm',
      ipRating: 'IP66',
      suFinRateINR: 6800,
      applications: 'High-Ceiling Warehouses, Heavy Fabrication Plants'
    },
    {
      id: 'FIX-CLEANROOM-45W',
      catalogCode: 'LT-LED-CR-SEALED-45W',
      modelName: 'PharmaClean IP65 Cleanroom Luminaire',
      category: 'Cleanroom',
      powerWatts: 45,
      lumenOutput: 5200,
      efficacyLmPerW: 115,
      cctKelvin: 4000,
      cri: 88,
      beamAngleDeg: 100,
      dimensionsMm: '1195 × 295 × 50 mm',
      ipRating: 'IP65',
      suFinRateINR: 4900,
      applications: 'R&D Innovation Labs, Pharmaceutical Cleanrooms'
    }
  ];

  const filtered = fixtures.filter(f => {
    const matchesSearch = f.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.catalogCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.applications.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F4]">
      {/* 1. Brand Header */}
      <BrandHeader />

      {/* 2. Primary Navigation */}
      <PrimaryNav activeTab="library" />

      {/* 3. Main Photometric Catalog */}
      <main className="flex-1 p-6 max-w-[1680px] mx-auto w-full flex flex-col space-y-5">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[20px] font-semibold text-[#202321] tracking-tight">
              Photometric Fixture & MEP Raceway Library
            </h1>
            <p className="text-[13px] text-[#62645F] mt-0.5">
              Verified IES photometric profiles, efficacy ratings, and L&T SuFin rate card catalog.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-[12px] text-[#8A8982]">
            <span>Active Library:</span>
            <span className="font-semibold text-[#087F73]">L&T EDRC Standard 2026</span>
          </div>
        </div>

        {/* Search & Category Filter Strip */}
        <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-[#8A8982] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by model, catalog code, or intended application..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-[#E7DED4] bg-[#FFFFFF] text-[13px] text-[#202321] placeholder-[#8A8982] focus:outline-none focus:border-[#087F73]"
            />
          </div>

          <div className="flex items-center space-x-1.5 text-[12px] overflow-x-auto">
            {['all', 'Recessed Troffer', 'Downlight', 'Linear Batten', 'High Bay', 'Cleanroom'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer font-medium ${
                  selectedCategory === cat
                    ? 'bg-[#087F73] text-white shadow-2xs'
                    : 'bg-[#FFFFFF] border border-[#E7DED4] text-[#62645F] hover:text-[#202321]'
                }`}
              >
                {cat === 'all' ? 'All Luminaires' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Download Feedback Banner */}
        {downloadNotice && (
          <div className="bg-[#E5F4E9] border border-[#087A4B]/30 rounded-xl p-3 flex items-center justify-between text-[12.5px] text-[#087A4B] animate-fade-in">
            <span className="font-semibold">{downloadNotice}</span>
            <span className="text-[11px] font-mono">Standard IES LM-63 Format</span>
          </div>
        )}

        {/* Fixtures Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((fix) => (
            <div
              key={fix.id}
              className="bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] p-5 shadow-2xs flex flex-col justify-between select-none"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10.5px] font-mono font-semibold text-[#087F73] uppercase tracking-wider block">
                      {fix.catalogCode}
                    </span>
                    <h3 className="text-[15px] font-semibold text-[#202321] tracking-tight mt-0.5">
                      {fix.modelName}
                    </h3>
                  </div>

                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#E5F4EF] text-[#087F73] border border-[#087F73]/20">
                    {fix.category}
                  </span>
                </div>

                {/* Polar Candela Curve Visual Diagram (SVG) */}
                <div className="my-3.5 h-28 bg-[#FFFFFF] border border-[#E7DED4] rounded-lg p-2 flex items-center justify-center relative overflow-hidden">
                  <svg viewBox="0 0 160 100" className="w-full h-full">
                    {/* Polar coordinate grid rings */}
                    <circle cx="80" cy="20" r="20" fill="none" stroke="#E7DED4" strokeWidth="1" strokeDasharray="2,2" />
                    <circle cx="80" cy="20" r="40" fill="none" stroke="#E7DED4" strokeWidth="1" strokeDasharray="2,2" />
                    <circle cx="80" cy="20" r="60" fill="none" stroke="#E7DED4" strokeWidth="1" strokeDasharray="2,2" />
                    <line x1="80" y1="20" x2="80" y2="85" stroke="#E7DED4" strokeWidth="1" />
                    <line x1="20" y1="20" x2="140" y2="20" stroke="#E7DED4" strokeWidth="1" />

                    {/* Polar candela distribution lobe */}
                    <path
                      d="M80 20 C60 55, 30 75, 45 85 C60 92, 75 90, 80 88 C85 90, 100 92, 115 85 C130 75, 100 55, 80 20 Z"
                      fill="rgba(8, 127, 115, 0.15)"
                      stroke="#087F73"
                      strokeWidth="1.8"
                    />

                    {/* Peak candela marker */}
                    <circle cx="80" cy="20" r="3" fill="#D97706" />
                  </svg>
                  <span className="absolute bottom-1 right-2 text-[9.5px] font-mono text-[#8A8982]">
                    {fix.beamAngleDeg}° Beam · {fix.lumenOutput} lm
                  </span>
                </div>

                {/* Technical Specifications Matrix */}
                <div className="grid grid-cols-3 gap-2 text-[11.5px] my-3">
                  <div className="bg-[#FFFFFF] border border-[#E7DED4] rounded-md p-1.5 text-center">
                    <span className="text-[#8A8982] block text-[10px]">Power</span>
                    <span className="font-bold text-[#202321]">{fix.powerWatts} W</span>
                  </div>

                  <div className="bg-[#FFFFFF] border border-[#E7DED4] rounded-md p-1.5 text-center">
                    <span className="text-[#8A8982] block text-[10px]">Efficacy</span>
                    <span className="font-bold text-[#087A4B]">{fix.efficacyLmPerW} lm/W</span>
                  </div>

                  <div className="bg-[#FFFFFF] border border-[#E7DED4] rounded-md p-1.5 text-center">
                    <span className="text-[#8A8982] block text-[10px]">CCT</span>
                    <span className="font-bold text-[#202321]">{fix.cctKelvin} K</span>
                  </div>
                </div>

                {/* Recommended Applications */}
                <p className="text-[11.5px] text-[#62645F] mt-2">
                  <span className="text-[#8A8982] font-medium">Recommended for: </span>
                  {fix.applications}
                </p>
              </div>

              {/* Card Footer: SuFin Unit Rate */}
              <div className="mt-4 pt-3 border-t border-[#E7DED4] flex items-center justify-between text-[12px]">
                <div>
                  <span className="text-[10px] text-[#8A8982] block">L&T SuFin Contract Rate</span>
                  <span className="font-bold text-[14px] text-[#087F73]">
                    ₹{fix.suFinRateINR.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-[#62645F]">/ unit</span>
                  </span>
                </div>

                <button 
                  onClick={() => handleDownloadIES(fix)}
                  className="h-7.5 px-3 rounded-lg border border-[#087F73] text-[#087F73] hover:bg-[#E5F4EF] font-medium text-[11.5px] flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <span>IES Profile</span>
                  <Download className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
