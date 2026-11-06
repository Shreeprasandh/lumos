'use client';

import React, { useState } from 'react';
import { User, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export default function BrandHeader() {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="relative w-full h-[58px] bg-[#FBF8F4] border-b border-[#E7DED4] px-6 sm:px-8 flex items-center justify-between select-none">
      {/* Left: Lumos Logo & Product Title */}
      <div className="flex items-center space-x-4">
        {/* Lumos Brand Identity */}
        <div className="flex items-center space-x-2.5">
          <div className="w-[30px] h-[30px] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Lumos"
              className="w-full h-full object-contain filter contrast-125"
            />
          </div>
          <span className="font-bold text-[18px] tracking-tight text-[#202321]">Lumos</span>
        </div>

        {/* Subtle Vertical Divider */}
        <div className="h-5 w-[1px] bg-[#D9CEC2]" />

        {/* Product Title */}
        <h1 className="text-[14px] font-normal text-[#202321] tracking-tight">
          Lighting Design & BOM Generator
        </h1>
      </div>

      {/* Right: Enterprise Context Indicators & User Avatar */}
      <div className="flex items-center space-x-5 text-[12.5px] text-[#62645F]">
        {/* Engineering Design Center Status */}
        <div className="flex items-center space-x-1.5 font-medium" title="Engineering Design & Research Centre">
          <span className="w-2 h-2 rounded-full bg-[#087A4B]" />
          <span className="text-[#202321]">EDRC Design</span>
        </div>

        {/* Buildings & Factories MEP Division */}
        <div className="hidden sm:flex items-center space-x-1.5 font-medium" title="Buildings & Factories MEP Division">
          <span className="w-2 h-2 rounded-full bg-[#087F73]" />
          <span className="text-[#202321]">B&F MEP</span>
        </div>

        {/* User Profile Outline Icon */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            title="Engineer Profile & System Telemetry"
            className="w-[32px] h-[32px] rounded-full border border-[#D9CEC2] hover:border-[#087F73] flex items-center justify-center text-[#62645F] transition-colors cursor-pointer bg-[#FFFCF8]"
          >
            <User className="w-4 h-4 text-[#62645F]" />
          </button>

          {/* User Popover */}
          {showProfile && (
            <div className="absolute right-0 top-10 w-72 bg-[#FFFCF8] border border-[#E7DED4] rounded-xl shadow-xl p-4 z-50 text-[12px] animate-fade-in">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E7DED4]">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-[#E5F4EF] text-[#087F73] flex items-center justify-center font-bold text-[12px]">
                    ME
                  </div>
                  <div>
                    <p className="font-semibold text-[#202321]">Lead MEP Design Engineer</p>
                    <p className="text-[10.5px] text-[#8A8982]">Project PID: TG0907615</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfile(false)}
                  className="w-5 h-5 rounded-full hover:bg-[#F5EFE8] flex items-center justify-center text-[#8A8982]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-3 space-y-2 text-[11.5px] text-[#62645F]">
                <div className="flex justify-between">
                  <span>License Tier:</span>
                  <span className="font-semibold text-[#087A4B]">Enterprise Platinum</span>
                </div>
                <div className="flex justify-between">
                  <span>Standards Engine:</span>
                  <span className="font-semibold text-[#202321]">IS 3646 / NBC 2016</span>
                </div>
                <div className="flex justify-between">
                  <span>Offline CAD Engine:</span>
                  <span className="font-semibold text-[#087A4B]">Active (Local Wasm)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
