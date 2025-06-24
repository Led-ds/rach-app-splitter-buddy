
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Person } from "@/types/person";

interface ExpenseManagementProps {
  people: Person[];
  onBack: () => void;
}

export const ExpenseManagement = ({ people, onBack }: ExpenseManagementProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Próxima etapa</h2>
        <p className="text-gray-600">
          Módulo de gastos será implementado em breve
        </p>
      </div>

      <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Grupo formado com sucesso!
        </h3>
        <p className="text-gray-600 mb-4">
          {people.length} pessoas: {people.map(p => p.name).join(', ')}
        </p>
        <p className="text-sm text-gray-500">
          Em breve você poderá adicionar os gastos do grupo.
        </p>
      </div>

      <Button
        variant="outline"
        onClick={onBack}
        className="w-full"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para editar grupo
      </Button>
    </div>
  );
};
