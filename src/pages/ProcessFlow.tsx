
import { ProcessDiagram } from "@/components/ProcessDiagram";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MainContent } from "@/components/MainContent";

/**
 * Página ProcessFlow - Exibe o diagrama de processos do RachApp
 * Página dedicada para visualizar todos os fluxos e processos da aplicação
 */
const ProcessFlow = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <MainContent>
        <ProcessDiagram />
      </MainContent>
      <Footer />
    </div>
  );
};

export default ProcessFlow;
