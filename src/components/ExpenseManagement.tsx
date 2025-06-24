
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Person } from "@/types/person";
import { Expense } from "@/types/expense";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseList } from "./ExpenseList";

interface ExpenseManagementProps {
  people: Person[];
  onBack: () => void;
  onContinue: (expenses: Expense[]) => void;
}

export const ExpenseManagement = ({ people, onBack, onContinue }: ExpenseManagementProps) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleAddExpense = (expenseData: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    if (editingExpense) {
      setExpenses(prev => prev.map(exp => 
        exp.id === editingExpense.id ? { ...newExpense, id: editingExpense.id } : exp
      ));
      setEditingExpense(null);
    } else {
      setExpenses(prev => [...prev, newExpense]);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const handleContinue = () => {
    onContinue(expenses);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Adicionar Gastos</h2>
        <p className="text-gray-600">
          Registre todos os gastos do grupo para fazer a divisão
        </p>
      </div>

      {/* Form */}
      <ExpenseForm 
        people={people} 
        onAddExpense={handleAddExpense}
      />

      {/* List */}
      <ExpenseList
        expenses={expenses}
        people={people}
        onEditExpense={handleEditExpense}
        onDeleteExpense={handleDeleteExpense}
      />

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        
        <Button
          onClick={handleContinue}
          disabled={expenses.length === 0}
          className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
        >
          Continuar para Divisão
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
