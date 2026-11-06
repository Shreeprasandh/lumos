'use client';

import React from 'react';
import { 
  Layers, 
  Upload, 
  LayoutGrid, 
  Lightbulb, 
  GitFork, 
  FileText 
} from 'lucide-react';

interface PipelineStripProps {
  currentStage: number;
  onSelectStage: (stage: number) => void;
}

export default function PipelineStrip({
  currentStage,
  onSelectStage
}: PipelineStripProps) {
  const stages = [
    {
      num: 1,
      title: 'Import Layout',
      sub: 'DXF / DWG / PDF',
      icon: Upload
    },
    {
      num: 2,
      title: 'Spatial Analysis',
      sub: 'Rooms · RCR · Classify',
      icon: LayoutGrid
    },
    {
      num: 3,
      title: 'Lighting Design',
      sub: 'Lux · Grid · Fixtures',
      icon: Lightbulb
    },
    {
      num: 4,
      title: 'Electrical Routing',
      sub: 'Conduit · Cable · Load',
      icon: GitFork
    },
    {
      num: 5,
      title: 'BOM / BOQ',
      sub: 'Quantities · Cost',
      icon: FileText
    }
  ];

  return (
    <div className="w-full bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] p-6 shadow-2xs select-none flex flex-col md:flex-row items-center">
      {/* Left Block (~22% width) */}
      <div className="w-full md:w-[22%] pr-6 flex items-start space-x-3.5 mb-4 md:mb-0">
        <div className="w-[34px] h-[34px] rounded-lg border border-[#0B9B8A]/30 flex items-center justify-center text-[#087F73] shrink-0 bg-[#FFFCF8]">
          <Layers className="w-5 h-5 text-[#087F73]" />
        </div>
        <div>
          <h2 className="text-[14.5px] font-semibold text-[#202321] tracking-tight">
            Design Pipeline
          </h2>
          <p className="text-[12px] text-[#62645F] mt-1 leading-snug">
            End-to-end automated workflow from layout to procurement.
          </p>
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="hidden md:block h-16 w-[1px] bg-[#E7DED4] mr-8" />

      {/* Right Block: 5 Connected Horizontal Stepper Nodes */}
      <div className="w-full md:flex-1 relative flex items-center justify-between">
        {/* Background Connecting Line passing through centers of circles */}
        <div className="absolute top-[18px] left-[20px] right-[20px] h-[1.5px] bg-[#E7DED4] -z-0" />

        {stages.map((stage) => {
          const Icon = stage.icon;
          const isActive = currentStage === stage.num;

          return (
            <div
              key={stage.num}
              onClick={() => onSelectStage(stage.num)}
              className="relative z-10 flex flex-col items-center text-center cursor-pointer group px-2"
            >
              {/* Circular Icon Container matching L&T.png */}
              <div
                className={`w-[36px] h-[36px] rounded-full flex items-center justify-center transition-all bg-[#FFFCF8] ${
                  isActive
                    ? 'border-2 border-[#087F73] text-[#087F73] shadow-xs'
                    : 'border border-[#D9CEC2] text-[#202321] group-hover:border-[#087F73]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#087F73]' : 'text-[#202321]'}`} />
              </div>

              {/* Stage Title */}
              <h3 className="text-[13px] font-semibold text-[#202321] mt-2.5 leading-tight">
                {stage.title}
              </h3>

              {/* Stage Subtitle */}
              <p className="text-[11px] text-[#62645F] mt-0.5">
                {stage.sub}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
