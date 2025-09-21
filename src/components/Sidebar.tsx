import React from 'react';
import { ChartPieIcon, DocumentTextIcon, Cog6ToothIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const NavItem: React.FC<{ icon: React.ElementType; label: string; isActive: boolean; onClick: () => void; }> = ({ icon: Icon, label, isActive, onClick }) => (
  <a
    href="#"
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-md mx-2 ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
    }`}
  >
    <Icon className="h-6 w-6 mr-3" />
    <span>{label}</span>
  </a>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="w-64 bg-gray-800 text-white flex-shrink-0 flex-col hidden md:flex">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
         <ShieldCheckIcon className="h-8 w-8 text-indigo-400" />
         <span className="ml-2 text-2xl font-bold text-white">CMS Admin</span>
      </div>
      <nav className="flex-1 py-4 space-y-2">
        <NavItem
          icon={ChartPieIcon}
          label="Dashboard"
          isActive={activeView === 'dashboard'}
          onClick={() => setActiveView('dashboard')}
        />
        <NavItem
          icon={DocumentTextIcon}
          label="All Complaints"
          isActive={activeView === 'complaints'}
          onClick={() => setActiveView('complaints')}
        />
        <NavItem
          icon={Cog6ToothIcon}
          label="Settings"
          isActive={activeView === 'settings'}
          onClick={() => setActiveView('settings')}
        />
      </nav>
    </div>
  );
};
