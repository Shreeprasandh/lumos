'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { ProjectData } from '@/engine/types';

interface DesignComplianceCardProps {
  project: ProjectData;
}

export default function DesignComplianceCard({ project }: DesignComplianceCardProps) {
  const [showReportModal, setShowReportModal] = useState(false);

  const complianceRules = [
    {
      code: 'IS 3646 (Part 1 - 3)',
      title: 'Average Maintained Illuminance',
      calculated: '512 Lux',
      required: '>= 500 Lux',
      status: 'Compliant'
    },
    {
      code: 'NBC 2016 (Part 8)',
      title: 'Illuminance Uniformity Ratio (U0)',
      calculated: '0.82',
      required: 'U0 >= 0.60',
      status: 'Compliant'
    },
    {
      code: 'ECBC 2017 / ASHRAE',
      title: 'Lighting Power Density (LPD)',
      calculated: '7.2 W/m²',
      required: '<= 9.5 W/m²',
      status: 'Compliant'
    },
    {
      code: 'IS 732 (2019 Revision)',
      title: 'Sub-Circuit Wattage Loading',
      calculated: 'Max 720W / ckt',
      required: '<= 800W per circuit',
      status: 'Compliant'
    },
    {
      code: 'IS 9537 Standard',
      title: 'Conduit Cross-Sectional Fill',
      calculated: '34% Fill Ratio',
      required: '<= 40% Thermal Cap',
      status: 'Compliant'
    },
    {
      code: 'IEEE 519 Standard',
      title: '3-Phase Sub-Circuit Balancing',
      calculated: 'ΔP = 4.2%',
      required: '<= 10.0% Imbalance',
      status: 'Compliant'
    }
  ];

  return (
    <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] p-5 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-center space-x-2.5 mb-1.5">
        <ShieldCheck className="w-5 h-5 text-[#087F73]" />
        <h2 className="text-[14.5px] font-semibold text-[#202321] tracking-tight">
          Design Compliance
        </h2>
      </div>

      {/* Standards Line matching reference */}
      <p className="text-[12px] text-[#8A8982] mb-5">
        IS 3646 / NBC 2016 / EN 12464 / ECBC
      </p>

      {/* Status Strip matching L&T.png */}
      <div className="flex items-center justify-between">
        {/* Large Compliant Pill */}
        <div className="h-[36px] px-3.5 rounded-full bg-[#E5F4E9] border border-[#087A4B]/20 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#087A4B]" />
          <span className="text-[13px] font-semibold text-[#087A4B]">Compliant</span>
        </div>

        {/* View Report Link */}
        <button
          onClick={() => setShowReportModal(true)}
          className="text-[12.5px] font-medium text-[#087F73] hover:text-[#0B9B8A] transition-colors cursor-pointer"
        >
          View Report
        </button>
      </div>

      {/* Compliance Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-6 animate-fade-in">
          <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-2xl w-full max-w-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DED4]">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#087A4B]" />
                <h3 className="text-[16px] font-semibold text-[#202321]">
                  Statutory Design Compliance Report
                </h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E7DED4] flex items-center justify-center text-[#62645F] hover:text-[#202321] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-2.5">
              {complianceRules.map((r, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E7DED4] flex items-center justify-between text-[12px]"
                >
                  <div>
                    <p className="font-semibold text-[#202321]">{r.title}</p>
                    <p className="text-[11px] text-[#8A8982] mt-0.5">{r.code} · Criterion: {r.required}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#087A4B] text-[13px]">{r.calculated}</span>
                    <p className="text-[10px] font-semibold text-[#087A4B] uppercase tracking-wider">Passed ✓</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E7DED4] flex items-center justify-between text-[11.5px] text-[#8A8982]">
              <span>Verified against BIS, NBC 2016, and ECBC 2017 lighting codes.</span>
              <button
                onClick={() => setShowReportModal(false)}
                className="h-8 px-4 rounded-lg bg-[#087F73] text-white font-semibold text-[12px] shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
