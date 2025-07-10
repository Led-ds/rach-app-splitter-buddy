
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Trash2 } from "lucide-react";
import { Person } from "@/types/person";
import { SplitTemplate } from "@/types/history";
import { PeopleManagementViewModel } from "../viewmodels/people-management.viewmodel";
import { useToast } from "@/hooks/use-toast";

interface PeopleManagementProps {
  onContinue: (people: Person[]) => void;
  onBack: () => void;
  template?: SplitTemplate | null;
}

export const PeopleManagement = ({ onContinue, onBack, template }: PeopleManagementProps) => {
  const { toast } = useToast();
  
  const [viewModel] = useState(() => new PeopleManagementViewModel(
    (people) => onContinue(people.map(p => ({
      id: p.id,
      name: p.name,
      color: p.color
    }))),
    template ? {
      id: template.id,
      name: template.name,
      description: template.description,
      icon: template.icon,
      defaultExpenses: template.defaultExpenses
    } : null
  ));

  const [people, setPeople] = useState<Person[]>([]);
  const [newPersonName, setNewPersonName] = useState("");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Sincroniza o estado local com o ViewModel
    const mappedPeople = viewModel.people.map(p => ({
      id: p.id,
      name: p.name,
      color: p.color
    }));
    setPeople(mappedPeople);
    setNewPersonName(viewModel.newPersonName);
    setSelectedPersonId(viewModel.selectedPersonId);
    setIsLoading(viewModel.isLoading);
  }, [viewModel.people, viewModel.newPersonName, viewModel.selectedPersonId, viewModel.isLoading]);

  const handleAddPerson = async () => {
    if (newPersonName.trim() !== "") {
      try {
        viewModel.newPersonName = newPersonName.trim();
        await viewModel.addPerson();
        
        toast({
          title: "Pessoa adicionada",
          description: `${newPersonName} foi adicionado com sucesso.`
        });
      } catch (error) {
        console.error('Erro ao adicionar pessoa:', error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar a pessoa. Tente novamente.",
          variant: "destructive"
        });
      }
    }
  };

  const handleRemovePerson = async (id: string) => {
    try {
      await viewModel.removePerson(id);
      toast({
        title: "Pessoa removida",
        description: "A pessoa foi removida com sucesso."
      });
    } catch (error) {
      console.error('Erro ao remover pessoa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a pessoa. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handlePersonClick = (person: Person) => {
    viewModel.selectPerson(person.id);
  };

  const handleContinue = () => {
    try {
      viewModel.continue();
    } catch (error) {
      toast({
        title: "Atenção",
        description: "Adicione pelo menos uma pessoa para continuar.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {template ? `${template.icon} ${template.name}` : 'Adicionar Pessoas'}
        </h2>
        <p className="text-gray-600">
          {template ? `Quem vai participar do ${template.name.toLowerCase()}?` : 'Adicione as pessoas que vão participar do split'}
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Nome da pessoa"
              value={newPersonName}
              onChange={(e) => {
                setNewPersonName(e.target.value);
                viewModel.newPersonName = e.target.value;
              }}
              disabled={isLoading}
            />
            <Button onClick={handleAddPerson} disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              {isLoading ? "Adicionando..." : "Adicionar"}
            </Button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {people.map((person) => (
              <button
                key={person.id}
                onClick={() => handlePersonClick(person)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                  selectedPersonId === person.id ? 'border-2 border-blue-500' : 'border-gray-200'
                } hover:shadow-md transition-shadow`}
                disabled={isLoading}
              >
                <Avatar>
                  <AvatarImage src={viewModel.getPersonAvatarUrl(person.name)} />
                  <AvatarFallback>{person.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="mt-2 text-sm font-medium text-gray-700">{person.name}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedPersonId && (
        <Button
          variant="destructive"
          onClick={() => handleRemovePerson(selectedPersonId)}
          className="w-full flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4" />
          {isLoading ? "Removendo..." : "Remover Pessoa"}
        </Button>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="w-1/2" disabled={isLoading}>
          Voltar
        </Button>
        <Button onClick={handleContinue} className="w-1/2" disabled={isLoading || !viewModel.canContinue()}>
          {isLoading ? "Carregando..." : "Continuar"}
        </Button>
      </div>
    </div>
  );
};
