
export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  category: string;
  date: string;
  splitBetween?: string[];
  splitType?: 'equal' | 'custom' | 'percentage';
  splitData?: { [personName: string]: number };
}
