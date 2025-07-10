
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
  get expenses(): ExpenseModel[] { 
    // Filtra expenses válidos para evitar dados corrompidos
    return this._expenses.filter(expense => 
      expense && 
      expense.id && 
      expense.description && 
      typeof expense.amount === 'number' && 
      !isNaN(expense.amount) &&
      expense.paidBy &&
      expense.category
    );
  }
  get people(): PersonModel[] { return this._people; }
  get template(): SplitTemplateModel | null { return this._template; }
  get isLoading(): boolean { return this._isLoading; }
  get totalAmount(): number {
    return this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
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
      console.log('🔄 Carregando expenses do serviço...');
      const loadedExpenses = await expenseService.getAllExpenses();
      console.log('🔄 Expenses carregados:', loadedExpenses);
      
      // Filtra apenas expenses válidos
      this._expenses = loadedExpenses.filter(expense => 
        expense && 
        expense.id && 
        expense.description && 
        typeof expense.amount === 'number' && 
        !isNaN(expense.amount)
      );
      
      console.log('🔄 Expenses filtrados:', this._expenses);
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
      console.log('➕ ViewModel - Adicionando expense:', expense);
      
      // Validação antes de enviar
      if (!expense.description || !expense.amount || !expense.paidBy || !expense.category) {
        throw new Error('Dados do gasto incompletos');
      }

      const expenseRequest: ExpenseCreateRequest = {
        description: expense.description,
        amount: expense.amount,
        paidBy: expense.paidBy,
        category: expense.category,
        date: expense.date
      };

      console.log('➕ ViewModel - Enviando para serviço:', expenseRequest);
      const savedExpense = await expenseService.createExpense(expenseRequest);
      console.log('➕ ViewModel - Expense salvo:', savedExpense);
      
      // Apenas adiciona se o expense salvo é válido
      if (savedExpense && savedExpense.id && savedExpense.description) {
        this._expenses = [...this._expenses, savedExpense];
        console.log('➕ ViewModel - Lista atualizada:', this._expenses);
      } else {
        console.error('⚠️ Expense salvo é inválido:', savedExpense);
      }
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
      console.log('🗑️ ViewModel - Deletando expense ID:', id);
      await expenseService.deleteExpense(id);
      this._expenses = this._expenses.filter(expense => expense.id !== id);
      console.log('🗑️ ViewModel - Lista após deletar:', this._expenses);
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
    return this.expenses.length > 0;
  }

  continue(): void {
    this._onContinue?.(this.expenses);
  }

  getExpensesByCategory(): Record<string, ExpenseModel[]> {
    return this.expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = [];
      }
      acc[expense.category].push(expense);
      return acc;
    }, {} as Record<string, ExpenseModel[]>);
  }

  getExpensesByPerson(): Record<string, ExpenseModel[]> {
    return this.expenses.reduce((acc, expense) => {
      if (!acc[expense.paidBy]) {
        acc[expense.paidBy] = [];
      }
      acc[expense.paidBy].push(expense);
      return acc;
    }, {} as Record<string, ExpenseModel[]>);
  }

  // Método para limpar dados inválidos (pode ser chamado quando necessário)
  cleanInvalidExpenses(): void {
    const validExpenses = this._expenses.filter(expense => 
      expense && 
      expense.id && 
      expense.description && 
      typeof expense.amount === 'number' && 
      !isNaN(expense.amount)
    );
    
    if (validExpenses.length !== this._expenses.length) {
      console.log(`🧹 Limpando ${this._expenses.length - validExpenses.length} expenses inválidos`);
      this._expenses = validExpenses;
    }
  }
}
