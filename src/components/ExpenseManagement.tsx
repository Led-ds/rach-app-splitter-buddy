
import { useState, useEffect } from "react";
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

  useEffect(() => {
    console.log('🔄 useEffect triggered - viewModel.expenses:', viewModel.expenses);
    console.log('🔄 viewModel.expenses length:', viewModel.expenses.length);
    
    // Atualiza a lista local quando o viewModel é atualizado
    const mappedExpenses = viewModel.expenses.map(e => {
      console.log('🗃️ Mapeando expense individual:', e);
      return {
        id: e.id,
        description: e.description,
        amount: e.amount,
        paidBy: e.paidBy,
        category: e.category,
        date: e.date,
        splitBetween: e.splitBetween,
        splitType: e.splitType,
        splitData: e.splitData
      };
    });
    
    console.log('🔄 Mapped expenses:', mappedExpenses);
    console.log('🔄 Current expenses state before update:', expenses);
    
    setExpenses(mappedExpenses);
    setIsLoading(viewModel.isLoading);
  }, [viewModel.expenses, viewModel.isLoading]);

  const handleAddExpense = async (newExpense: Expense) => {
    try {
      console.log('➕ Adicionando novo gasto:', newExpense);
      console.log('➕ Expenses antes de adicionar:', viewModel.expenses);
      
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
      
      console.log('➕ Expenses após adicionar:', viewModel.expenses);
      
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
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      console.log('🗑️ Deletando gasto com ID:', id);
      console.log('🗑️ Expenses antes de deletar:', viewModel.expenses);
      
      await viewModel.deleteExpense(id);
      
      console.log('🗑️ Expenses após deletar:', viewModel.expenses);
      
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
    }
  };

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
              {expenses.map((expense, index) => {
                console.log(`🧾 Renderizando expense #${index}:`, expense);
                console.log(`🧾 Expense ID: ${expense.id}, amount: ${expense.amount}, type: ${typeof expense.amount}`);
                
                // Verificação de segurança para IDs únicos
                if (!expense.id) {
                  console.error('⚠️ Expense sem ID encontrado:', expense);
                  return null;
                }
                
                return (
                  <div key={`expense-${expense.id}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-700">{expense.description || 'Descrição não informada'}</p>
                      <p className="text-sm text-gray-500">{expense.category || 'Categoria não informada'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-700">
                        {expense.amount !== undefined && expense.amount !== null && !isNaN(expense.amount) 
                          ? viewModel.formatCurrency(expense.amount)
                          : `Valor inválido (${expense.amount})`
                        }
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
              Total: {viewModel.formatCurrency(viewModel.totalAmount)}
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
          disabled={isLoading || !viewModel.canContinue()}
        >
          {isLoading ? "Carregando..." : "Continuar para Divisão"}
        </Button>
      </div>
    </div>
  );
};
