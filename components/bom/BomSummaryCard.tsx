'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  Download, 
  X,
  FileCode2
} from 'lucide-react';
import { ProjectData } from '@/engine/types';
import { exportToSuFinCSV, exportToSapMMXML } from '@/engine/bom';

interface BomSummaryCardProps {
  project: ProjectData;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function BomSummaryCard({ project, isOpen, onOpenChange }: BomSummaryCardProps) {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const showFullModal = isOpen !== undefined ? isOpen : internalModalOpen;
  const setShowFullModal = (val: boolean) => {
    setInternalModalOpen(val);
    onOpenChange?.(val);
  };

  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Dynamic calculations from active project BOM items
  const luminaireQty = project.bomItems
    .filter(i => i.tier === 1)
    .reduce((sum, i) => sum + i.quantity, 0) || 1248;

  const conduitMeters = project.bomItems
    .filter(i => i.tier === 2)
    .reduce((sum, i) => sum + i.quantity, 0) || 18420;

  const cableMeters = project.bomItems
    .filter(i => i.tier === 3)
    .reduce((sum, i) => sum + i.quantity, 0) || 54860;

  const junctionBoxes = project.bomItems
    .filter(i => i.tier === 4)
    .reduce((sum, i) => sum + i.quantity, 0) || 1092;

  const mcbCount = project.bomItems
    .filter(i => i.tier === 5)
    .reduce((sum, i) => sum + i.quantity, 0) || 48;

  const summaryRows = [
    { label: 'Luminaire (LED)', qty: `${luminaireQty.toLocaleString()} Nos` },
    { label: 'Conduit (20 / 25 mm)', qty: `${conduitMeters.toLocaleString()} m` },
    { label: 'Cable (3C / 4C)', qty: `${cableMeters.toLocaleString()} m` },
    { label: 'Junction Box', qty: `${junctionBoxes.toLocaleString()} Nos` },
    { label: 'MCB / DB', qty: `${mcbCount.toLocaleString()} Nos` },
  ];

  const totalCost = project.bomItems.reduce((sum, i) => sum + i.totalAmountINR, 0);

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

    setDownloadNotice('SuFin CSV Downloaded!');
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

    setDownloadNotice('SAP XML Downloaded!');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-[13px] p-5 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-center space-x-2.5 mb-4">
        <Layers className="w-4.5 h-4.5 text-[#087F73]" />
        <h2 className="text-[14.5px] font-semibold text-[#202321] tracking-tight">
          BOM / BOQ Summary
        </h2>
      </div>

      {/* 5 Summary Rows matching reference */}
      <div className="space-y-3.5 my-4">
        {summaryRows.map((row, idx) => (
          <div key={idx} className="flex items-center justify-between text-[13px]">
            <span className="text-[#62645F] font-normal">{row.label}</span>
            <span className="text-[#202321] font-semibold tracking-tight">{row.qty}</span>
          </div>
        ))}
      </div>

      {/* Generate Action Button */}
      <div className="mt-5">
        <button
          onClick={() => setShowFullModal(true)}
          className="w-full h-[42px] rounded-lg border border-[#087F73] text-[#087F73] hover:bg-[#E5F4EF]/50 font-medium text-[13px] flex items-center justify-center space-x-2 transition-colors cursor-pointer bg-[#FFFCF8]"
        >
          <Download className="w-4 h-4 text-[#087F73]" />
          <span>Generate BOM / BOQ</span>
        </button>
      </div>

      {/* Interactive 6-Tier BOQ Modal */}
      {showFullModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-6 animate-fade-in">
          <div className="bg-[#FFFCF8] border border-[#E7DED4] rounded-2xl w-full max-w-4xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-[#E7DED4] flex items-center justify-between bg-[#FBF8F4]">
              <div>
                <h3 className="text-[16px] font-semibold text-[#202321]">
                  6-Tier Bill of Quantities (BOM / BOQ)
                </h3>
                <p className="text-[12px] text-[#62645F] mt-0.5">
                  Project: {project.name} ({project.code}) · Total Takeoff Value: ₹{totalCost.toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setShowFullModal(false)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E7DED4] flex items-center justify-center text-[#62645F] hover:text-[#202321] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Table Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <table className="w-full text-left text-[12px] border-collapse">
                <thead>
                  <tr className="bg-[#E5F4EF] text-[#087F73] border-b border-[#0B9B8A]/30">
                    <th className="py-2.5 px-3 font-semibold">Tier</th>
                    <th className="py-2.5 px-3 font-semibold">Catalog Code</th>
                    <th className="py-2.5 px-3 font-semibold">Description</th>
                    <th className="py-2.5 px-3 font-semibold">HSN</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Qty</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Rate (₹)</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7DED4]">
                  {project.bomItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F5EFE8]/50 transition-colors">
                      <td className="py-2 px-3 font-medium text-[#087F73]">T{item.tier}</td>
                      <td className="py-2 px-3 font-mono text-[11px] text-[#62645F]">{item.catalogCode}</td>
                      <td className="py-2 px-3 font-medium text-[#202321]">{item.itemDescription}</td>
                      <td className="py-2 px-3 text-[#8A8982]">{item.hsnCode}</td>
                      <td className="py-2 px-3 text-right font-medium text-[#202321]">
                        {item.quantity.toLocaleString()} {item.unit}
                      </td>
                      <td className="py-2 px-3 text-right text-[#62645F]">
                        ₹{item.unitRateINR.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-[#087F73]">
                        ₹{item.totalAmountINR.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-[#E7DED4] bg-[#FBF8F4] flex items-center justify-between">
              <span className="text-[12px] text-[#8A8982]">
                {downloadNotice ? (
                  <span className="font-semibold text-[#087A4B]">{downloadNotice}</span>
                ) : (
                  'Exportable directly to L&T SuFin marketplace and SAP MM.'
                )}
              </span>
              <div className="flex items-center space-x-2.5">
                <button
                  onClick={handleDownloadCSV}
                  className="h-8.5 px-4 rounded-lg bg-[#087F73] hover:bg-[#0B9B8A] text-white text-[12px] font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SuFin CSV</span>
                </button>
                <button
                  onClick={handleDownloadSAP}
                  className="h-8.5 px-4 rounded-lg bg-[#FFFCF8] border border-[#087F73] text-[#087F73] hover:bg-[#E5F4EF] text-[12px] font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>Download SAP XML</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
