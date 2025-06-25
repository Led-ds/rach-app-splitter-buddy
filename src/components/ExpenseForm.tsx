
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { Expense } from "@/types/expense";
import { Person } from "@/types/person";
import { SplitTemplate } from "@/types/history";

interface ExpenseFormProps {
  people: Person[];
  onAddExpense: (expense: Expense) => void;
  template?: SplitTemplate | null;
}

export const ExpenseForm = ({ people, onAddExpense, template }: ExpenseFormProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(people.length > 0 ? people[0].name : "");
  const [category, setCategory] = useState("Comida");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const categories = ["Comida", "Transporte", "Hospedagem", "Entretenimento", "Outros"];

  useEffect(() => {
    if (template?.defaultExpenses) {
      const initialExpense = template.defaultExpenses[0];
      if (initialExpense) {
        setDescription(initialExpense.description);
        setCategory(initialExpense.category);
      }
    }
  }, [template]);

  const handleAddExpense = () => {
    if (!description || !amount || !paidBy || !category || !date) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description,
      amount: parseFloat(amount),
      paidBy,
      category,
      date,
    };

    onAddExpense(newExpense);
    setDescription("");
    setAmount("");
  };

  const getSuggestions = (category: string): string[] => {
    if (template?.defaultExpenses) {
      return template.defaultExpenses
        .filter(expense => expense.category === category)
        .map(expense => expense.description);
    }

    switch (category) {
      case "Comida":
        return ["Almoço", "Jantar", "Lanche", "Supermercado"];
      case "Transporte":
        return ["Uber", "Gasolina", "Ônibus", "Estacionamento"];
      case "Hospedagem":
        return ["Hotel", "Airbnb", "Hostel"];
      case "Entretenimento":
        return ["Cinema", "Show", "Bar", "Festa"];
      case "Outros":
        return ["Presente", "Taxa", "Multa"];
      default:
        return [];
    }
  };

  useEffect(() => {
    setSuggestions(getSuggestions(category));
  }, [category]);

  return (
    <Card>
      <CardContent className="grid gap-4">
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Input
            type="text"
            id="description"
            placeholder="Ex: Jantar com a equipe"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {suggestions.length > 0 && (
            <div className="flex gap-2 mt-2">
              {suggestions.map((suggestion) => (
                <Badge
                  key={suggestion}
                  className="cursor-pointer"
                  onClick={() => setDescription(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="amount">Valor</Label>
          <Input
            type="number"
            id="amount"
            placeholder="Ex: 50.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="paidBy">Pago por</Label>
          <Select value={paidBy} onValueChange={setPaidBy}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {people.map((person) => (
                <SelectItem key={person.id} value={person.name}>
                  {person.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="date">Data</Label>
          <Input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <Button onClick={handleAddExpense}>Adicionar Gasto</Button>
      </CardContent>
    </Card>
  );
};
