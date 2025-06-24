
import { useState } from "react";
import { Plus, History } from "lucide-react";

interface NavigationProps {
  activeTab: 'novo' | 'historico';
  onTabChange: (tab: 'novo' | 'historico') => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-4">
        <nav className="flex space-x-8">
          <button
            onClick={() => onTabChange('novo')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'novo'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Novo Split</span>
          </button>
          
          <button
            onClick={() => onTabChange('historico')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'historico'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <History className="h-4 w-4" />
            <span>Histórico</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
