
import { Edit, Trash2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Expense } from "@/types/expense";
import { Person } from "@/types/person";

interface ExpenseListProps {
  expenses: Expense[];
  people: Person[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

const categories = {
  comida: "🍽️",
  bebida: "🍺", 
  transporte: "🚗",
  hospedagem: "🏨",
  outros: "📦"
};

export const ExpenseList = ({ expenses, people, onEditExpense, onDeleteExpense }: ExpenseListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getPersonColor = (name: string) => {
    const person = people.find(p => p.name === name);
    return person?.color || 'bg-gray-500';
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <DollarSign className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum gasto ainda</h3>
        <p className="text-gray-500">Adicione o primeiro gasto do grupo para continuar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Total */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-green-700 font-medium">Total dos Gastos:</span>
          <span className="text-2xl font-bold text-green-700">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>

      {/* Lista de gastos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">Gastos Adicionados</h3>
        </div>
        
        {expenses.map((expense) => (
          <div key={expense.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">
                    {categories[expense.category as keyof typeof categories]}
                  </span>
                  <h4 className="font-semibold text-gray-900">{expense.description}</h4>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getPersonColor(expense.paidBy)}`}></div>
                    <span>Pago por {expense.paidBy}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-4">
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditExpense(expense)}
                    className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteExpense(expense.id)}
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
