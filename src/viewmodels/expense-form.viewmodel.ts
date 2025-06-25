
import { ExpenseModel, ExpenseCreateRequest } from '../models/expense.model';
import { PersonModel } from '../models/person.model';
import { SplitTemplateModel } from '../models/split.model';
import { expenseService } from '../services/expense.service';

export class ExpenseFormViewModel {
  private _description = '';
  private _amount = '';
  private _paidBy = '';
  private _category = 'Comida';
  private _date = new Date().toISOString().split('T')[0];
  private _people: PersonModel[] = [];
  private _template: SplitTemplateModel | null = null;
  private _suggestions: string[] = [];
  private _onAddExpense?: (expense: ExpenseModel) => void;

  // Getters
  get description(): string { return this._description; }
  get amount(): string { return this._amount; }
  get paidBy(): string { return this._paidBy; }
  get category(): string { return this._category; }
  get date(): string { return this._date; }
  get people(): PersonModel[] { return this._people; }
  get template(): SplitTemplateModel | null { return this._template; }
  get suggestions(): string[] { return this._suggestions; }

  // Setters
  set description(value: string) { this._description = value; }
  set amount(value: string) { this._amount = value; }
  set paidBy(value: string) { this._paidBy = value; }
  set category(value: string) { 
    this._category = value;
    this.updateSuggestions();
  }
  set date(value: string) { this._date = value; }

  constructor(
    people: PersonModel[], 
    onAddExpense?: (expense: ExpenseModel) => void,
    template?: SplitTemplateModel | null
  ) {
    this._people = people;
    this._onAddExpense = onAddExpense;
    this._template = template;
    
    if (people.length > 0) {
      this._paidBy = people[0].name;
    }

    this.initializeFromTemplate();
    this.updateSuggestions();
  }

  private initializeFromTemplate(): void {
    if (this._template?.defaultExpenses && this._template.defaultExpenses.length > 0) {
      const initialExpense = this._template.defaultExpenses[0];
      this._description = initialExpense.description;
      this._category = initialExpense.category;
    }
  }

  private updateSuggestions(): void {
    if (this._template?.defaultExpenses) {
      this._suggestions = this._template.defaultExpenses
        .filter(expense => expense.category === this._category)
        .map(expense => expense.description);
    } else {
      this._suggestions = this.getDefaultSuggestions(this._category);
    }
  }

  private getDefaultSuggestions(category: string): string[] {
    const defaultSuggestions: Record<string, string[]> = {
      "Comida": ["Almoço", "Jantar", "Lanche", "Supermercado"],
      "Transporte": ["Uber", "Gasolina", "Ônibus", "Estacionamento"],
      "Hospedagem": ["Hotel", "Airbnb", "Hostel"],
      "Entretenimento": ["Cinema", "Show", "Bar", "Festa"],
      "Outros": ["Presente", "Taxa", "Multa"]
    };
    
    return defaultSuggestions[category] || [];
  }

  selectSuggestion(suggestion: string): void {
    this._description = suggestion;
  }

  async addExpense(): Promise<void> {
    if (!this.isValid()) {
      throw new Error("Por favor, preencha todos os campos.");
    }

    try {
      const expenseRequest: ExpenseCreateRequest = {
        description: this._description,
        amount: parseFloat(this._amount),
        paidBy: this._paidBy,
        category: this._category,
        date: this._date
      };

      // Em um cenário real, chamaríamos o serviço
      // const newExpense = await expenseService.createExpense(expenseRequest);
      
      // Por enquanto, criamos localmente
      const newExpense: ExpenseModel = {
        id: crypto.randomUUID(),
        ...expenseRequest
      };

      this._onAddExpense?.(newExpense);
      this.reset();
    } catch (error) {
      console.error('Erro ao adicionar gasto:', error);
      throw error;
    }
  }

  private isValid(): boolean {
    return !!(this._description && this._amount && this._paidBy && this._category && this._date);
  }

  private reset(): void {
    this._description = '';
    this._amount = '';
    // Mantém paidBy, category e date
  }
}
