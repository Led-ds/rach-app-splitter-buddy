import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { MainContent } from "@/components/MainContent";
import { Footer } from "@/components/Footer";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { HistoryScreen } from "@/components/HistoryScreen";
import { StoryScreen } from "@/components/StoryScreen";
import { PeopleManagement } from "@/components/PeopleManagement";
import { ExpenseManagement } from "@/components/ExpenseManagement";
import { ExpenseDivision } from "@/components/ExpenseDivision";
import { FinalResult } from "@/components/FinalResult";
import { TemplateSelector } from "@/components/TemplateSelector";
import { useToast } from "@/hooks/use-toast";
import { Person } from "@/types/person";
import { Expense } from "@/types/expense";
import { SplitHistory, SplitTemplate } from "@/types/history";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSplitState } from "@/hooks/useSplitState";
import { useAsyncOperation } from "@/hooks/useAsyncOperation";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'novo' | 'historico' | 'contos'>('novo');
  const [history, setHistory] = useLocalStorage<SplitHistory[]>('split-history', []);
  const { toast } = useToast();
  const isOnline = useOnlineStatus();
  const { loading, executeAsync } = useAsyncOperation();

  const {
    currentStep,
    people,
    expenses,
    selectedTemplate,
    totalAmount,
    setStep,
    setPeople,
    setExpenses,
    setTemplate,
    resetSplit,
    loadFromHistory
  } = useSplitState();

  // Memoized navigation handlers
  const handleStartNewSplit = useCallback(() => {
    setStep('template');
    console.log("Iniciando fluxo do split...");
  }, [setStep]);

  const handleTemplateSelected = useCallback((template: SplitTemplate) => {
    setTemplate(template);
    setStep('people');
    console.log("Template selecionado:", template);
  }, [setTemplate, setStep]);

  const handleStartFromScratch = useCallback(() => {
    setTemplate(null);
    setStep('people');
    console.log("Começando do zero...");
  }, [setTemplate, setStep]);

  const handlePeopleContinue = useCallback((selectedPeople: Person[]) => {
    setPeople(selectedPeople);
    setStep('expenses');
    console.log("Pessoas selecionadas:", selectedPeople);
  }, [setPeople, setStep]);

  const handleExpensesContinue = useCallback((expensesList: Expense[]) => {
    setExpenses(expensesList);
    setStep('division');
    console.log("Gastos adicionados:", expensesList);
  }, [setExpenses, setStep]);

  const handleDivisionContinue = useCallback((finalExpenses: Expense[]) => {
    setExpenses(finalExpenses);
    setStep('result');
    console.log("Divisão finalizada:", finalExpenses);
  }, [setExpenses, setStep]);

  // Navigation back handlers
  const handleBackToWelcome = useCallback(() => setStep('welcome'), [setStep]);
  const handleBackToTemplate = useCallback(() => setStep('template'), [setStep]);
  const handleBackToPeople = useCallback(() => setStep('people'), [setStep]);
  const handleBackToExpenses = useCallback(() => setStep('expenses'), [setStep]);
  const handleBackToDivision = useCallback(() => setStep('division'), [setStep]);

  const handleTabChange = useCallback((tab: 'novo' | 'historico' | 'contos') => {
    setActiveTab(tab);
    if (tab === 'novo') {
      resetSplit();
    }
  }, [resetSplit]);

  const handleSaveToHistory = useCallback(async () => {
    await executeAsync(async () => {
      const newSplit: SplitHistory = {
        id: crypto.randomUUID(),
        name: selectedTemplate?.name || `Split ${new Date().toLocaleDateString('pt-BR')}`,
        date: new Date().toISOString(),
        people,
        expenses,
        totalAmount,
        status: 'completed',
        template: selectedTemplate?.id
      };

      setHistory(prev => [newSplit, ...prev]);
      
      toast({
        title: "Split salvo!",
        description: `Seu split foi salvo no histórico com sucesso. ${!isOnline ? '(Modo offline)' : ''}`,
      });

      console.log("Salvando no histórico:", newSplit);
    });
  }, [executeAsync, selectedTemplate, people, expenses, totalAmount, setHistory, toast, isOnline]);

  const handleNewSplit = useCallback(() => {
    resetSplit();
  }, [resetSplit]);

  const handleUseAgain = useCallback((split: SplitHistory) => {
    const template = split.template ? {
      id: split.template,
      name: split.name,
      description: '',
      icon: split.template === 'churrasco' ? '🍖' : 
           split.template === 'viagem' ? '✈️' :
           split.template === 'restaurante' ? '🍽️' :
           split.template === 'balada' ? '🎉' : '💰',
      defaultExpenses: []
    } : null;

    const resetExpenses = split.expenses.map(expense => ({
      ...expense,
      id: crypto.randomUUID(),
      splitBetween: undefined,
      splitType: 'equal' as const,
      splitData: undefined
    }));

    loadFromHistory({
      people: split.people,
      expenses: resetExpenses,
      template
    });
    
    setActiveTab('novo');
    
    toast({
      title: "Split carregado!",
      description: "As pessoas e gastos foram carregados do histórico.",
    });
  }, [loadFromHistory, setActiveTab, toast]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen onStartNewSplit={handleStartNewSplit} />;
      case 'template':
        return (
          <TemplateSelector
            onSelectTemplate={handleTemplateSelected}
            onStartFromScratch={handleStartFromScratch}
          />
        );
      case 'people':
        return (
          <PeopleManagement 
            onContinue={handlePeopleContinue}
            onBack={selectedTemplate ? handleBackToTemplate : handleBackToWelcome}
            template={selectedTemplate}
          />
        );
      case 'expenses':
        return (
          <ExpenseManagement 
            people={people}
            onBack={handleBackToPeople}
            onContinue={handleExpensesContinue}
            template={selectedTemplate}
          />
        );
      case 'division':
        return (
          <ExpenseDivision
            people={people}
            expenses={expenses}
            onBack={handleBackToExpenses}
            onContinue={handleDivisionContinue}
          />
        );
      case 'result':
        return (
          <FinalResult
            people={people}
            expenses={expenses}
            onBack={handleBackToDivision}
            onNewSplit={handleNewSplit}
            onSaveToHistory={handleSaveToHistory}
            loading={loading}
          />
        );
      default:
        return <WelcomeScreen onStartNewSplit={handleStartNewSplit} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${!isOnline ? 'opacity-95' : ''}`}>
      <Header />
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      {!isOnline && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-center text-sm">
          📱 Modo offline - Suas alterações serão salvas localmente
        </div>
      )}
      
      <MainContent>
        {activeTab === 'novo' ? renderCurrentStep() : activeTab === 'historico' ? <HistoryScreen onUseAgain={handleUseAgain} /> : <StoryScreen />}
      </MainContent>
      
      <Footer />
    </div>
  );
};

export default Index;
