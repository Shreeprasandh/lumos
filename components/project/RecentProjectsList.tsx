'use client';

import React from 'react';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { RECENT_PROJECTS_LIST } from '@/engine/sampleData';

interface RecentProjectsListProps {
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  onViewAll?: () => void;
}

export default function RecentProjectsList({
  selectedProjectId,
  onSelectProject,
  onViewAll
}: RecentProjectsListProps) {
  return (
    <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] p-5 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[14.5px] font-semibold text-[#202321] tracking-tight">Recent Projects</h2>
        <Link
          href="/projects"
          className="text-[12px] font-medium text-[#62645F] hover:text-[#087F73] transition-colors cursor-pointer"
        >
          View All
        </Link>
      </div>

      {/* Projects List */}
      <div className="space-y-2">
        {RECENT_PROJECTS_LIST.map((proj) => {
          const isSelected = selectedProjectId === proj.id;
          const statusBadge =
            proj.status === 'Completed'
              ? 'text-[#087A4B] bg-[#E5F4E9]'
              : proj.status === 'Processing'
              ? 'text-[#D97706] bg-[#FFF0D9]'
              : 'text-[#62645F] bg-[#F5EFE8]';

          return (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj.id)}
              className={`flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#E5F4EF]/40 border-[#087F73]/30 shadow-xs'
                  : 'border-transparent hover:bg-[#F5EFE8]/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-[32px] h-[32px] rounded-lg border flex items-center justify-center shrink-0 ${
                  isSelected ? 'border-[#087F73]/40 bg-[#FFFFFF] text-[#087F73]' : 'border-[#E7DED4] bg-[#FFFCF8] text-[#62645F]'
                }`}>
                  <Building2 className={`w-4 h-4 ${isSelected ? 'text-[#087F73]' : 'text-[#8A8982]'}`} />
                </div>
                <div>
                  <p className={`text-[13px] font-semibold leading-snug ${isSelected ? 'text-[#087F73]' : 'text-[#202321]'}`}>
                    {proj.name}
                  </p>
                  <p className="text-[11px] text-[#8A8982]">
                    {proj.areaSqFt.toLocaleString()} sq.ft · {proj.fixtures} Troffers
                  </p>
                </div>
              </div>

              {/* Status Pill */}
              <span className={`text-[10.5px] font-medium px-2 py-0.5 rounded-full ${statusBadge}`}>
                {proj.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
