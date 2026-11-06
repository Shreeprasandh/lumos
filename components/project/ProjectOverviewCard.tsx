'use client';

import React from 'react';
import { Building2, Plus, ChevronRight } from 'lucide-react';

interface ProjectOverviewCardProps {
  onNewProject: () => void;
}

export default function ProjectOverviewCard({ onNewProject }: ProjectOverviewCardProps) {
  return (
    <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] p-5 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-[34px] h-[34px] rounded-lg border border-[#0B9B8A]/30 flex items-center justify-center text-[#087F73] shrink-0 bg-[#FFFCF8]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[14.5px] font-semibold text-[#202321] tracking-tight">Project Overview</h2>
            <p className="text-[12px] text-[#62645F] mt-0.5">Spatial Analysis to BOM Generator</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#8A8982] mt-1" />
      </div>

      {/* Explanatory Copy */}
      <p className="mt-3.5 text-[12.5px] text-[#62645F] leading-relaxed">
        Automated lighting design, electrical routing and procurement-ready BOQ generation.
      </p>

      {/* Action Button */}
      <div className="mt-5">
        <button
          onClick={onNewProject}
          className="w-full h-[38px] rounded-lg border border-[#087F73] text-[#087F73] hover:bg-[#E5F4EF]/50 font-medium text-[13px] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer bg-[#FFFCF8]"
        >
          <Plus className="w-4 h-4 text-[#087F73]" />
          <span>New Project</span>
        </button>
      </div>
    </div>
  );
}
