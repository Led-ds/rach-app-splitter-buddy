
import { useState } from "react";
import { Header } from "@/components/Header";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { Summary } from "@/components/Summary";
import { Expense } from "@/types/expense";

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);

  const addExpense = (expense: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setExpenses(prev => [newExpense, ...prev]);
    setShowForm(false);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Bem-vindo ao RachApp
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Divida suas despesas de forma simples e justa. Adicione gastos, convide amigos e mantenha tudo organizado.
          </p>
        </div>

        <Summary expenses={expenses} />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Nova Despesa</h2>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Adicionar
                  </button>
                )}
              </div>
              
              {showForm ? (
                <ExpenseForm 
                  onSubmit={addExpense} 
                  onCancel={() => setShowForm(false)} 
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                  <p>Clique em "Adicionar" para criar uma nova despesa</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-2/3">
            <ExpenseList expenses={expenses} onDelete={deleteExpense} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
