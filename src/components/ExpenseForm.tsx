
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Expense } from "@/types/expense";

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id' | 'date'>) => void;
  onCancel: () => void;
}

const categories = [
  "Alimentação",
  "Transporte", 
  "Hospedagem",
  "Entretenimento",
  "Compras",
  "Outros"
];

const defaultPeople = ["Você", "Ana", "Bruno", "Carlos", "Diana"];

export const ExpenseForm = ({ onSubmit, onCancel }: ExpenseFormProps) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitBetween, setSplitBetween] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !amount || !paidBy || splitBetween.length === 0 || !category) {
      return;
    }

    onSubmit({
      title,
      amount: parseFloat(amount),
      paidBy,
      splitBetween,
      category,
      description,
    });

    // Reset form
    setTitle("");
    setAmount("");
    setPaidBy("");
    setSplitBetween([]);
    setCategory("");
    setDescription("");
  };

  const togglePerson = (person: string) => {
    setSplitBetween(prev => 
      prev.includes(person) 
        ? prev.filter(p => p !== person)
        : [...prev, person]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Descrição da Despesa</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Jantar no restaurante"
          required
        />
      </div>

      <div>
        <Label htmlFor="amount">Valor (R$)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0,00"
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
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
        <Label htmlFor="paidBy">Pago por</Label>
        <Select value={paidBy} onValueChange={setPaidBy} required>
          <SelectTrigger>
            <SelectValue placeholder="Quem pagou?" />
          </SelectTrigger>
          <SelectContent>
            {defaultPeople.map((person) => (
              <SelectItem key={person} value={person}>
                {person}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Dividir entre:</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {defaultPeople.map((person) => (
            <button
              key={person}
              type="button"
              onClick={() => togglePerson(person)}
              className={`p-2 rounded-lg border text-sm transition-all ${
                splitBetween.includes(person)
                  ? "bg-emerald-100 border-emerald-300 text-emerald-700"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {person}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Observações (opcional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalhes adicionais..."
          rows={2}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
          Adicionar Despesa
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};
