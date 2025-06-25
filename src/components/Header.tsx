
import { Link, useLocation } from "react-router-dom";
import { Calculator, GitBranch } from "lucide-react";

/**
 * Componente Header - Cabeçalho principal da aplicação
 * Exibe logo, título e navegação para páginas especiais
 */
export const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e título principal */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="bg-green-500 p-2 rounded-lg">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">RachApp</h1>
              <p className="text-sm text-gray-600">Dividir nunca foi tão fácil</p>
            </div>
          </Link>

          {/* Link para diagrama de processos */}
          {location.pathname !== '/processo' && (
            <Link 
              to="/processo"
              className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              <GitBranch className="h-4 w-4" />
              <span>Ver Processos</span>
            </Link>
          )}

          {/* Link para voltar quando estiver na página de processos */}
          {location.pathname === '/processo' && (
            <Link 
              to="/"
              className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg border border-green-200 hover:bg-green-100 transition-colors text-sm font-medium"
            >
              <Calculator className="h-4 w-4" />
              <span>Voltar ao App</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
