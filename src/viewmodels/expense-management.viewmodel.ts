
import { ExpenseModel } from '../models/expense.model';
import { PersonModel } from '../models/person.model';
import { SplitTemplateModel } from '../models/split.model';
import { expenseService } from '../services/expense.service';

export class ExpenseManagementViewModel {
  private _expenses: ExpenseModel[] = [];
  private _people: PersonModel[] = [];
  private _template: SplitTemplateModel | null = null;
  private _onContinue?: (expenses: ExpenseModel[]) => void;

  // Getters
  get expenses(): ExpenseModel[] { return this._expenses; }
  get people(): PersonModel[] { return this._people; }
  get template(): SplitTemplateModel | null { return this._template; }
  get totalAmount(): number {
    return this._expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  constructor(
    people: PersonModel[],
    onContinue?: (expenses: ExpenseModel[]) => void,
    template?: SplitTemplateModel | null
  ) {
    this._people = people;
    this._onContinue = onContinue;
    this._template = template;
  }

  async addExpense(expense: ExpenseModel): Promise<void> {
    try {
      // Em um cenário real, chamaríamos o serviço
      // const savedExpense = await expenseService.createExpense(expense);
      
      this._expenses = [...this._expenses, expense];
    } catch (error) {
      console.error('Erro ao adicionar gasto:', error);
      throw error;
    }
  }

  async deleteExpense(id: string): Promise<void> {
    try {
      // Em um cenário real, chamaríamos o serviço
      // await expenseService.deleteExpense(id);
      
      this._expenses = this._expenses.filter(expense => expense.id !== id);
    } catch (error) {
      console.error('Erro ao deletar gasto:', error);
      throw error;
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }

  canContinue(): boolean {
    return this._expenses.length > 0;
  }

  continue(): void {
    this._onContinue?.(this._expenses);
  }

  getExpensesByCategory(): Record<string, ExpenseModel[]> {
    return this._expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = [];
      }
      acc[expense.category].push(expense);
      return acc;
    }, {} as Record<string, ExpenseModel[]>);
  }

  getExpensesByPerson(): Record<string, ExpenseModel[]> {
    return this._expenses.reduce((acc, expense) => {
      if (!acc[expense.paidBy]) {
        acc[expense.paidBy] = [];
      }
      acc[expense.paidBy].push(expense);
      return acc;
    }, {} as Record<string, ExpenseModel[]>);
  }
}
