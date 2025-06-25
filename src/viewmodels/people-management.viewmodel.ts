
import { PersonModel, PersonCreateRequest } from '../models/person.model';
import { SplitTemplateModel } from '../models/split.model';
import { personService } from '../services/person.service';
import { generateAvatarURL } from '@/lib/avatar';

export class PeopleManagementViewModel {
  private _newPersonName = '';
  private _people: PersonModel[] = [];
  private _selectedPersonId: string | null = null;
  private _template: SplitTemplateModel | null = null;
  private _onContinue?: (people: PersonModel[]) => void;

  // Getters
  get newPersonName(): string { return this._newPersonName; }
  get people(): PersonModel[] { return this._people; }
  get selectedPersonId(): string | null { return this._selectedPersonId; }
  get template(): SplitTemplateModel | null { return this._template; }

  // Setters
  set newPersonName(value: string) { this._newPersonName = value; }
  set selectedPersonId(value: string | null) { this._selectedPersonId = value; }

  constructor(
    onContinue?: (people: PersonModel[]) => void,
    template?: SplitTemplateModel | null
  ) {
    this._onContinue = onContinue;
    this._template = template;
  }

  async addPerson(): Promise<void> {
    if (!this._newPersonName.trim()) return;

    try {
      const personRequest: PersonCreateRequest = {
        name: this._newPersonName.trim(),
        color: this.getRandomColor()
      };

      // Em um cenário real, chamaríamos o serviço
      // const newPerson = await personService.createPerson(personRequest);
      
      // Por enquanto, criamos localmente
      const newPerson: PersonModel = {
        id: crypto.randomUUID(),
        ...personRequest
      };

      this._people = [...this._people, newPerson];
      this._newPersonName = '';
    } catch (error) {
      console.error('Erro ao adicionar pessoa:', error);
      throw error;
    }
  }

  async removePerson(id: string): Promise<void> {
    try {
      // Em um cenário real, chamaríamos o serviço
      // await personService.deletePerson(id);
      
      this._people = this._people.filter(person => person.id !== id);
      this._selectedPersonId = null;
    } catch (error) {
      console.error('Erro ao remover pessoa:', error);
      throw error;
    }
  }

  selectPerson(personId: string): void {
    this._selectedPersonId = personId;
  }

  getPersonAvatarUrl(name: string): string {
    return generateAvatarURL(name);
  }

  canContinue(): boolean {
    return this._people.length > 0;
  }

  continue(): void {
    if (!this.canContinue()) {
      throw new Error("Adicione pelo menos uma pessoa para continuar.");
    }
    
    this._onContinue?.(this._people);
  }

  private getRandomColor(): string {
    const colors = ["bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  reset(): void {
    if (this._template?.defaultExpenses) {
      this._newPersonName = '';
      this._people = [];
      this._selectedPersonId = null;
    }
  }
}
