
import { Person } from "./person";
import { Expense } from "./expense";

/**
 * Tipo SplitHistory - Representa um split salvo no histórico
 * Permite reutilizar splits anteriores
 */
export interface SplitHistory {
  id: string;                    // ID único do split
  name: string;                  // Nome do split (ex: "Churrasco da galera")
  date: string;                  // Data de criação (ISO string)
  people: Person[];              // Pessoas que participaram
  expenses: Expense[];           // Gastos do split
  totalAmount: number;           // Valor total dos gastos
  status: 'pending' | 'completed';  // Status do split
  template?: string;             // ID do template usado (opcional)
}

/**
 * Tipo SplitTemplate - Template pré-definido para facilitar criação
 * Contém gastos padrão para diferentes tipos de eventos
 */
export interface SplitTemplate {
  id: string;                    // ID único do template
  name: string;                  // Nome do template (ex: "Churrasco")
  description: string;           // Descrição do template
  icon: string;                  // Emoji/ícone para representar visualmente
  defaultExpenses: {             // Lista de gastos padrão
    description: string;         // Descrição do gasto padrão
    category: string;            // Categoria do gasto padrão
  }[];
}
