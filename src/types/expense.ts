
/**
 * Tipo Expense - Representa um gasto a ser dividido
 */
export interface Expense {
  id: string;                    // Identificador único do gasto
  description: string;           // Descrição do gasto (ex: "Jantar no restaurante")
  amount: number;                // Valor do gasto em reais
  paidBy: string;               // Nome de quem pagou o gasto
  category: string;             // Categoria do gasto (Comida, Transporte, etc.)
  date: string;                 // Data do gasto (formato ISO string)
  
  // Campos opcionais para divisão customizada
  splitBetween?: string[];      // Lista de pessoas que vão dividir este gasto
  splitType?: 'equal' | 'custom' | 'percentage';  // Tipo de divisão
  splitData?: { [personName: string]: number };   // Dados da divisão customizada
}
