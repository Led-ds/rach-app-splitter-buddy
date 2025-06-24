
import { useState } from "react";
import { Plus, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Person } from "@/types/person";
import { Expense } from "@/types/expense";

interface ExpenseFormProps {
  people: Person[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
}

const categories = [
  { value: "comida", label: "🍽️ Comida", suggestions: ["Jantar", "Almoço", "Lanche", "Pizza", "Hambúrguer"] },
  { value: "bebida", label: "🍺 Bebida", suggestions: ["Cerveja", "Refrigerante", "Água", "Drink", "Vinho"] },
  { value: "transporte", label: "🚗 Transporte", suggestions: ["Uber", "Táxi", "Gasolina", "Estacionamento", "Pedágio"] },
  { value: "hospedagem", label: "🏨 Hospedagem", suggestions: ["Hotel", "Pousada", "Airbnb", "Resort"] },
  { value: "outros", label: "📦 Outros", suggestions: ["Compras", "Farmácia", "Supermercado", "Presente"] }
];

export const ExpenseForm = ({ people, onAddExpense }: ExpenseFormProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [category, setCategory] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d,.-]/g, '').replace(',', '.');
    const number = parseFloat(numericValue);
    return isNaN(number) ? '' : number.toString();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatCurrency(value);
    setAmount(formatted);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!description.trim() || description.trim().length < 3) {
      newErrors.description = "Descrição deve ter pelo menos 3 caracteres";
    }
    
    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0.01) {
      newErrors.amount = "Valor deve ser maior que R$ 0,01";
    }
    
    if (!paidBy) {
      newErrors.paidBy = "Selecione quem pagou";
    }
    
    if (!category) {
      newErrors.category = "Selecione uma categoria";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onAddExpense({
      description: description.trim(),
      amount: parseFloat(amount),
      paidBy,
      category
    });
    
    // Reset form
    setDescription("");
    setAmount("");
    setPaidBy("");
    setCategory("");
    setErrors({});
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setDescription(suggestion);
    setShowSuggestions(false);
  };

  const selectedCategory = categories.find(cat => cat.value === category);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Novo Gasto</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select value={category} onValueChange={(value) => {
            setCategory(value);
            setShowSuggestions(true);
          }}>
            <SelectTrigger className={errors.category ? "border-red-500" : ""}>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <Label htmlFor="description">Descrição do Gasto</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: João, Maria, Carlos..."
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          
          {showSuggestions && selectedCategory && (
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-500">Sugestões:</p>
              <div className="flex flex-wrap gap-1">
                {selectedCategory.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="amount">Valor (R$)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0,00"
              className={`pl-10 ${errors.amount ? "border-red-500" : ""}`}
            />
          </div>
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
        </div>

        <div>
          <Label htmlFor="paidBy">Quem Pagou?</Label>
          <Select value={paidBy} onValueChange={setPaidBy}>
            <SelectTrigger className={errors.paidBy ? "border-red-500" : ""}>
              <SelectValue placeholder="Selecione quem pagou" />
            </SelectTrigger>
            <SelectContent>
              {people.map((person) => (
                <SelectItem key={person.id} value={person.name}>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${person.color}`}></div>
                    {person.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.paidBy && <p className="text-red-500 text-sm mt-1">{errors.paidBy}</p>}
        </div>

        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Gasto
        </Button>
      </form>
    </div>
  );
};
