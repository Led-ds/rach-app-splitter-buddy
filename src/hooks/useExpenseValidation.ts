
import { useMemo } from 'react';
import { Expense } from '@/types/expense';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const useExpenseValidation = () => {
  const validateExpense = useMemo(() => (expense: Partial<Expense>): ValidationResult => {
    const errors: string[] = [];

    if (!expense.description || expense.description.length < 3) {
      errors.push('Descrição deve ter pelo menos 3 caracteres');
    }

    if (!expense.amount || expense.amount <= 0) {
      errors.push('Valor deve ser maior que zero');
    }

    if (expense.amount && expense.amount > 999999) {
      errors.push('Valor não pode ser maior que R$ 999.999,00');
    }

    if (!expense.paidBy || expense.paidBy.trim() === '') {
      errors.push('Selecione quem pagou');
    }

    if (!expense.category || expense.category.trim() === '') {
      errors.push('Selecione uma categoria');
    }

    if (!expense.date) {
      errors.push('Data é obrigatória');
    } else {
      const expenseDate = new Date(expense.date);
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);

      if (expenseDate > today) {
        errors.push('Data não pode ser no futuro');
      }

      if (expenseDate < oneYearAgo) {
        errors.push('Data não pode ser anterior a um ano');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  return { validateExpense };
};
