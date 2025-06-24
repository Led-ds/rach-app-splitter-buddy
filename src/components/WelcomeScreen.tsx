
import { Users, Calculator, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onStartNewSplit: () => void;
}

export const WelcomeScreen = ({ onStartNewSplit }: WelcomeScreenProps) => {
  return (
    <div className="text-center space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto flex items-center justify-center">
          <Calculator className="h-12 w-12 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900">
          Bem-vindo ao RachApp!
        </h2>
        
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          A forma mais fácil de dividir contas entre amigos sem complicação.
        </p>
      </div>

      {/* Features */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Adicione pessoas</h3>
          <p className="text-sm text-gray-600">Monte o grupo e organize quem vai participar do racha</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Banknote className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Registre gastos</h3>
          <p className="text-sm text-gray-600">Adicione todas as despesas e quem pagou cada uma</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Calculator className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Calcule e divida</h3>
          <p className="text-sm text-gray-600">Veja quanto cada um deve pagar ou receber</p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-4">
        <Button
          onClick={onStartNewSplit}
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Criar Novo Split
        </Button>
      </div>
    </div>
  );
};
