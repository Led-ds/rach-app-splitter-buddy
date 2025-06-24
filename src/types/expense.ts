
export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  category: string;
  date: string;
  description?: string;
}

export interface Person {
  id: string;
  name: string;
  email?: string;
}
