'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Folder, 
  Edit3, 
  FileSpreadsheet, 
  ShieldCheck, 
  Hexagon 
} from 'lucide-react';

interface PrimaryNavProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenUpload?: () => void;
  onOpenExport?: () => void;
}

export default function PrimaryNav({
  activeTab,
  setActiveTab
}: PrimaryNavProps) {
  const pathname = usePathname();

  const navItems = [
    { id: 'dashboard', href: '/', label: 'Dashboard', icon: Home },
    { id: 'projects', href: '/projects', label: 'Projects', icon: Folder },
    { id: 'design', href: '/design', label: 'Design', icon: Edit3 },
    { id: 'bom', href: '/bom', label: 'BOM / BOQ', icon: FileSpreadsheet },
    { id: 'standards', href: '/standards', label: 'Standards', icon: ShieldCheck },
    { id: 'library', href: '/library', label: 'Library', icon: Hexagon },
  ];

  return (
    <nav className="w-full h-[52px] bg-[#FBF8F4] border-b border-[#E7DED4] px-6 sm:px-8 flex items-center justify-between select-none">
      {/* Nav Tabs */}
      <div className="flex items-center space-x-6 sm:space-x-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Determine active status either from pathname or prop
          const isActive = 
            (item.href === '/' && pathname === '/') ||
            (item.href !== '/' && pathname.startsWith(item.href)) ||
            activeTab === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveTab?.(item.id)}
              className={`relative h-[52px] flex items-center space-x-2 text-[13.5px] transition-colors duration-150 cursor-pointer ${
                isActive
                  ? 'text-[#087F73] font-semibold'
                  : 'text-[#62645F] hover:text-[#202321] font-normal'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#087F73]' : 'text-[#62645F]'}`} />
              <span>{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#087F73] rounded-t-xs" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
