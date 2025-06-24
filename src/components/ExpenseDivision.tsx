
import { useState } from "react";
import { ArrowLeft, ArrowRight, Users, Calculator, Percent, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Person } from "@/types/person";
import { Expense } from "@/types/expense";

interface ExpenseDivisionProps {
  people: Person[];
  expenses: Expense[];
  onBack: () => void;
  onContinue: (expenses: Expense[]) => void;
}

const categories = {
  comida: "🍽️",
  bebida: "🍺", 
  transporte: "🚗",
  hospedagem: "🏨",
  outros: "📦"
};

export const ExpenseDivision = ({ people, expenses, onBack, onContinue }: ExpenseDivisionProps) => {
  const [updatedExpenses, setUpdatedExpenses] = useState<Expense[]>(
    expenses.map(expense => ({
      ...expense,
      splitBetween: expense.splitBetween || people.map(p => p.name),
      splitType: expense.splitType || 'equal',
      splitData: expense.splitData || {}
    }))
  );
  const [expandedExpenses, setExpandedExpenses] = useState<string[]>([]);

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

  const toggleExpenseExpansion = (expenseId: string) => {
    setExpandedExpenses(prev => 
      prev.includes(expenseId) 
        ? prev.filter(id => id !== expenseId)
        : [...prev, expenseId]
    );
  };

  const updateExpenseSplitType = (expenseId: string, splitType: 'equal' | 'custom' | 'percentage') => {
    setUpdatedExpenses(prev => prev.map(expense => 
      expense.id === expenseId 
        ? { 
            ...expense, 
            splitType,
            splitData: splitType === 'equal' ? {} : expense.splitData || {}
          }
        : expense
    ));
  };

  const updateExpenseSplitBetween = (expenseId: string, personName: string, included: boolean) => {
    setUpdatedExpenses(prev => prev.map(expense => 
      expense.id === expenseId 
        ? { 
            ...expense, 
            splitBetween: included 
              ? [...(expense.splitBetween || []), personName]
              : (expense.splitBetween || []).filter(name => name !== personName)
          }
        : expense
    ));
  };

  const updatePercentageValue = (expenseId: string, personName: string, percentage: number) => {
    setUpdatedExpenses(prev => prev.map(expense => 
      expense.id === expenseId 
        ? { 
            ...expense, 
            splitData: { ...expense.splitData, [personName]: percentage }
          }
        : expense
    ));
  };

  const calculatePersonShare = (expense: Expense, personName: string): number => {
    if (!expense.splitBetween?.includes(personName)) return 0;
    
    switch (expense.splitType) {
      case 'equal':
        return expense.amount / (expense.splitBetween?.length || 1);
      case 'percentage':
        const percentage = expense.splitData?.[personName] || 0;
        return (expense.amount * percentage) / 100;
      case 'custom':
        // For custom, we'll implement a simple equal split among selected people
        return expense.amount / (expense.splitBetween?.length || 1);
      default:
        return 0;
    }
  };

  const getTotalPercentage = (expense: Expense): number => {
    if (expense.splitType !== 'percentage') return 100;
    return Object.values(expense.splitData || {}).reduce((sum, val) => sum + (val || 0), 0);
  };

  const getPersonSummary = (personName: string) => {
    const participatingExpenses = updatedExpenses.filter(expense => 
      expense.splitBetween?.includes(personName)
    );
    const totalOwed = participatingExpenses.reduce((sum, expense) => 
      sum + calculatePersonShare(expense, personName), 0
    );
    const totalPaid = updatedExpenses
      .filter(expense => expense.paidBy === personName)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      participatingCount: participatingExpenses.length,
      totalCount: updatedExpenses.length,
      totalOwed,
      totalPaid,
      balance: totalPaid - totalOwed
    };
  };

  const canContinue = updatedExpenses.every(expense => 
    expense.splitBetween && expense.splitBetween.length > 0 &&
    (expense.splitType !== 'percentage' || getTotalPercentage(expense) === 100)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Divisão dos Gastos</h2>
        <p className="text-gray-600">
          Configure como cada gasto será dividido entre as pessoas
        </p>
      </div>

      {/* People Summary */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Resumo por Pessoa:</h3>
        <div className="grid gap-2">
          {people.map(person => {
            const summary = getPersonSummary(person.name);
            return (
              <div key={person.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${person.color}`}></div>
                  <span className="font-medium">{person.name}</span>
                  <span className="text-sm text-gray-500">
                    ({summary.participatingCount} de {summary.totalCount} gastos)
                  </span>
                </div>
                <div className="text-sm font-medium">
                  {formatCurrency(summary.totalOwed)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expenses Division */}
      <div className="space-y-3">
        {updatedExpenses.map((expense) => {
          const isExpanded = expandedExpenses.includes(expense.id);
          const totalPercentage = getTotalPercentage(expense);
          
          return (
            <div key={expense.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
              <Collapsible>
                <CollapsibleTrigger 
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpenseExpansion(expense.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {categories[expense.category as keyof typeof categories]}
                      </span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{expense.description}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className={`w-3 h-3 rounded-full ${getPersonColor(expense.paidBy)}`}></div>
                          <span>Pago por {expense.paidBy}</span>
                          <span>•</span>
                          <span>{formatCurrency(expense.amount)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {expense.splitBetween?.slice(0, 3).map(personName => (
                          <div 
                            key={personName}
                            className={`w-6 h-6 rounded-full ${getPersonColor(personName)} opacity-80`}
                            title={personName}
                          ></div>
                        ))}
                        {expense.splitBetween && expense.splitBetween.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">
                            +{expense.splitBetween.length - 3}
                          </div>
                        )}
                      </div>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="px-4 pb-4">
                  <div className="border-t pt-4 space-y-4">
                    {/* Split Type Selection */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Tipo de Divisão:</Label>
                      <RadioGroup
                        value={expense.splitType}
                        onValueChange={(value) => updateExpenseSplitType(expense.id, value as any)}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="equal" id={`equal-${expense.id}`} />
                          <Label htmlFor={`equal-${expense.id}`} className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Dividir igualmente
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="custom" id={`custom-${expense.id}`} />
                          <Label htmlFor={`custom-${expense.id}`} className="flex items-center gap-1">
                            <Calculator className="h-4 w-4" />
                            Personalizada
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="percentage" id={`percentage-${expense.id}`} />
                          <Label htmlFor={`percentage-${expense.id}`} className="flex items-center gap-1">
                            <Percent className="h-4 w-4" />
                            Por percentual
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* People Selection */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Quem participou deste gasto:
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {people.map(person => {
                          const isIncluded = expense.splitBetween?.includes(person.name) || false;
                          const share = calculatePersonShare(expense, person.name);
                          
                          return (
                            <div key={person.id} className="flex items-center justify-between p-2 border rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${expense.id}-${person.id}`}
                                  checked={isIncluded}
                                  onCheckedChange={(checked) => 
                                    updateExpenseSplitBetween(expense.id, person.name, checked as boolean)
                                  }
                                />
                                <div className={`w-4 h-4 rounded-full ${person.color}`}></div>
                                <Label htmlFor={`${expense.id}-${person.id}`} className="text-sm">
                                  {person.name}
                                </Label>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {expense.splitType === 'percentage' && isIncluded && (
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={expense.splitData?.[person.name] || 0}
                                    onChange={(e) => updatePercentageValue(expense.id, person.name, Number(e.target.value))}
                                    className="w-16 h-8 text-xs"
                                    placeholder="0"
                                  />
                                )}
                                {isIncluded && (
                                  <span className="text-xs font-medium text-green-600">
                                    {formatCurrency(share)}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {expense.splitType === 'percentage' && totalPercentage !== 100 && (
                        <p className="text-sm text-red-600 mt-2">
                          Total: {totalPercentage}% (deve somar 100%)
                        </p>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos Gastos
        </Button>
        
        <Button
          onClick={() => onContinue(updatedExpenses)}
          disabled={!canContinue}
          className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
        >
          Ver Resultado Final
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
