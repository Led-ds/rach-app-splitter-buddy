
import { useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { MainContent } from "@/components/MainContent";
import { Footer } from "@/components/Footer";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { HistoryScreen } from "@/components/HistoryScreen";
import { PeopleManagement } from "@/components/PeopleManagement";
import { ExpenseManagement } from "@/components/ExpenseManagement";
import { ExpenseDivision } from "@/components/ExpenseDivision";
import { FinalResult } from "@/components/FinalResult";
import { TemplateSelector } from "@/components/TemplateSelector";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Person } from "@/types/person";
import { Expense } from "@/types/expense";
import { SplitHistory, SplitTemplate } from "@/types/history";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type FlowStep = 'welcome' | 'template' | 'people' | 'expenses' | 'division' | 'result';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'novo' | 'historico'>('novo');
  const [currentStep, setCurrentStep] = useState<FlowStep>('welcome');
  const [people, setPeople] = useState<Person[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<SplitTemplate | null>(null);
  const [history, setHistory] = useLocalStorage<SplitHistory[]>('split-history', []);
  const { toast } = useToast();

  const handleStartNewSplit = () => {
    setCurrentStep('template');
    console.log("Iniciando fluxo do split...");
  };

  const handleTemplateSelected = (template: SplitTemplate) => {
    setSelectedTemplate(template);
    setCurrentStep('people');
    console.log("Template selecionado:", template);
  };

  const handleStartFromScratch = () => {
    setSelectedTemplate(null);
    setCurrentStep('people');
    console.log("Começando do zero...");
  };

  const handlePeopleContinue = (selectedPeople: Person[]) => {
    setPeople(selectedPeople);
    setCurrentStep('expenses');
    console.log("Pessoas selecionadas:", selectedPeople);
  };

  const handleExpensesContinue = (expensesList: Expense[]) => {
    setExpenses(expensesList);
    setCurrentStep('division');
    console.log("Gastos adicionados:", expensesList);
  };

  const handleBackToWelcome = () => {
    setCurrentStep('welcome');
    setPeople([]);
    setSelectedTemplate(null);
  };

  const handleBackToTemplate = () => {
    setCurrentStep('template');
  };

  const handleBackToPeople = () => {
    setCurrentStep('people');
  };

  const handleBackToExpenses = () => {
    setCurrentStep('expenses');
  };

  const handleTabChange = (tab: 'novo' | 'historico') => {
    setActiveTab(tab);
    if (tab === 'novo') {
      setCurrentStep('welcome');
      setPeople([]);
      setExpenses([]);
      setSelectedTemplate(null);
    }
  };

  const handleDivisionContinue = (finalExpenses: Expense[]) => {
    setExpenses(finalExpenses);
    setCurrentStep('result');
    console.log("Divisão finalizada:", finalExpenses);
  };

  const handleBackToDivision = () => {
    setCurrentStep('division');
  };

  const handleSaveToHistory = () => {
    const newSplit: SplitHistory = {
      id: crypto.randomUUID(),
      name: selectedTemplate?.name || `Split ${new Date().toLocaleDateString('pt-BR')}`,
      date: new Date().toISOString(),
      people,
      expenses,
      totalAmount: expenses.reduce((sum, expense) => sum + expense.amount, 0),
      status: 'completed',
      template: selectedTemplate?.id
    };

    setHistory(prev => [newSplit, ...prev]);
    
    toast({
      title: "Split salvo!",
      description: "Seu split foi salvo no histórico com sucesso.",
    });

    console.log("Salvando no histórico:", newSplit);
  };

  const handleNewSplit = () => {
    setCurrentStep('welcome');
    setPeople([]);
    setExpenses([]);
    setSelectedTemplate(null);
  };

  const handleUseAgain = (split: SplitHistory) => {
    setPeople(split.people);
    setExpenses(split.expenses.map(expense => ({
      ...expense,
      id: crypto.randomUUID(), // Generate new IDs
      splitBetween: undefined,
      splitType: 'equal',
      splitData: undefined
    })));
    setSelectedTemplate(split.template ? {
      id: split.template,
      name: split.name,
      description: '',
      icon: split.template === 'churrasco' ? '🍖' : 
           split.template === 'viagem' ? '✈️' :
           split.template === 'restaurante' ? '🍽️' :
           split.template === 'balada' ? '🎉' : '💰',
      defaultExpenses: []
    } : null);
    
    setActiveTab('novo');
    setCurrentStep('expenses');
    
    toast({
      title: "Split carregado!",
      description: "As pessoas e gastos foram carregados do histórico.",
    });
  };

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
          />
        );
      default:
        return <WelcomeScreen onStartNewSplit={handleStartNewSplit} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      <MainContent>
        {activeTab === 'novo' ? renderCurrentStep() : <HistoryScreen onUseAgain={handleUseAgain} />}
      </MainContent>
      
      <Footer />
    </div>
  );
};

export default Index;
