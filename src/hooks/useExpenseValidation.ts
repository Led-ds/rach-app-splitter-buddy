
import { useMemo } from 'react';
import { Expense } from '@/types/expense';

// Resultado da validação com status e lista de erros
interface ValidationResult {
  isValid: boolean;    // Se todos os campos estão válidos
  errors: string[];    // Lista de mensagens de erro
}

/**
 * Hook customizado para validação de gastos
 * Centraliza todas as regras de validação em um local
 */
export const useExpenseValidation = () => {
  // Função de validação memoizada para performance
  const validateExpense = useMemo(() => (expense: Partial<Expense>): ValidationResult => {
    const errors: string[] = [];

    // Validação da descrição
    if (!expense.description || expense.description.length < 3) {
      errors.push('Descrição deve ter pelo menos 3 caracteres');
    }

    // Validação do valor
    if (!expense.amount || expense.amount <= 0) {
      errors.push('Valor deve ser maior que zero');
    }

    // Validação do limite máximo do valor
    if (expense.amount && expense.amount > 999999) {
      errors.push('Valor não pode ser maior que R$ 999.999,00');
    }

    // Validação de quem pagou
    if (!expense.paidBy || expense.paidBy.trim() === '') {
      errors.push('Selecione quem pagou');
    }

    // Validação da categoria
    if (!expense.category || expense.category.trim() === '') {
      errors.push('Selecione uma categoria');
    }

    // Validação da data
    if (!expense.date) {
      errors.push('Data é obrigatória');
    } else {
      const expenseDate = new Date(expense.date);
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);

      // Não permite datas futuras
      if (expenseDate > today) {
        errors.push('Data não pode ser no futuro');
      }

      // Não permite datas muito antigas
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
