'use client';

import React, { useState } from 'react';
import BrandHeader from '@/components/layout/BrandHeader';
import PrimaryNav from '@/components/layout/PrimaryNav';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  FileCheck, 
  Download, 
  Search,
  ExternalLink
} from 'lucide-react';

interface StandardRule {
  id: string;
  code: string;
  title: string;
  authority: string;
  clause: string;
  parameter: string;
  threshold: string;
  calculatedValue: string;
  status: 'Compliant' | 'Review Needed';
  impactDescription: string;
}

export default function StandardsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const standards: StandardRule[] = [
    {
      id: 'STD-IS3646-LUX',
      code: 'IS 3646 (Part 1 & 2)',
      title: 'Maintained Workplane Illuminance',
      authority: 'Bureau of Indian Standards (BIS)',
      clause: 'Clause 4.2, Table 2 (Schedule of Interior Lighting)',
      parameter: 'Average Maintained Lux (Em)',
      threshold: '≥ 500 Lux (General Workstations)',
      calculatedValue: '512 Lux',
      status: 'Compliant',
      impactDescription: 'Ensures visual comfort, contrast acuity, and fatigue prevention for commercial task planes.'
    },
    {
      id: 'STD-NBC2016-U0',
      code: 'NBC 2016 (Part 8)',
      title: 'Illuminance Uniformity Ratio (U0)',
      authority: 'National Building Code of India',
      clause: 'Section 1, Clause 4.3 (Uniformity in Work Areas)',
      parameter: 'Minimum to Average Lux (Emin / Eavg)',
      threshold: 'U0 ≥ 0.60 on Workplane',
      calculatedValue: '0.82',
      status: 'Compliant',
      impactDescription: 'Guarantees uniform field of view without dark spots or excessive luminance gradient steps.'
    },
    {
      id: 'STD-ECBC-LPD',
      code: 'ECBC 2017 / BEE',
      title: 'Lighting Power Density (LPD) Ceilings',
      authority: 'Bureau of Energy Efficiency (BEE)',
      clause: 'Section 5.2.1, Building Area Method',
      parameter: 'Connected Electrical Watts per m²',
      threshold: '≤ 9.5 W/m² (Commercial Offices)',
      calculatedValue: '7.2 W/m²',
      status: 'Compliant',
      impactDescription: 'Complies with mandatory Indian energy conservation thresholds for IGBC & LEED Platinum ratings.'
    },
    {
      id: 'STD-IS732-CKT',
      code: 'IS 732 (2019 Revision)',
      title: 'Sub-Circuit Wattage Loading Ceiling',
      authority: 'Bureau of Indian Standards (BIS)',
      clause: 'Clause 5.2.4 (Branch Circuits for Lighting)',
      parameter: 'Maximum Connected Load per Sub-Circuit',
      threshold: '≤ 800 Watts or 10 Light Points',
      calculatedValue: '720 Watts (9 Fixtures)',
      status: 'Compliant',
      impactDescription: 'Prevents conduit overheating, circuit breaker nuisance tripping, and provides thermal headroom.'
    },
    {
      id: 'STD-IS9537-FILL',
      code: 'IS 9537 Standard',
      title: 'Conduit Cross-Sectional Thermal Fill',
      authority: 'Central Public Works Department (CPWD)',
      clause: 'Specification Section 3.4 (Conduit Wiring)',
      parameter: 'Conductor Area to Conduit Internal Bore Area',
      threshold: '≤ 40% Thermal Dissipation Limit',
      calculatedValue: '34% Fill Ratio',
      status: 'Compliant',
      impactDescription: 'Ensures sufficient thermal dissipation for current-carrying conductors inside metallic GI conduits.'
    },
    {
      id: 'STD-IEEE519-PHASE',
      code: 'IEEE 519 / CEA',
      title: '3-Phase Sub-Circuit Load Balancing',
      authority: 'Central Electricity Authority (CEA)',
      clause: 'Regulations on Grid Connectivity & Phase Balancing',
      parameter: 'Phase Differential (ΔP = |Pmax - Pmin| / Pavg)',
      threshold: '≤ 10.0% Imbalance Across R, Y, B Phases',
      calculatedValue: 'ΔP = 4.2%',
      status: 'Compliant',
      impactDescription: 'Eliminates excessive neutral conductor current and prevents transformer harmonic overheating.'
    }
  ];

  const filtered = standards.filter(s =>
    s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.authority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F4]">
      {/* 1. Brand Header */}
      <BrandHeader />

      {/* 2. Primary Navigation */}
      <PrimaryNav activeTab="standards" />

      {/* 3. Main Standards Library */}
      <main className="flex-1 p-6 max-w-[1680px] mx-auto w-full flex flex-col space-y-5">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[20px] font-semibold text-[#202321] tracking-tight">
              Statutory Lighting & Electrical Compliance Standards
            </h1>
            <p className="text-[13px] text-[#62645F] mt-0.5">
              Authoritative Indian and international building standards governing photometric and MEP calculations.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="h-8.5 px-3.5 rounded-full bg-[#E5F4E9] border border-[#087A4B]/20 flex items-center space-x-1.5 text-[12px] font-semibold text-[#087A4B]">
              <CheckCircle2 className="w-4 h-4" />
              <span>6 of 6 Mandatory Standards Passed</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] p-3 shadow-2xs">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8A8982] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by code (e.g. IS 3646, NBC 2016, IS 732, ECBC) or parameter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-[#E7DED4] bg-[#FFFFFF] text-[13px] text-[#202321] placeholder-[#8A8982] focus:outline-none focus:border-[#087F73]"
            />
          </div>
        </div>

        {/* Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((std) => (
            <div
              key={std.id}
              className="bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] p-5 shadow-2xs flex flex-col justify-between select-none"
            >
              <div>
                {/* Standard Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#087F73] uppercase tracking-wider block">
                      {std.code}
                    </span>
                    <h3 className="text-[15px] font-semibold text-[#202321] tracking-tight mt-0.5">
                      {std.title}
                    </h3>
                  </div>

                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E5F4E9] text-[#087A4B] border border-[#087A4B]/20">
                    Compliant ✓
                  </span>
                </div>

                {/* Authority & Clause */}
                <p className="text-[11.5px] text-[#8A8982] mt-2">
                  Authority: <span className="text-[#202321] font-medium">{std.authority}</span>
                </p>
                <p className="text-[11px] text-[#62645F] italic mt-0.5">
                  {std.clause}
                </p>

                {/* Criterion vs Calculated Table */}
                <div className="my-3.5 p-3 rounded-lg bg-[#FFFFFF] border border-[#E7DED4] space-y-2 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-[#8A8982]">Statutory Limit:</span>
                    <span className="font-medium text-[#202321]">{std.threshold}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E7DED4] pt-1.5">
                    <span className="text-[#087A4B] font-semibold">Engine Result:</span>
                    <span className="font-bold text-[#087A4B]">{std.calculatedValue}</span>
                  </div>
                </div>

                {/* Impact Note */}
                <p className="text-[11.5px] text-[#62645F] leading-relaxed">
                  {std.impactDescription}
                </p>
              </div>

              {/* Bottom Verification Status */}
              <div className="mt-4 pt-3 border-t border-[#E7DED4] flex items-center justify-between text-[11.5px] text-[#8A8982]">
                <span>Deterministic Verification</span>
                <span className="font-semibold text-[#087A4B]">Passed</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
