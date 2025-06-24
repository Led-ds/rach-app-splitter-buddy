
import { Calculator, Users } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-2 rounded-xl">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                RachApp
              </h1>
              <p className="text-sm text-gray-500">Divida contas facilmente</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full">
            <Users className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-600">Você</span>
          </div>
        </div>
      </div>
    </header>
  );
};
