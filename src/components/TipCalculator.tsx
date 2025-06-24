
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TipCalculatorProps {
  onAddTip: (amount: number) => void;
}

export const TipCalculator = ({ onAddTip }: TipCalculatorProps) => {
  const [billAmount, setBillAmount] = useState<string>("");
  const [selectedPercentage, setSelectedPercentage] = useState<number>(10);
  const [customPercentage, setCustomPercentage] = useState<string>("");

  const tipPercentages = [10, 15, 20];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const calculateTip = () => {
    const amount = parseFloat(billAmount.replace(',', '.')) || 0;
    const percentage = customPercentage ? parseFloat(customPercentage.replace(',', '.')) : selectedPercentage;
    return (amount * percentage) / 100;
  };

  const tipAmount = calculateTip();
  const totalAmount = (parseFloat(billAmount.replace(',', '.')) || 0) + tipAmount;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          💰 Calculadora de Gorjeta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor da conta
          </label>
          <Input
            type="text"
            placeholder="R$ 0,00"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Percentual da gorjeta
          </label>
          <div className="flex gap-2 mb-2">
            {tipPercentages.map((percentage) => (
              <Badge
                key={percentage}
                variant={selectedPercentage === percentage ? "default" : "outline"}
                className="cursor-pointer px-3 py-1"
                onClick={() => {
                  setSelectedPercentage(percentage);
                  setCustomPercentage("");
                }}
              >
                {percentage}%
              </Badge>
            ))}
          </div>
          <Input
            type="text"
            placeholder="Percentual personalizado"
            value={customPercentage}
            onChange={(e) => {
              setCustomPercentage(e.target.value);
              setSelectedPercentage(0);
            }}
          />
        </div>

        {billAmount && (
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Conta:</span>
              <span>{formatCurrency(parseFloat(billAmount.replace(',', '.')) || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Gorjeta ({customPercentage || selectedPercentage}%):</span>
              <span>{formatCurrency(tipAmount)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        )}

        <Button
          onClick={() => onAddTip(tipAmount)}
          disabled={!billAmount || tipAmount <= 0}
          className="w-full"
        >
          Adicionar Gorjeta
        </Button>
      </CardContent>
    </Card>
  );
};
