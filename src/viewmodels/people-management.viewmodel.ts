
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
  private _isLoading = false;

  // Getters
  get newPersonName(): string { return this._newPersonName; }
  get people(): PersonModel[] { return this._people; }
  get selectedPersonId(): string | null { return this._selectedPersonId; }
  get template(): SplitTemplateModel | null { return this._template; }
  get isLoading(): boolean { return this._isLoading; }

  // Setters
  set newPersonName(value: string) { this._newPersonName = value; }
  set selectedPersonId(value: string | null) { this._selectedPersonId = value; }

  constructor(
    onContinue?: (people: PersonModel[]) => void,
    template?: SplitTemplateModel | null
  ) {
    this._onContinue = onContinue;
    this._template = template;
    this.loadPeople();
  }

  private async loadPeople(): Promise<void> {
    try {
      this._isLoading = true;
      this._people = await personService.getAllPeople();
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
      this._people = [];
    } finally {
      this._isLoading = false;
    }
  }

  async addPerson(): Promise<void> {
    if (!this._newPersonName.trim()) return;

    try {
      this._isLoading = true;
      const personRequest: PersonCreateRequest = {
        name: this._newPersonName.trim(),
        color: this.getRandomColor()
      };

      const newPerson = await personService.createPerson(personRequest);
      this._people = [...this._people, newPerson];
      this._newPersonName = '';
    } catch (error) {
      console.error('Erro ao adicionar pessoa:', error);
      throw error;
    } finally {
      this._isLoading = false;
    }
  }

  async removePerson(id: string): Promise<void> {
    try {
      this._isLoading = true;
      await personService.deletePerson(id);
      this._people = this._people.filter(person => person.id !== id);
      this._selectedPersonId = null;
    } catch (error) {
      console.error('Erro ao remover pessoa:', error);
      throw error;
    } finally {
      this._isLoading = false;
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
