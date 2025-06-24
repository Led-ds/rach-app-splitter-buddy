
import { useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { MainContent } from "@/components/MainContent";
import { Footer } from "@/components/Footer";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { HistoryScreen } from "@/components/HistoryScreen";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'novo' | 'historico'>('novo');
  const [showWelcome, setShowWelcome] = useState(true);

  const handleStartNewSplit = () => {
    setShowWelcome(false);
    // Aqui será implementado o fluxo de criação de split nos próximos módulos
    console.log("Iniciando novo split...");
  };

  const handleTabChange = (tab: 'novo' | 'historico') => {
    setActiveTab(tab);
    if (tab === 'novo') {
      setShowWelcome(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      <MainContent>
        {activeTab === 'novo' ? (
          showWelcome ? (
            <WelcomeScreen onStartNewSplit={handleStartNewSplit} />
          ) : (
            <div className="bg-white rounded-xl p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Em breve...
              </h3>
              <p className="text-gray-600">
                O módulo de criação de split será implementado nos próximos passos.
              </p>
            </div>
          )
        ) : (
          <HistoryScreen />
        )}
      </MainContent>
      
      <Footer />
    </div>
  );
};

export default Index;
