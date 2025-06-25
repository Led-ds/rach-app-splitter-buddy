
import { Calculator } from "lucide-react";

/**
 * Componente Header - Cabeçalho principal da aplicação
 * Exibe o logo, nome e slogan do RachApp
 * Fica fixo no topo da página (sticky)
 */
export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            {/* Logo do app */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-xl">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            
            {/* Nome e slogan */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                RachApp
              </h1>
              <p className="text-sm text-green-600 font-medium">Racha a conta, não a amizade</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
