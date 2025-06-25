
import { useReducer, useCallback, useMemo } from 'react';
import { Person } from '@/types/person';
import { Expense } from '@/types/expense';
import { SplitTemplate } from '@/types/history';

// Definição dos passos do fluxo de divisão de gastos
type FlowStep = 'welcome' | 'template' | 'people' | 'expenses' | 'division' | 'result';

// Estado principal do sistema de divisão de gastos
interface SplitState {
  currentStep: FlowStep;           // Passo atual do fluxo
  people: Person[];                // Lista de pessoas participantes
  expenses: Expense[];             // Lista de gastos a serem divididos
  selectedTemplate: SplitTemplate | null; // Template selecionado (churrasco, viagem, etc.)
}

// Ações possíveis para modificar o estado
type SplitAction =
  | { type: 'SET_STEP'; payload: FlowStep }
  | { type: 'SET_PEOPLE'; payload: Person[] }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'SET_TEMPLATE'; payload: SplitTemplate | null }
  | { type: 'RESET_SPLIT' }
  | { type: 'LOAD_FROM_HISTORY'; payload: { people: Person[]; expenses: Expense[]; template: SplitTemplate | null } };

// Estado inicial da aplicação
const initialState: SplitState = {
  currentStep: 'welcome',
  people: [],
  expenses: [],
  selectedTemplate: null,
};

// Reducer para gerenciar o estado do split de forma centralizada
const splitReducer = (state: SplitState, action: SplitAction): SplitState => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_PEOPLE':
      return { ...state, people: action.payload };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'SET_TEMPLATE':
      return { ...state, selectedTemplate: action.payload };
    case 'RESET_SPLIT':
      return initialState;
    case 'LOAD_FROM_HISTORY':
      // Carrega dados do histórico para reutilização
      return {
        ...state,
        people: action.payload.people,
        expenses: action.payload.expenses,
        selectedTemplate: action.payload.template,
        currentStep: 'expenses'
      };
    default:
      return state;
  }
};

/**
 * Hook customizado para gerenciar o estado global do split de gastos
 * Centraliza toda a lógica de estado e navegação entre os passos
 */
export const useSplitState = () => {
  const [state, dispatch] = useReducer(splitReducer, initialState);

  // Cálculo do valor total dos gastos (memoizado para performance)
  const totalAmount = useMemo(() => 
    state.expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [state.expenses]
  );

  // Ações memoizadas para evitar re-renders desnecessários
  const actions = useMemo(() => ({
    // Navegar para um passo específico
    setStep: (step: FlowStep) => dispatch({ type: 'SET_STEP', payload: step }),
    
    // Definir lista de pessoas participantes
    setPeople: (people: Person[]) => dispatch({ type: 'SET_PEOPLE', payload: people }),
    
    // Definir lista de gastos
    setExpenses: (expenses: Expense[]) => dispatch({ type: 'SET_EXPENSES', payload: expenses }),
    
    // Selecionar template pré-definido
    setTemplate: (template: SplitTemplate | null) => dispatch({ type: 'SET_TEMPLATE', payload: template }),
    
    // Resetar todo o estado para começar novo split
    resetSplit: () => dispatch({ type: 'RESET_SPLIT' }),
    
    // Carregar dados do histórico para reutilização
    loadFromHistory: (data: { people: Person[]; expenses: Expense[]; template: SplitTemplate | null }) => 
      dispatch({ type: 'LOAD_FROM_HISTORY', payload: data })
  }), []);

  return {
    ...state,
    totalAmount,
    ...actions
  };
};
