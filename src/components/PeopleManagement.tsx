
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Trash2 } from "lucide-react";
import { Person } from "@/types/person";
import { generateAvatarURL } from "@/lib/avatar";
import { SplitTemplate } from "@/types/history";

interface PeopleManagementProps {
  onContinue: (people: Person[]) => void;  // Callback quando usuário clica em continuar
  onBack: () => void;                      // Callback para voltar ao passo anterior
  template?: SplitTemplate | null;         // Template selecionado (opcional)
}

/**
 * Componente PeopleManagement - Gerenciamento de pessoas participantes
 * Permite adicionar, remover e visualizar pessoas que vão participar do split
 */
export const PeopleManagement = ({ onContinue, onBack, template }: PeopleManagementProps) => {
  const [newPersonName, setNewPersonName] = useState("");           // Nome da nova pessoa
  const [people, setPeople] = useState<Person[]>([]);              // Lista de pessoas
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null); // Pessoa selecionada

  // Reset do estado quando template muda
  useEffect(() => {
    if (template?.defaultExpenses) {
      setNewPersonName("");
      setPeople([]);
      setSelectedPersonId(null);
    }
  }, [template]);

  // Adiciona nova pessoa à lista
  const handleAddPerson = () => {
    if (newPersonName.trim() !== "") {
      const newPerson: Person = {
        id: crypto.randomUUID(),        // ID único
        name: newPersonName.trim(),     // Nome sem espaços extras
        color: getRandomColor(),        // Cor aleatória para identificação visual
      };
      setPeople([...people, newPerson]);
      setNewPersonName("");             // Limpa o campo de input
    }
  };

  // Remove pessoa da lista
  const handleRemovePerson = (id: string) => {
    setPeople(people.filter((person) => person.id !== id));
    setSelectedPersonId(null);          // Deseleciona pessoa removida
  };

  // Seleciona pessoa para possível remoção
  const handlePersonClick = (person: Person) => {
    setSelectedPersonId(person.id);
  };

  // Gera cor aleatória para avatar da pessoa
  const getRandomColor = () => {
    const colors = ["bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Continua para próximo passo se há pessoas adicionadas
  const handleContinue = () => {
    if (people.length > 0) {
      onContinue(people);
    } else {
      alert("Adicione pelo menos uma pessoa para continuar.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com título dinâmico baseado no template */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {template ? `${template.icon} ${template.name}` : 'Adicionar Pessoas'}
        </h2>
        <p className="text-gray-600">
          {template ? `Quem vai participar do ${template.name.toLowerCase()}?` : 'Adicione as pessoas que vão participar do split'}
        </p>
      </div>

      {/* Formulário para adicionar pessoas */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Nome da pessoa"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
            />
            <Button onClick={handleAddPerson}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>

          {/* Grid de pessoas adicionadas */}
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {people.map((person) => (
              <button
                key={person.id}
                onClick={() => handlePersonClick(person)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                  selectedPersonId === person.id ? 'border-2 border-blue-500' : 'border-gray-200'
                } hover:shadow-md transition-shadow`}
              >
                {/* Avatar da pessoa */}
                <Avatar>
                  <AvatarImage src={generateAvatarURL(person.name)} />
                  <AvatarFallback>{person.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="mt-2 text-sm font-medium text-gray-700">{person.name}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botão para remover pessoa selecionada */}
      {selectedPersonId && (
        <Button
          variant="destructive"
          onClick={() => handleRemovePerson(selectedPersonId)}
          className="w-full flex items-center justify-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Remover Pessoa
        </Button>
      )}

      {/* Navegação entre passos */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="w-1/2">
          Voltar
        </Button>
        <Button onClick={handleContinue} className="w-1/2">
          Continuar
        </Button>
      </div>
    </div>
  );
};
