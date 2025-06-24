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
import { Button } from "@/components/ui/button";
import { Person } from "@/types/person";
import { Expense } from "@/types/expense";

type FlowStep = 'welcome' | 'people' | 'expenses' | 'division' | 'result';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'novo' | 'historico'>('novo');
  const [currentStep, setCurrentStep] = useState<FlowStep>('welcome');
  const [people, setPeople] = useState<Person[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const handleStartNewSplit = () => {
    setCurrentStep('people');
    console.log("Iniciando fluxo do split...");
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
    // TODO: Implement history saving
    console.log("Salvando no histórico...");
  };

  const handleNewSplit = () => {
    setCurrentStep('welcome');
    setPeople([]);
    setExpenses([]);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen onStartNewSplit={handleStartNewSplit} />;
      case 'people':
        return (
          <PeopleManagement 
            onContinue={handlePeopleContinue}
            onBack={handleBackToWelcome}
          />
        );
      case 'expenses':
        return (
          <ExpenseManagement 
            people={people}
            onBack={handleBackToPeople}
            onContinue={handleExpensesContinue}
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
        {activeTab === 'novo' ? renderCurrentStep() : <HistoryScreen />}
      </MainContent>
      
      <Footer />
    </div>
  );
};

export default Index;
