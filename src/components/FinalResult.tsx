import { useState } from "react";
import { ArrowLeft, Share2, Save, Plus, Check, Copy, MessageCircle, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Person } from "@/types/person";
import { Expense } from "@/types/expense";
import { Summary } from "./Summary";
import { Loading } from "@/components/ui/loading";

interface FinalResultProps {
  people: Person[];
  expenses: Expense[];
  onBack: () => void;
  onNewSplit: () => void;
  onSaveToHistory: () => void;
  loading?: boolean;
}

interface PersonBalance {
  name: string;
  totalPaid: number;
  totalOwed: number;
  balance: number;
  color: string;
  expensesParticipated: Expense[];
}

interface Transfer {
  from: string;
  to: string;
  amount: number;
  isPaid: boolean;
}

export const FinalResult = ({ 
  people, 
  expenses, 
  onBack, 
  onNewSplit, 
  onSaveToHistory,
  loading = false 
}: FinalResultProps) => {
  const [transfers, setTransfers] = useState<Transfer[]>(() => calculateTransfers());
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);

  function calculatePersonShare(expense: Expense, personName: string): number {
    if (!expense.splitBetween?.includes(personName)) return 0;
    
    switch (expense.splitType) {
      case 'equal':
        return expense.amount / (expense.splitBetween?.length || 1);
      case 'percentage':
        const percentage = expense.splitData?.[personName] || 0;
        return (expense.amount * percentage) / 100;
      case 'custom':
        return expense.amount / (expense.splitBetween?.length || 1);
      default:
        return 0;
    }
  }

  function calculateBalances(): PersonBalance[] {
    return people.map(person => {
      const totalPaid = expenses
        .filter(expense => expense.paidBy === person.name)
        .reduce((sum, expense) => sum + expense.amount, 0);

      const totalOwed = expenses.reduce((sum, expense) => 
        sum + calculatePersonShare(expense, person.name), 0
      );

      const expensesParticipated = expenses.filter(expense => 
        expense.splitBetween?.includes(person.name)
      );

      return {
        name: person.name,
        totalPaid,
        totalOwed,
        balance: totalPaid - totalOwed,
        color: person.color,
        expensesParticipated
      };
    });
  }

  function calculateTransfers(): Transfer[] {
    const balances = calculateBalances();
    const creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);
    const debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);
    
    const transfers: Transfer[] = [];
    let i = 0, j = 0;

    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];
      const amount = Math.min(creditor.balance, Math.abs(debtor.balance));

      if (amount > 0.01) {
        transfers.push({
          from: debtor.name,
          to: creditor.name,
          amount,
          isPaid: false
        });
      }

      creditor.balance -= amount;
      debtor.balance += amount;

      if (creditor.balance < 0.01) i++;
      if (Math.abs(debtor.balance) < 0.01) j++;
    }

    return transfers;
  }

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

  const balances = calculateBalances();
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleTransferPaid = (transferIndex: number) => {
    setTransfers(prev => prev.map((transfer, index) => 
      index === transferIndex 
        ? { ...transfer, isPaid: !transfer.isPaid }
        : transfer
    ));
  };

  const generateWhatsAppMessage = () => {
    let message = `🧾 *Resultado do Split - RachApp*\n\n`;
    message += `💰 *Total gasto:* ${formatCurrency(totalAmount)}\n\n`;
    
    message += `👥 *Resumo por pessoa:*\n`;
    balances.forEach(balance => {
      if (balance.balance > 0.01) {
        message += `✅ ${balance.name}: recebe ${formatCurrency(balance.balance)}\n`;
      } else if (balance.balance < -0.01) {
        message += `💸 ${balance.name}: deve ${formatCurrency(Math.abs(balance.balance))}\n`;
      } else {
        message += `⚖️ ${balance.name}: está quite\n`;
      }
    });

    if (transfers.length > 0) {
      message += `\n💳 *Transferências necessárias:*\n`;
      transfers.forEach(transfer => {
        message += `• ${transfer.from} → ${transfer.to}: ${formatCurrency(transfer.amount)}\n`;
      });
    }

    message += `\n📱 _Gerado pelo RachApp_`;
    return encodeURIComponent(message);
  };

  const copyToClipboard = async () => {
    const message = decodeURIComponent(generateWhatsAppMessage());
    await navigator.clipboard.writeText(message);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Resultado Final</h2>
        <p className="text-gray-600">Aqui está como ficou a divisão dos gastos</p>
      </div>

      {/* Summary Cards */}
      <Summary expenses={expenses} />

      {/* Balance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Resumo por Pessoa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {balances.map((balance) => (
            <div key={balance.name} className="space-y-2">
              <div 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setExpandedPerson(expandedPerson === balance.name ? null : balance.name)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${balance.color}`}></div>
                  <span className="font-medium">{balance.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {balance.expensesParticipated.length} gastos
                  </Badge>
                </div>
                
                <div className="text-right">
                  {balance.balance > 0.01 ? (
                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                      <TrendingUp className="h-4 w-4" />
                      recebe {formatCurrency(balance.balance)}
                    </div>
                  ) : balance.balance < -0.01 ? (
                    <div className="flex items-center gap-1 text-red-600 font-semibold">
                      <TrendingDown className="h-4 w-4" />
                      deve {formatCurrency(Math.abs(balance.balance))}
                    </div>
                  ) : (
                    <div className="text-gray-600 font-medium">Quite</div>
                  )}
                </div>
              </div>

              {expandedPerson === balance.name && (
                <div className="ml-7 p-3 bg-white border rounded-lg space-y-2">
                  <div className="text-sm text-gray-600">
                    <p><strong>Pagou:</strong> {formatCurrency(balance.totalPaid)}</p>
                    <p><strong>Deve:</strong> {formatCurrency(balance.totalOwed)}</p>
                    <p><strong>Saldo:</strong> {formatCurrency(balance.balance)}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-700 mb-1">Gastos que participou:</p>
                    {balance.expensesParticipated.map(expense => (
                      <div key={expense.id} className="flex justify-between">
                        <span>{expense.description}</span>
                        <span>{formatCurrency(calculatePersonShare(expense, balance.name))}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Transfers Section */}
      {transfers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💳 Quem deve para quem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {transfers.map((transfer, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  transfer.isPaid ? 'bg-green-50 border-green-200' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={transfer.isPaid}
                    onCheckedChange={() => handleTransferPaid(index)}
                  />
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${getPersonColor(transfer.from)}`}></div>
                    <span className="font-medium">{transfer.from}</span>
                    <span className="text-gray-500">→</span>
                    <div className={`w-4 h-4 rounded-full ${getPersonColor(transfer.to)}`}></div>
                    <span className="font-medium">{transfer.to}</span>
                  </div>
                </div>
                
                <div className={`font-bold ${transfer.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(transfer.amount)}
                  {transfer.isPaid && <Check className="inline ml-1 h-4 w-4" />}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={copyToClipboard}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copiar Resultado
        </Button>
        
        <Button
          onClick={() => window.open(`https://wa.me/?text=${generateWhatsAppMessage()}`, '_blank')}
          className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={loading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        
        <Button
          onClick={onSaveToHistory}
          className="flex-1 bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loading size="sm" className="mr-2" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar no Histórico
            </>
          )}
        </Button>
        
        <Button
          onClick={onNewSplit}
          className="flex-1" disabled={loading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Split
        </Button>
      </div>
    </div>
  );
};
