'use client';

import React, { useState } from 'react';
import BrandHeader from '@/components/layout/BrandHeader';
import PrimaryNav from '@/components/layout/PrimaryNav';
import { buildDefaultProject } from '@/engine/sampleData';
import { exportToSuFinCSV, exportToSapMMXML } from '@/engine/bom';
import { 
  Layers, 
  Download, 
  FileCode2, 
  Search, 
  Filter, 
  CheckCircle2, 
  IndianRupee,
  Package,
  Wrench,
  Percent
} from 'lucide-react';

export default function BomPage() {
  const [project] = useState(() => buildDefaultProject());
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Financial Computations
  const totalMaterial = project.bomItems
    .filter(i => i.tier !== 6)
    .reduce((sum, i) => sum + i.totalAmountINR, 0);

  const totalLabor = project.bomItems
    .filter(i => i.tier === 6)
    .reduce((sum, i) => sum + i.totalAmountINR, 0);

  const subTotal = totalMaterial + totalLabor;
  const gstAmount = Math.round(subTotal * 0.18);
  const grandTotal = subTotal + gstAmount;

  // Filtering
  const filteredItems = project.bomItems.filter(item => {
    const matchesTier = selectedTier === 'all' || item.tier === selectedTier;
    const matchesSearch = item.itemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.catalogCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.hsnCode.includes(searchTerm);
    return matchesTier && matchesSearch;
  });

  const handleDownloadCSV = () => {
    const csvContent = exportToSuFinCSV(project.bomItems, project.name);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${project.code}_SuFin_BOQ.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice('SuFin CSV Downloaded Successfully');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const handleDownloadSAP = () => {
    const xmlContent = exportToSapMMXML(project.bomItems, project.code);
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${project.code}_SAP_MM.xml`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice('SAP Material Master XML Downloaded Successfully');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F4]">
      {/* 1. Brand Header */}
      <BrandHeader />

      {/* 2. Primary Navigation */}
      <PrimaryNav activeTab="bom" />

      {/* 3. Main BOM / BOQ Workspace */}
      <main className="flex-1 p-6 max-w-[1680px] mx-auto w-full flex flex-col space-y-5">
        {/* Top Header & Export Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[20px] font-semibold text-[#202321] tracking-tight">
              6-Tier Bill of Quantities (BOM / BOQ) & Procurement Takeoff
            </h1>
            <p className="text-[13px] text-[#62645F] mt-0.5">
              Project: {project.name} ({project.code}) · Verified against CPWD & L&T SuFin rate cards.
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleDownloadCSV}
              className="h-9 px-4 rounded-lg bg-[#087F73] hover:bg-[#0B9B8A] text-white text-[12.5px] font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export L&T SuFin (CSV)</span>
            </button>

            <button
              onClick={handleDownloadSAP}
              className="h-9 px-4 rounded-lg bg-[#FFFCF8] border border-[#087F73] text-[#087F73] hover:bg-[#E5F4EF] text-[12.5px] font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <FileCode2 className="w-4 h-4" />
              <span>Export SAP MM (XML)</span>
            </button>
          </div>
        </div>

        {/* 4 Quantitative KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[#8A8982] text-[12px] mb-1">
              <span>Materials (Tiers 1–5)</span>
              <Package className="w-4 h-4 text-[#087F73]" />
            </div>
            <p className="text-[18px] font-bold text-[#202321]">
              ₹{totalMaterial.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-[#62645F] mt-0.5">14 Catalog Line Items</p>
          </div>

          <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[#8A8982] text-[12px] mb-1">
              <span>Installation & Labor (Tier 6)</span>
              <Wrench className="w-4 h-4 text-[#0B9B8A]" />
            </div>
            <p className="text-[18px] font-bold text-[#202321]">
              ₹{totalLabor.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-[#62645F] mt-0.5">Certified Electrician Mandays</p>
          </div>

          <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[#8A8982] text-[12px] mb-1">
              <span>Applicable GST (18%)</span>
              <Percent className="w-4 h-4 text-[#D97706]" />
            </div>
            <p className="text-[18px] font-bold text-[#D97706]">
              ₹{gstAmount.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-[#62645F] mt-0.5">Standard Indian MEP Tax</p>
          </div>

          <div className="bg-[#FFFCF8] border border-[#087F73]/40 rounded-[13px] p-4 shadow-2xs bg-[#E5F4EF]/30">
            <div className="flex items-center justify-between text-[#087F73] text-[12px] mb-1 font-semibold">
              <span>Grand Tender Total</span>
              <IndianRupee className="w-4 h-4 text-[#087F73]" />
            </div>
            <p className="text-[19px] font-extrabold text-[#087F73]">
              ₹{grandTotal.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-[#087A4B] mt-0.5 font-medium">Pre-Tender Estimate Finalized</p>
          </div>
        </div>

        {/* Filter & Tier Navigation Strip */}
        <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-[#8A8982] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by catalog code, description, or HSN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-[#E7DED4] bg-[#FFFFFF] text-[13px] text-[#202321] placeholder-[#8A8982] focus:outline-none focus:border-[#087F73]"
            />
          </div>

          <div className="flex items-center space-x-1.5 text-[12px] overflow-x-auto">
            {[
              { val: 'all', label: 'All Tiers' },
              { val: 1, label: 'T1: Luminaires' },
              { val: 2, label: 'T2: Drivers' },
              { val: 3, label: 'T3: Conduits' },
              { val: 4, label: 'T4: Wiring' },
              { val: 5, label: 'T5: Switchgear' },
              { val: 6, label: 'T6: Labor' }
            ].map((t) => (
              <button
                key={String(t.val)}
                onClick={() => setSelectedTier(t.val as any)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer font-medium ${
                  selectedTier === t.val
                    ? 'bg-[#087F73] text-white shadow-2xs'
                    : 'bg-[#FFFFFF] border border-[#E7DED4] text-[#62645F] hover:text-[#202321]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed 6-Tier Itemized Schedule Table */}
        <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px] border-collapse">
              <thead>
                <tr className="bg-[#E5F4EF] text-[#087F73] border-b border-[#0B9B8A]/30">
                  <th className="py-3 px-4 font-semibold">Tier</th>
                  <th className="py-3 px-4 font-semibold">Catalog Code</th>
                  <th className="py-3 px-4 font-semibold">Item Specification</th>
                  <th className="py-3 px-4 font-semibold">HSN Code</th>
                  <th className="py-3 px-4 font-semibold text-right">Takeoff Qty</th>
                  <th className="py-3 px-4 font-semibold text-right">SuFin Rate (₹)</th>
                  <th className="py-3 px-4 font-semibold text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7DED4]">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F5EFE8]/40 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-[#087F73]">
                      T{item.tier}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11.5px] text-[#62645F]">
                      {item.catalogCode}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-[#202321]">
                      {item.itemDescription}
                    </td>
                    <td className="py-2.5 px-4 text-[#8A8982] font-mono text-[11.5px]">
                      {item.hsnCode}
                    </td>
                    <td className="py-2.5 px-4 text-right font-semibold text-[#202321]">
                      {item.quantity.toLocaleString()} {item.unit}
                    </td>
                    <td className="py-2.5 px-4 text-right text-[#62645F]">
                      ₹{item.unitRateINR.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-[#087F73]">
                      ₹{item.totalAmountINR.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Banner */}
          <div className="p-4 px-6 border-t border-[#E7DED4] bg-[#FBF8F4] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px]">
            <span className="text-[#8A8982]">
              {downloadNotice ? (
                <span className="font-semibold text-[#087A4B]">{downloadNotice}</span>
              ) : (
                'All item takeoffs auto-generated via spatial analysis & Manhattan Steiner conduit routes.'
              )}
            </span>
            <div className="flex items-center space-x-2 font-medium text-[#202321]">
              <span>Subtotal: ₹{subTotal.toLocaleString('en-IN')}</span>
              <span className="text-[#D9CEC2]">·</span>
              <span className="font-bold text-[#087F73]">Total: ₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
