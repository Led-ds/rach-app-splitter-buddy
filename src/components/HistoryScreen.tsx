
import { Clock, Users, DollarSign } from "lucide-react";

export const HistoryScreen = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Histórico de Splits</h2>
        <p className="text-gray-600">Veja seus rachões anteriores</p>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Clock className="h-8 w-8 text-gray-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhum split ainda
        </h3>
        
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          Quando você criar seu primeiro split, ele aparecerá aqui para você consultar depois.
        </p>

        {/* Example items for future reference */}
        <div className="space-y-3 max-w-md mx-auto opacity-50">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-700 text-sm">Churrasco da galera</p>
                <p className="text-xs text-gray-500">5 pessoas • há 2 dias</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-700">R$ 280,00</p>
              <p className="text-xs text-green-600">Finalizado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
