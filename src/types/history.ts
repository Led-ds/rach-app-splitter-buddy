
import { Person } from "./person";
import { Expense } from "./expense";

export interface SplitHistory {
  id: string;
  name: string;
  date: string;
  people: Person[];
  expenses: Expense[];
  totalAmount: number;
  status: 'pending' | 'completed';
  template?: string;
}

export interface SplitTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultExpenses: {
    description: string;
    category: string;
  }[];
}
