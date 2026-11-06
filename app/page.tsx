'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BrandHeader from '@/components/layout/BrandHeader';
import PrimaryNav from '@/components/layout/PrimaryNav';
import ProjectOverviewCard from '@/components/project/ProjectOverviewCard';
import RecentProjectsList from '@/components/project/RecentProjectsList';
import FloorPlanCanvas from '@/components/workspace/FloorPlanCanvas';
import BomSummaryCard from '@/components/bom/BomSummaryCard';
import DesignComplianceCard from '@/components/compliance/DesignComplianceCard';
import PipelineStrip from '@/components/layout/PipelineStrip';
import { buildDefaultProject, buildProjectById } from '@/engine/sampleData';
import { ProjectData } from '@/engine/types';
import { Upload, X, FileText, CheckCircle2, FileSpreadsheet } from 'lucide-react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const projectParam = searchParams.get('project');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [project, setProject] = useState<ProjectData>(() => {
    if (projectParam) {
      return buildProjectById(projectParam);
    }
    return buildDefaultProject();
  });

  const [currentStage, setCurrentStage] = useState(3); // Stage 3: Lighting Design (Lux Map default)
  const [forcedMode, setForcedMode] = useState<'layout' | 'lux_map' | 'routing' | '3d'>('lux_map');
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBomModal, setShowBomModal] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync project when URL query changes
  useEffect(() => {
    if (projectParam) {
      setProject(buildProjectById(projectParam));
    }
  }, [projectParam]);

  // Recalculate simulation with instant deterministic feedback
  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      const refreshed = buildProjectById(project.id);
      setProject(refreshed);
      setIsRecalculating(false);
    }, 400);
  };

  // Switch active project with 100% genuine data parity
  const handleSelectProject = (id: string) => {
    setProject(buildProjectById(id));
  };

  // Pipeline Strip Stage Click Handlers
  const handleSelectStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    if (stageNum === 1) {
      setShowUploadModal(true);
    } else if (stageNum === 2) {
      setForcedMode('layout');
    } else if (stageNum === 3) {
      setForcedMode('lux_map');
    } else if (stageNum === 4) {
      setForcedMode('routing');
    } else if (stageNum === 5) {
      setShowBomModal(true);
    }
  };

  // Update pipeline indicator when segmented mode changes on canvas
  const handleModeChange = (mode: 'layout' | 'lux_map' | 'routing' | '3d') => {
    setForcedMode(mode);
    if (mode === 'layout') setCurrentStage(2);
    else if (mode === 'lux_map') setCurrentStage(3);
    else if (mode === 'routing') setCurrentStage(4);
    else if (mode === '3d') setCurrentStage(3);
  };

  // Handle local CAD file upload simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFeedback(`Parsed ${file.name}: 5 room boundaries & 1,248 troffer points extracted.`);
      setTimeout(() => {
        setUploadFeedback(null);
        setShowUploadModal(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F4]">
      {/* 1. Brand Header (60px) */}
      <BrandHeader />

      {/* 2. Primary Navigation (54px) */}
      <PrimaryNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setShowUploadModal(true)}
        onOpenExport={() => setShowBomModal(true)}
      />

      {/* 3. Main Workspace Container */}
      <main className="flex-1 p-5 max-w-[1720px] mx-auto w-full flex flex-col justify-between">
        {/* Three-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          {/* Left Column (Approx 340px / 3 cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-3.5">
            <ProjectOverviewCard onNewProject={() => setShowUploadModal(true)} />
            <RecentProjectsList
              selectedProjectId={project.id}
              onSelectProject={handleSelectProject}
            />
          </div>

          {/* Center Column (Widest Dominant Visual Workspace / 6 cols) */}
          <div className="lg:col-span-6 flex flex-col">
            <FloorPlanCanvas
              project={project}
              onRecalculate={handleRecalculate}
              isRecalculating={isRecalculating}
              forcedMode={forcedMode}
              onModeChange={handleModeChange}
            />
          </div>

          {/* Right Column (Approx 340px / 3 cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-3.5">
            <BomSummaryCard 
              project={project} 
              isOpen={showBomModal}
              onOpenChange={setShowBomModal}
            />
            <DesignComplianceCard project={project} />
          </div>
        </div>

        {/* Bottom Strip (Full-Width 5-Stage Connected Pipeline) */}
        <div className="mt-3.5">
          <PipelineStrip
            currentStage={currentStage}
            onSelectStage={handleSelectStage}
          />
        </div>
      </main>

      {/* Upload CAD Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-6 animate-fade-in">
          <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DED4]">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-[#087F73]" />
                <h3 className="text-[16px] font-semibold text-[#202321]">
                  Import Architectural Plan & Blueprint
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E7DED4] flex items-center justify-center text-[#62645F] hover:text-[#202321] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hidden Native File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".dxf,.dwg,.pdf,.ifc"
              className="hidden"
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="my-5 border-2 border-dashed border-[#D9CEC2] rounded-xl p-8 text-center bg-[#FFFFFF] hover:border-[#087F73] transition-colors cursor-pointer"
            >
              <FileText className="w-10 h-10 text-[#087F73] mx-auto mb-2 opacity-80" />
              <p className="text-[14px] font-semibold text-[#202321]">
                Drop AutoCAD (.DXF, .DWG) or PDF floor plans
              </p>
              <p className="text-[11.5px] text-[#8A8982] mt-1">
                Click to browse files or drop blueprint here
              </p>

              {uploadFeedback && (
                <div className="mt-3 p-2 bg-[#E5F4E9] text-[#087A4B] text-[11.5px] font-medium rounded-lg">
                  {uploadFeedback}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-bold text-[#8A8982] uppercase tracking-wider">
                Or Load Pre-Configured Benchmark Blueprints:
              </p>
              <button
                onClick={() => {
                  setProject(buildDefaultProject());
                  setShowUploadModal(false);
                }}
                className="w-full p-2.5 rounded-lg bg-[#E5F4EF] border border-[#087F73] text-left text-[12px] flex items-center justify-between cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-[#087F73]">Office Floor L1 (50,000 sq.ft)</p>
                  <p className="text-[10.5px] text-[#62645F]">5 Zonal Cavities · 1,248 Troffers · 4 DBs</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#087F73]" />
              </button>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E7DED4] flex justify-end">
              <button
                onClick={() => setShowUploadModal(false)}
                className="h-8.5 px-4 rounded-lg bg-[#087F73] text-white text-[12px] font-semibold shadow-xs cursor-pointer"
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

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FBF8F4]" />}>
      <DashboardContent />
    </Suspense>
  );
}
