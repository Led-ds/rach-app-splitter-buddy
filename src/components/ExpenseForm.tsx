
import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Person } from "@/types/person";
import { Expense } from "@/types/expense";
import { SplitTemplate } from "@/types/history";
import { ExpenseFormViewModel } from "../viewmodels/expense-form.viewmodel";
import { expenseFormTemplate, suggestionTemplate } from "../views/expense-form.view";

interface ExpenseFormProps {
  people: Person[];
  onAddExpense: (expense: Expense) => void;
  template?: SplitTemplate | null;
}

export const ExpenseForm = ({ people, onAddExpense, template }: ExpenseFormProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewModelRef = useRef<ExpenseFormViewModel | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Inicializar ViewModel
    viewModelRef.current = new ExpenseFormViewModel(
      people.map(p => ({ id: p.id, name: p.name, color: p.color })),
      onAddExpense,
      template ? {
        id: template.id,
        name: template.name,
        description: template.description,
        icon: template.icon,
        defaultExpenses: template.defaultExpenses
      } : null
    );

    // Renderizar template
    containerRef.current.innerHTML = expenseFormTemplate;

    // Configurar elementos
    setupFormElements();
    setupEventListeners();
    
    // Cleanup
    return () => {
      viewModelRef.current = null;
    };
  }, [people, template]);

  const setupFormElements = () => {
    if (!containerRef.current || !viewModelRef.current) return;

    const descriptionInput = containerRef.current.querySelector('#description') as HTMLInputElement;
    const amountInput = containerRef.current.querySelector('#amount') as HTMLInputElement;
    const paidBySelect = containerRef.current.querySelector('#paidBy') as HTMLSelectElement;
    const categorySelect = containerRef.current.querySelector('#category') as HTMLSelectElement;
    const dateInput = containerRef.current.querySelector('#date') as HTMLInputElement;

    // Definir valores iniciais
    if (descriptionInput) descriptionInput.value = viewModelRef.current.description;
    if (amountInput) amountInput.value = viewModelRef.current.amount;
    if (categorySelect) categorySelect.value = viewModelRef.current.category;
    if (dateInput) dateInput.value = viewModelRef.current.date;

    // Preencher opções de pessoas
    if (paidBySelect) {
      paidBySelect.innerHTML = '<option value="">Selecione...</option>';
      viewModelRef.current.people.forEach(person => {
        const option = document.createElement('option');
        option.value = person.name;
        option.textContent = person.name;
        paidBySelect.appendChild(option);
      });
      paidBySelect.value = viewModelRef.current.paidBy;
    }

    // Renderizar sugestões
    renderSuggestions();
  };

  const setupEventListeners = () => {
    if (!containerRef.current || !viewModelRef.current) return;

    const descriptionInput = containerRef.current.querySelector('#description') as HTMLInputElement;
    const amountInput = containerRef.current.querySelector('#amount') as HTMLInputElement;
    const paidBySelect = containerRef.current.querySelector('#paidBy') as HTMLSelectElement;
    const categorySelect = containerRef.current.querySelector('#category') as HTMLSelectElement;
    const dateInput = containerRef.current.querySelector('#date') as HTMLInputElement;
    const addButton = containerRef.current.querySelector('#add-expense-btn') as HTMLButtonElement;

    // Event listeners
    descriptionInput?.addEventListener('input', (e) => {
      if (viewModelRef.current) {
        viewModelRef.current.description = (e.target as HTMLInputElement).value;
      }
    });

    amountInput?.addEventListener('input', (e) => {
      if (viewModelRef.current) {
        viewModelRef.current.amount = (e.target as HTMLInputElement).value;
      }
    });

    paidBySelect?.addEventListener('change', (e) => {
      if (viewModelRef.current) {
        viewModelRef.current.paidBy = (e.target as HTMLSelectElement).value;
      }
    });

    categorySelect?.addEventListener('change', (e) => {
      if (viewModelRef.current) {
        viewModelRef.current.category = (e.target as HTMLSelectElement).value;
        renderSuggestions();
      }
    });

    dateInput?.addEventListener('change', (e) => {
      if (viewModelRef.current) {
        viewModelRef.current.date = (e.target as HTMLInputElement).value;
      }
    });

    addButton?.addEventListener('click', async () => {
      try {
        await viewModelRef.current?.addExpense();
        // Reset form after successful addition
        if (descriptionInput) descriptionInput.value = '';
        if (amountInput) amountInput.value = '';
      } catch (error) {
        alert((error as Error).message);
      }
    });
  };

  const renderSuggestions = () => {
    if (!containerRef.current || !viewModelRef.current) return;

    const suggestionsContainer = containerRef.current.querySelector('#suggestions-container');
    if (!suggestionsContainer) return;

    const suggestions = viewModelRef.current.suggestions;
    
    if (suggestions.length > 0) {
      suggestionsContainer.innerHTML = suggestions
        .map(suggestion => suggestionTemplate(suggestion))
        .join('');
      suggestionsContainer.classList.remove('hidden');

      // Add click listeners to suggestions
      suggestionsContainer.querySelectorAll('[data-suggestion]').forEach(element => {
        element.addEventListener('click', () => {
          const suggestion = element.getAttribute('data-suggestion');
          if (suggestion && viewModelRef.current) {
            viewModelRef.current.selectSuggestion(suggestion);
            const descriptionInput = containerRef.current?.querySelector('#description') as HTMLInputElement;
            if (descriptionInput) {
              descriptionInput.value = suggestion;
            }
          }
        });
      });
    } else {
      suggestionsContainer.classList.add('hidden');
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div ref={containerRef} />
      </CardContent>
    </Card>
  );
};
