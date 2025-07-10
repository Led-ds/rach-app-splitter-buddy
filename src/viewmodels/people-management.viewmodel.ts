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
      console.log('🔄 Carregando pessoas do backend...');
      
      const result = await personService.getAllPeople();
      console.log('✅ Resposta do backend:', result);
      
      // Garantir que sempre temos um array, mesmo se o backend retornar null/undefined
      this._people = Array.isArray(result) ? result : [];
      console.log('📋 Pessoas carregadas:', this._people.length);
      
    } catch (error) {
      console.error('❌ Erro ao carregar pessoas:', error);
      // Em caso de erro, inicializar com array vazio
      this._people = [];
    } finally {
      this._isLoading = false;
      console.log('✨ Loading finalizado. IsLoading:', this._isLoading);
    }
  }

  async addPerson(): Promise<void> {
    if (!this._newPersonName.trim()) {
      console.log('⚠️ Nome vazio, cancelando adição');
      return;
    }

    try {
      this._isLoading = true;
      console.log('🔄 Adicionando pessoa:', this._newPersonName);
      
      const personRequest: PersonCreateRequest = {
        name: this._newPersonName.trim(),
        color: this.getRandomColor()
      };

      console.log('📋 Dados sendo enviados para o backend:', personRequest);
      console.log('🌐 URL do endpoint:', '/people');
      
      const newPerson = await personService.createPerson(personRequest);
      console.log('✅ Pessoa criada:', newPerson);
      
      this._people = [...this._people, newPerson];
      this._newPersonName = '';
      console.log('📋 Total de pessoas agora:', this._people.length);
      
    } catch (error) {
      console.error('❌ Erro ao adicionar pessoa:', error);
      console.error('📝 Detalhes do erro:', {
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : null,
        dados: {
          nome: this._newPersonName.trim(),
          cor: this.getRandomColor()
        }
      });
      throw error;
    } finally {
      this._isLoading = false;
      console.log('✨ Loading finalizado após adicionar');
    }
  }

  async removePerson(id: string): Promise<void> {
    try {
      this._isLoading = true;
      console.log('🔄 Removendo pessoa:', id);
      
      await personService.deletePerson(id);
      console.log('✅ Pessoa removida do backend');
      
      this._people = this._people.filter(person => person.id !== id);
      this._selectedPersonId = null;
      console.log('📋 Total de pessoas agora:', this._people.length);
      
    } catch (error) {
      console.error('❌ Erro ao remover pessoa:', error);
      throw error;
    } finally {
      this._isLoading = false;
      console.log('✨ Loading finalizado após remover');
    }
  }

  selectPerson(personId: string): void {
    console.log('👆 Pessoa selecionada:', personId);
    this._selectedPersonId = personId;
  }

  getPersonAvatarUrl(name: string): string {
    return generateAvatarURL(name);
  }

  canContinue(): boolean {
    const canContinue = this._people.length > 0;
    console.log('🤔 Pode continuar?', canContinue, '(pessoas:', this._people.length, ')');
    return canContinue;
  }

  continue(): void {
    console.log('➡️ Tentando continuar...');
    if (!this.canContinue()) {
      console.log('❌ Não pode continuar - sem pessoas');
      throw new Error("Adicione pelo menos uma pessoa para continuar.");
    }
    
    console.log('✅ Continuando com', this._people.length, 'pessoas');
    this._onContinue?.(this._people);
  }

  private getRandomColor(): string {
    // Retorna códigos hexadecimais válidos que o backend espera
    const colors = ["#EF4444", "#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  reset(): void {
    this._newPersonName = '';
    this._people = [];
    this._selectedPersonId = null;
    this._isLoading = false;
  }
}
