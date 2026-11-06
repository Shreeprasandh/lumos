'use client';

import React, { useState } from 'react';
import BrandHeader from '@/components/layout/BrandHeader';
import PrimaryNav from '@/components/layout/PrimaryNav';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Layers, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ChevronRight, 
  Upload, 
  X,
  Calendar,
  MapPin,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

interface ProjectRecord {
  id: string;
  name: string;
  buildingType: string;
  location: string;
  grossAreaSqFt: number;
  floorsCount: number;
  status: 'Completed' | 'In Design' | 'Processing' | 'Draft';
  lastModified: string;
  totalLuminaires: number;
  totalCostINR: number;
  complianceRate: number;
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const projects: ProjectRecord[] = [
    {
      id: 'PRJ-LT-07615-L1',
      name: 'Tech Park – Floor L1',
      buildingType: 'Commercial IT Workspace',
      location: 'Bengaluru, Karnataka',
      grossAreaSqFt: 50000,
      floorsCount: 4,
      status: 'Completed',
      lastModified: '2026-11-04',
      totalLuminaires: 1248,
      totalCostINR: 4285600,
      complianceRate: 100
    },
    {
      id: 'PRJ-LT-07615-B2',
      name: 'Tech Park – Basement B2',
      buildingType: 'Utility & Parking Substation',
      location: 'Bengaluru, Karnataka',
      grossAreaSqFt: 38400,
      floorsCount: 2,
      status: 'In Design',
      lastModified: '2026-11-05',
      totalLuminaires: 860,
      totalCostINR: 3120000,
      complianceRate: 98
    },
    {
      id: 'PRJ-LT-07615-C4',
      name: 'Tech Park – Level C4',
      buildingType: 'Executive & Boardroom Suite',
      location: 'Bengaluru, Karnataka',
      grossAreaSqFt: 24000,
      floorsCount: 1,
      status: 'Processing',
      lastModified: '2026-11-02',
      totalLuminaires: 540,
      totalCostINR: 1980000,
      complianceRate: 100
    },
    {
      id: 'PRJ-LT-07615-T2',
      name: 'Airport Terminal T2 Pier',
      buildingType: 'High-Bay Concourse & Gates',
      location: 'Mumbai, Maharashtra',
      grossAreaSqFt: 120000,
      floorsCount: 3,
      status: 'In Design',
      lastModified: '2026-10-28',
      totalLuminaires: 2450,
      totalCostINR: 8940000,
      complianceRate: 96
    }
  ];

  const filtered = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.buildingType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || p.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F4]">
      {/* 1. Brand Header */}
      <BrandHeader />

      {/* 2. Primary Navigation */}
      <PrimaryNav activeTab="projects" />

      {/* 3. Main Projects Catalog */}
      <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full flex flex-col space-y-5">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-[20px] font-semibold text-[#202321] tracking-tight">
              Project Portfolio & Architectural Intake
            </h1>
            <p className="text-[13px] text-[#62645F] mt-0.5">
              Spatial layouts, multi-floor lighting takeoffs, and procurement schedules.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="h-9 px-4 rounded-lg bg-[#087F73] hover:bg-[#0B9B8A] text-white text-[13px] font-medium flex items-center space-x-2 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Import New Plan</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Strip */}
        <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-[#8A8982] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by project name, facility type, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-[#E7DED4] bg-[#FFFFFF] text-[13px] text-[#202321] placeholder-[#8A8982] focus:outline-none focus:border-[#087F73]"
            />
          </div>

          <div className="flex items-center space-x-2 text-[12.5px]">
            <span className="text-[#8A8982] font-medium flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
            </span>
            {['all', 'completed', 'in design', 'processing', 'draft'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                  filterStatus === st
                    ? 'bg-[#087F73] text-white font-medium'
                    : 'bg-[#FFFFFF] border border-[#E7DED4] text-[#62645F] hover:text-[#202321]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filtered.map((proj) => {
            const statusBadge = 
              proj.status === 'Completed' ? 'bg-[#E5F4E9] text-[#087A4B] border-[#087A4B]/20' :
              proj.status === 'In Design' ? 'bg-[#E0F2FE] text-[#0284C7] border-[#0284C7]/20' :
              proj.status === 'Processing' ? 'bg-[#FFF0D9] text-[#D97706] border-[#D97706]/20' :
              'bg-[#F5EFE8] text-[#62645F] border-[#E7DED4]';

            return (
              <div
                key={proj.id}
                className="bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] p-5 shadow-2xs hover:border-[#087F73]/50 transition-all flex flex-col justify-between select-none"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl border border-[#E7DED4] bg-[#FFFFFF] flex items-center justify-center text-[#087F73] shrink-0 shadow-2xs">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-semibold text-[#202321] tracking-tight">
                          {proj.name}
                        </h3>
                        <p className="text-[12px] text-[#62645F] flex items-center space-x-1.5 mt-0.5">
                          <span>{proj.buildingType}</span>
                          <span className="text-[#D9CEC2]">·</span>
                          <span className="flex items-center space-x-0.5 text-[#8A8982]">
                            <MapPin className="w-3 h-3" />
                            <span>{proj.location}</span>
                          </span>
                        </p>
                      </div>
                    </div>

                    <span className={`text-[11.5px] font-medium px-2.5 py-0.5 rounded-full border ${statusBadge}`}>
                      {proj.status}
                    </span>
                  </div>

                  {/* Quantitative Metrics Matrix */}
                  <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-[#E7DED4] text-[12px]">
                    <div className="bg-[#FFFFFF] border border-[#E7DED4] rounded-lg p-2.5">
                      <span className="text-[#8A8982] text-[11px] block">Gross Area</span>
                      <span className="font-semibold text-[#202321] text-[13px]">
                        {proj.grossAreaSqFt.toLocaleString()} sq.ft
                      </span>
                    </div>

                    <div className="bg-[#FFFFFF] border border-[#E7DED4] rounded-lg p-2.5">
                      <span className="text-[#8A8982] text-[11px] block">Luminaires</span>
                      <span className="font-semibold text-[#202321] text-[13px]">
                        {proj.totalLuminaires.toLocaleString()} Nos
                      </span>
                    </div>

                    <div className="bg-[#FFFFFF] border border-[#E7DED4] rounded-lg p-2.5">
                      <span className="text-[#8A8982] text-[11px] block">BOQ Value</span>
                      <span className="font-semibold text-[#087F73] text-[13px]">
                        ₹{(proj.totalCostINR / 100000).toFixed(2)} Lakhs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-[#E7DED4] flex items-center justify-between text-[12px]">
                  <span className="text-[#8A8982] flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Updated {proj.lastModified}</span>
                  </span>

                  <Link
                    href={`/?project=${proj.id}`}
                    className="h-8 px-3.5 rounded-lg border border-[#087F73] text-[#087F73] hover:bg-[#E5F4EF] font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <span>Open in Workspace</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* CAD Import Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-6 animate-fade-in">
          <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DED4]">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-[#087F73]" />
                <h3 className="text-[16px] font-semibold text-[#202321]">
                  Import Architectural Drawing
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E7DED4] flex items-center justify-center text-[#62645F] hover:text-[#202321] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <label className="block my-5 border-2 border-dashed border-[#D9CEC2] rounded-xl p-6 text-center bg-[#FFFFFF] hover:border-[#087F73] transition-colors cursor-pointer">
              <input
                type="file"
                accept=".dwg,.dxf,.pdf,.ifc"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setShowUploadModal(false);
                    window.location.href = `/?project=PRJ-LT-07615-L1`;
                  }
                }}
              />
              <FileText className="w-10 h-10 text-[#087F73] mx-auto mb-2 opacity-80" />
              <p className="text-[14px] font-semibold text-[#202321]">
                Drop AutoCAD (.DXF, .DWG) or IFC/PDF blueprint
              </p>
              <p className="text-[11.5px] text-[#8A8982] mt-1">
                Lumos extracts room cavity ratios, task planes, and wall geometries automatically
              </p>
              <span className="inline-block mt-3 px-3 py-1 rounded-md bg-[#E5F4EF] text-[#087F73] text-[11.5px] font-medium border border-[#087F73]/20">
                Browse Local CAD Files
              </span>
            </label>

            <div className="pt-3 border-t border-[#E7DED4] flex items-center justify-between">
              <span className="text-[11.5px] text-[#8A8982]">
                Supports AutoCAD 2018–2026 DWG / DXF & IFC 4.3
              </span>
              <button
                onClick={() => setShowUploadModal(false)}
                className="h-8.5 px-4 rounded-lg bg-[#087F73] text-white text-[12px] font-semibold shadow-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
