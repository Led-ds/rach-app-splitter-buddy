
import { ExpenseModel, ExpenseCreateRequest } from '../models/expense.model';
import { PersonModel } from '../models/person.model';
import { SplitTemplateModel } from '../models/split.model';
import { expenseService } from '../services/expense.service';

export class ExpenseManagementViewModel {
  private _expenses: ExpenseModel[] = [];
  private _people: PersonModel[] = [];
  private _template: SplitTemplateModel | null = null;
  private _onContinue?: (expenses: ExpenseModel[]) => void;
  private _isLoading = false;

  // Getters
  get expenses(): ExpenseModel[] { return this._expenses; }
  get people(): PersonModel[] { return this._people; }
  get template(): SplitTemplateModel | null { return this._template; }
  get isLoading(): boolean { return this._isLoading; }
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
    this.loadExpenses();
  }

  private async loadExpenses(): Promise<void> {
    try {
      this._isLoading = true;
      this._expenses = await expenseService.getAllExpenses();
    } catch (error) {
      console.error('Erro ao carregar gastos:', error);
      // Fallback para array vazio se falhar
      this._expenses = [];
    } finally {
      this._isLoading = false;
    }
  }

  async addExpense(expense: ExpenseModel): Promise<void> {
    try {
      this._isLoading = true;
      const expenseRequest: ExpenseCreateRequest = {
        description: expense.description,
        amount: expense.amount,
        paidBy: expense.paidBy,
        category: expense.category,
        date: expense.date
      };

      const savedExpense = await expenseService.createExpense(expenseRequest);
      this._expenses = [...this._expenses, savedExpense];
    } catch (error) {
      console.error('Erro ao adicionar gasto:', error);
      throw error;
    } finally {
      this._isLoading = false;
    }
  }

  async deleteExpense(id: string): Promise<void> {
    try {
      this._isLoading = true;
      await expenseService.deleteExpense(id);
      this._expenses = this._expenses.filter(expense => expense.id !== id);
    } catch (error) {
      console.error('Erro ao deletar gasto:', error);
      throw error;
    } finally {
      this._isLoading = false;
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
