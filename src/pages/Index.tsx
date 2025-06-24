
import { useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { MainContent } from "@/components/MainContent";
import { Footer } from "@/components/Footer";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { HistoryScreen } from "@/components/HistoryScreen";
import { PeopleManagement } from "@/components/PeopleManagement";
import { ExpenseManagement } from "@/components/ExpenseManagement";
import { Person } from "@/types/person";

type FlowStep = 'welcome' | 'people' | 'expenses' | 'division' | 'result';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'novo' | 'historico'>('novo');
  const [currentStep, setCurrentStep] = useState<FlowStep>('welcome');
  const [people, setPeople] = useState<Person[]>([]);

  const handleStartNewSplit = () => {
    setCurrentStep('people');
    console.log("Iniciando fluxo do split...");
  };

  const handlePeopleContinue = (selectedPeople: Person[]) => {
    setPeople(selectedPeople);
    setCurrentStep('expenses');
    console.log("Pessoas selecionadas:", selectedPeople);
  };

  const handleBackToWelcome = () => {
    setCurrentStep('welcome');
    setPeople([]);
  };

  const handleBackToPeople = () => {
    setCurrentStep('people');
  };

  const handleTabChange = (tab: 'novo' | 'historico') => {
    setActiveTab(tab);
    if (tab === 'novo') {
      setCurrentStep('welcome');
      setPeople([]);
    }
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
