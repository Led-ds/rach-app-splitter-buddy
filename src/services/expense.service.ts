
import { apiClient } from './api.config';
import { ExpenseModel, ExpenseCreateRequest, ExpenseUpdateRequest } from '../models/expense.model';

export class ExpenseService {
  private endpoint = '/expenses';

  async getAllExpenses(): Promise<ExpenseModel[]> {
    return apiClient.get<ExpenseModel[]>(this.endpoint);
  }

  async getExpenseById(id: string): Promise<ExpenseModel> {
    return apiClient.get<ExpenseModel>(`${this.endpoint}/${id}`);
  }

  async createExpense(expense: ExpenseCreateRequest): Promise<ExpenseModel> {
    return apiClient.post<ExpenseModel>(this.endpoint, expense);
  }

  async updateExpense(expense: ExpenseUpdateRequest): Promise<ExpenseModel> {
    return apiClient.put<ExpenseModel>(`${this.endpoint}/${expense.id}`, expense);
  }

  async deleteExpense(id: string): Promise<void> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`);
  }

  async getExpensesByDateRange(startDate: string, endDate: string): Promise<ExpenseModel[]> {
    return apiClient.get<ExpenseModel[]>(`${this.endpoint}/date-range?start=${startDate}&end=${endDate}`);
  }

  async getExpensesByCategory(category: string): Promise<ExpenseModel[]> {
    return apiClient.get<ExpenseModel[]>(`${this.endpoint}/category/${category}`);
  }
}

export const expenseService = new ExpenseService();
