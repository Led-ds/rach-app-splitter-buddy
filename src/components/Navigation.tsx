
import { useState } from "react";
import { Plus, History } from "lucide-react";

interface NavigationProps {
  activeTab: 'novo' | 'historico';                    // Aba ativa atual
  onTabChange: (tab: 'novo' | 'historico') => void;   // Callback para mudança de aba
}

/**
 * Componente Navigation - Barra de navegação principal
 * Permite alternar entre "Novo Split" e "Histórico"
 * Usa design de tabs com indicador visual da aba ativa
 */
export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-4">
        <nav className="flex space-x-8">
          {/* Aba: Novo Split */}
          <button
            onClick={() => onTabChange('novo')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'novo'
                ? 'border-green-500 text-green-600'      // Estilo da aba ativa
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'  // Estilo da aba inativa
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Novo Split</span>
          </button>
          
          {/* Aba: Histórico */}
          <button
            onClick={() => onTabChange('historico')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'historico'
                ? 'border-green-500 text-green-600'      // Estilo da aba ativa
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'  // Estilo da aba inativa
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
