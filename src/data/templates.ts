
import { SplitTemplate } from "@/types/history";

export const splitTemplates: SplitTemplate[] = [
  {
    id: 'churrasco',
    name: 'Churrasco',
    description: 'Churrascos e encontros',
    icon: '🍖',
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
    defaultExpenses: [
      { description: 'Entrada', category: 'Outros' },
      { description: 'Bebidas', category: 'Bebida' },
      { description: 'Transporte', category: 'Transporte' },
      { description: 'Comida', category: 'Comida' }
    ]
  }
];
