
export interface ExpenseModel {
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

export interface ExpenseCreateRequest {
  description: string;
  amount: number;
  paidBy: string;
  category: string;
  date: string;
}

export interface ExpenseUpdateRequest extends Partial<ExpenseCreateRequest> {
  id: string;
}
