
import { Trash2, Calendar, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Expense } from "@/types/expense";

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export const ExpenseList = ({ expenses, onDelete }: ExpenseListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhuma despesa ainda</h3>
          <p>Comece adicionando sua primeira despesa para dividir com os amigos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800">Despesas Recentes</h2>
      </div>
      
      <div className="divide-y divide-gray-100">
        {expenses.map((expense) => (
          <div key={expense.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{expense.title}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {expense.category}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(expense.date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Pago por {expense.paidBy}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {expense.splitBetween.length} pessoas
                  </div>
                </div>

                {expense.description && (
                  <p className="text-sm text-gray-600 mb-3">{expense.description}</p>
                )}

                <div className="flex flex-wrap gap-1">
                  {expense.splitBetween.map((person) => (
                    <span
                      key={person}
                      className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full"
                    >
                      {person}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 ml-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(expense.amount / expense.splitBetween.length)} por pessoa
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(expense.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
