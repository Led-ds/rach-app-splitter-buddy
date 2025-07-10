
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Expense } from "@/types/expense";
import { Person } from "@/types/person";
import { ExpenseForm } from "./ExpenseForm";
import { SplitTemplate } from "@/types/history";
import { ExpenseManagementViewModel } from "../viewmodels/expense-management.viewmodel";
import { useToast } from "@/hooks/use-toast";

interface ExpenseManagementProps {
  people: Person[];
  onBack: () => void;
  onContinue: (expenses: Expense[]) => void;
  template?: SplitTemplate | null;
}

export const ExpenseManagement = ({ people, onBack, onContinue, template }: ExpenseManagementProps) => {
  const { toast } = useToast();
  const [viewModel] = useState(() => new ExpenseManagementViewModel(
    people.map(p => ({ id: p.id, name: p.name, color: p.color })),
    (expenses) => onContinue(expenses.map(e => ({
      id: e.id,
      description: e.description,
      amount: e.amount,
      paidBy: e.paidBy,
      category: e.category,
      date: e.date,
      splitBetween: e.splitBetween,
      splitType: e.splitType,
      splitData: e.splitData
    }))),
    template ? {
      id: template.id,
      name: template.name,
      description: template.description,
      icon: template.icon,
      defaultExpenses: template.defaultExpenses
    } : null
  ));

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddExpense = async (newExpense: Expense) => {
    try {
      console.log('➕ Componente - Adicionando novo gasto:', newExpense);
      setIsLoading(true);
      
      await viewModel.addExpense({
        id: newExpense.id,
        description: newExpense.description,
        amount: newExpense.amount,
        paidBy: newExpense.paidBy,
        category: newExpense.category,
        date: newExpense.date,
        splitBetween: newExpense.splitBetween,
        splitType: newExpense.splitType,
        splitData: newExpense.splitData
      });
      
      // Atualizar lista local diretamente
      setExpenses(prev => [...prev, newExpense]);
      
      toast({
        title: "Gasto adicionado",
        description: `${newExpense.description} foi adicionado com sucesso.`
      });
    } catch (error) {
      console.error('Erro ao adicionar gasto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o gasto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      console.log('🗑️ Componente - Deletando gasto com ID:', id);
      setIsLoading(true);
      
      await viewModel.deleteExpense(id);
      
      // Atualizar lista local diretamente
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      
      toast({
        title: "Gasto removido",
        description: "O gasto foi removido com sucesso."
      });
    } catch (error) {
      console.error('Erro ao deletar gasto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o gasto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular total diretamente dos expenses locais
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {viewModel.template ? `${viewModel.template.icon} Gastos do ${viewModel.template.name}` : 'Adicionar Gastos'}
        </h2>
        <p className="text-gray-600">
          {viewModel.template ? `Adicione os gastos do ${viewModel.template.name.toLowerCase()}` : 'Registre todos os gastos que precisam ser divididos'}
        </p>
      </div>

      <ExpenseForm 
        people={people} 
        onAddExpense={handleAddExpense}
        template={template}
      />

      {/* Expenses List */}
      {expenses.length > 0 && (
        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Lista de Gastos ({expenses.length} itens)</h3>
            <div className="space-y-3">
              {expenses.map((expense) => {
                console.log(`🧾 Renderizando expense:`, expense);
                
                return (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-700">{expense.description}</p>
                      <p className="text-sm text-gray-500">{expense.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-700">
                        {viewModel.formatCurrency(expense.amount)}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteExpense(expense.id)}
                        disabled={isLoading}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-right font-bold">
              Total: {viewModel.formatCurrency(totalAmount)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1" disabled={isLoading}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Button 
          onClick={() => viewModel.continue()} 
          className="flex-1 bg-blue-500 hover:bg-blue-600"
          disabled={isLoading || expenses.length === 0}
        >
          {isLoading ? "Carregando..." : "Continuar para Divisão"}
        </Button>
      </div>
    </div>
  );
};
