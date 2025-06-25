
import { PersonModel } from "./person.model";
import { ExpenseModel } from "./expense.model";

export interface SplitModel {
  id: string;
  name: string;
  date: string;
  people: PersonModel[];
  expenses: ExpenseModel[];
  totalAmount: number;
  status: 'pending' | 'completed';
  template?: string;
}

export interface SplitCreateRequest {
  name: string;
  people: PersonModel[];
  template?: string;
}

export interface SplitTemplateModel {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultExpenses: {
    description: string;
    category: string;
  }[];
}
