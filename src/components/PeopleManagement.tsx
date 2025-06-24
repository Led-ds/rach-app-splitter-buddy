
import { useState } from "react";
import { Plus, X, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Person {
  id: string;
  name: string;
  color: string;
}

interface PeopleManagementProps {
  onContinue: (people: Person[]) => void;
  onBack: () => void;
}

const PERSON_COLORS = [
  "bg-red-500",
  "bg-blue-500", 
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-lime-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-amber-500"
];

export const PeopleManagement = ({ onContinue, onBack }: PeopleManagementProps) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [newPersonName, setNewPersonName] = useState("");
  const [error, setError] = useState("");

  const addPerson = () => {
    const trimmedName = newPersonName.trim();
    
    // Validações
    if (!trimmedName) {
      setError("Nome não pode estar vazio");
      return;
    }

    if (people.some(person => person.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError("Este nome já foi adicionado");
      return;
    }

    if (people.length >= 15) {
      setError("Máximo 15 pessoas por grupo");
      return;
    }

    // Adicionar pessoa
    const newPerson: Person = {
      id: Date.now().toString(),
      name: trimmedName,
      color: PERSON_COLORS[people.length % PERSON_COLORS.length]
    };

    setPeople(prev => [...prev, newPerson]);
    setNewPersonName("");
    setError("");
  };

  const removePerson = (id: string) => {
    setPeople(prev => prev.filter(person => person.id !== id));
    setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPerson();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Monte seu grupo</h2>
        <p className="text-gray-600">Adicione as pessoas que vão participar do racha</p>
      </div>

      {/* Add Person Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Ex: João, Maria, Carlos..."
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={addPerson}
              className="bg-green-500 hover:bg-green-600"
              disabled={people.length >= 15}
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </div>

          {error && (
            <div className="text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Counter */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {people.length === 0 ? "Nenhuma pessoa ainda" : 
               people.length === 1 ? "1 pessoa no grupo" : 
               `${people.length} pessoas no grupo`}
            </span>
            <span>Máximo: 15 pessoas</span>
          </div>
        </div>
      </div>

      {/* People List */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        {people.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Adicione as pessoas do grupo
            </h3>
            <p className="text-gray-500">
              Você precisa de pelo menos 2 pessoas para continuar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 mb-4">Pessoas no grupo:</h3>
            <div className="grid gap-3">
              {people.map((person, index) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={`${person.color} text-white font-semibold`}>
                        {getInitials(person.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-gray-900">{person.name}</span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePerson(person.id)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Voltar
        </Button>
        
        <Button
          onClick={() => onContinue(people)}
          disabled={people.length < 2}
          className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
        >
          Continuar
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
