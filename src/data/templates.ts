
import { SplitTemplate } from "@/types/history";

/**
 * Templates pré-definidos para diferentes tipos de splits
 * Cada template contém gastos padrão para acelerar o processo
 * Usuários podem escolher um template ou começar do zero
 */
export const splitTemplates: SplitTemplate[] = [
  {
    id: 'churrasco',
    name: 'Churrasco',
    description: 'Churrascos e encontros',
    icon: '🍖',
    // Gastos típicos de um churrasco
    defaultExpenses: [
      { description: 'Carne', category: 'Comida' },
      { description: 'Bebidas', category: 'Bebida' },
      { description: 'Carvão', category: 'Outros' },
      { description: 'Acompanhamentos', category: 'Comida' }
    ]
  },
  {
    id: 'viagem',
    name: 'Viagem',
    description: 'Viagens e passeios',
    icon: '✈️',
    // Gastos típicos de uma viagem
    defaultExpenses: [
      { description: 'Hospedagem', category: 'Hospedagem' },
      { description: 'Transporte', category: 'Transporte' },
      { description: 'Alimentação', category: 'Comida' },
      { description: 'Atividades', category: 'Outros' }
    ]
  },
  {
    id: 'restaurante',
    name: 'Restaurante',
    description: 'Refeições em restaurantes',
    icon: '🍽️',
    // Gastos típicos de restaurante
    defaultExpenses: [
      { description: 'Comida', category: 'Comida' },
      { description: 'Bebidas', category: 'Bebida' },
      { description: 'Sobremesa', category: 'Comida' },
      { description: 'Gorjeta', category: 'Outros' }
    ]
  },
  {
    id: 'balada',
    name: 'Balada',
    description: 'Noitadas e festas',
    icon: '🎉',
    // Gastos típicos de balada/festa
    defaultExpenses: [
      { description: 'Entrada', category: 'Outros' },
      { description: 'Bebidas', category: 'Bebida' },
      { description: 'Transporte', category: 'Transporte' },
      { description: 'Comida', category: 'Comida' }
    ]
  }
];
