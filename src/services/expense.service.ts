
import { apiClient } from './api.config';
import { ExpenseModel, ExpenseCreateRequest, ExpenseUpdateRequest } from '../models/expense.model';

export class ExpenseService {
  private endpoint = '/expenses';

  async getAllExpenses(): Promise<ExpenseModel[]> {
    try {
      console.log('🌐 ExpenseService - Buscando todos os expenses...');
      const result = await apiClient.get<ExpenseModel[]>(this.endpoint);
      console.log('🌐 ExpenseService - Resultado da API:', result);
      
      // Se a API retornar undefined/null, retorna array vazio
      if (!result || !Array.isArray(result)) {
        console.log('⚠️ ExpenseService - API retornou dados inválidos, usando array vazio');
        return [];
      }
      
      return result;
    } catch (error) {
      console.error('❌ ExpenseService - Erro ao buscar expenses:', error);
      return [];
    }
  }

  async getExpenseById(id: string): Promise<ExpenseModel> {
    console.log('🌐 ExpenseService - Buscando expense por ID:', id);
    return apiClient.get<ExpenseModel>(`${this.endpoint}/${id}`);
  }

  async createExpense(expense: ExpenseCreateRequest): Promise<ExpenseModel> {
    try {
      console.log('🌐 ExpenseService - Criando expense:', expense);
      const result = await apiClient.post<ExpenseModel>(this.endpoint, expense);
      console.log('🌐 ExpenseService - Expense criado:', result);
      return result;
    } catch (error) {
      console.error('❌ ExpenseService - Erro ao criar expense:', error);
      throw error;
    }
  }

  async updateExpense(expense: ExpenseUpdateRequest): Promise<ExpenseModel> {
    console.log('🌐 ExpenseService - Atualizando expense:', expense);
    return apiClient.put<ExpenseModel>(`${this.endpoint}/${expense.id}`, expense);
  }

  async deleteExpense(id: string): Promise<void> {
    try {
      console.log('🌐 ExpenseService - Deletando expense ID:', id);
      await apiClient.delete<void>(`${this.endpoint}/${id}`);
      console.log('🌐 ExpenseService - Expense deletado com sucesso');
    } catch (error) {
      console.error('❌ ExpenseService - Erro ao deletar expense:', error);
      throw error;
    }
  }

  async getExpensesByDateRange(startDate: string, endDate: string): Promise<ExpenseModel[]> {
    return apiClient.get<ExpenseModel[]>(`${this.endpoint}/date-range?start=${startDate}&end=${endDate}`);
  }

  async getExpensesByCategory(category: string): Promise<ExpenseModel[]> {
    return apiClient.get<ExpenseModel[]>(`${this.endpoint}/category/${category}`);
  }
}

export const expenseService = new ExpenseService();
