
import { useReducer, useCallback, useMemo } from 'react';
import { Person } from '@/types/person';
import { Expense } from '@/types/expense';
import { SplitTemplate } from '@/types/history';

type FlowStep = 'welcome' | 'template' | 'people' | 'expenses' | 'division' | 'result';

interface SplitState {
  currentStep: FlowStep;
  people: Person[];
  expenses: Expense[];
  selectedTemplate: SplitTemplate | null;
}

type SplitAction =
  | { type: 'SET_STEP'; payload: FlowStep }
  | { type: 'SET_PEOPLE'; payload: Person[] }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'SET_TEMPLATE'; payload: SplitTemplate | null }
  | { type: 'RESET_SPLIT' }
  | { type: 'LOAD_FROM_HISTORY'; payload: { people: Person[]; expenses: Expense[]; template: SplitTemplate | null } };

const initialState: SplitState = {
  currentStep: 'welcome',
  people: [],
  expenses: [],
  selectedTemplate: null,
};

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

export const useSplitState = () => {
  const [state, dispatch] = useReducer(splitReducer, initialState);

  // Memoized calculations
  const totalAmount = useMemo(() => 
    state.expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [state.expenses]
  );

  // Memoized navigation callbacks
  const actions = useMemo(() => ({
    setStep: (step: FlowStep) => dispatch({ type: 'SET_STEP', payload: step }),
    setPeople: (people: Person[]) => dispatch({ type: 'SET_PEOPLE', payload: people }),
    setExpenses: (expenses: Expense[]) => dispatch({ type: 'SET_EXPENSES', payload: expenses }),
    setTemplate: (template: SplitTemplate | null) => dispatch({ type: 'SET_TEMPLATE', payload: template }),
    resetSplit: () => dispatch({ type: 'RESET_SPLIT' }),
    loadFromHistory: (data: { people: Person[]; expenses: Expense[]; template: SplitTemplate | null }) => 
      dispatch({ type: 'LOAD_FROM_HISTORY', payload: data })
  }), []);

  return {
    ...state,
    totalAmount,
    ...actions
  };
};
