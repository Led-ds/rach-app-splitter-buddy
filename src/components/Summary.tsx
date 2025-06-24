
import { TrendingUp, DollarSign, Users, PieChart } from "lucide-react";
import { Expense } from "@/types/expense";

interface SummaryProps {
  expenses: Expense[];
}

export const Summary = ({ expenses }: SummaryProps) => {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalExpenses = expenses.length;
  const averagePerExpense = totalExpenses > 0 ? totalAmount / totalExpenses : 0;

  // Calculate who owes what (simplified version)
  const balances = expenses.reduce((acc, expense) => {
    const amountPerPerson = expense.amount / expense.splitBetween.length;
    
    // Person who paid gets credited
    if (!acc[expense.paidBy]) acc[expense.paidBy] = 0;
    acc[expense.paidBy] += expense.amount;
    
    // Everyone who should split gets debited
    expense.splitBetween.forEach(person => {
      if (!acc[person]) acc[person] = 0;
      acc[person] -= amountPerPerson;
    });
    
    return acc;
  }, {} as Record<string, number>);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Gasto</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="bg-emerald-100 p-3 rounded-full">
            <DollarSign className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Despesas</p>
            <p className="text-3xl font-bold text-gray-900">{totalExpenses}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <PieChart className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Média por Despesa</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(averagePerExpense)}</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-full">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Participantes</p>
            <p className="text-3xl font-bold text-gray-900">
              {Object.keys(balances).length || 1}
            </p>
          </div>
          <div className="bg-orange-100 p-3 rounded-full">
            <Users className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
