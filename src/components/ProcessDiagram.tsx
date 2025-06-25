
import { useState } from "react";
import { 
  Play, 
  Users, 
  Calculator, 
  DollarSign, 
  CheckCircle, 
  Save, 
  History, 
  BookOpen,
  ArrowDown,
  ArrowRight,
  ChevronRight,
  Home,
  Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Componente ProcessDiagram - Exibe o fluxograma completo dos processos do RachApp
 * Mostra todas as etapas desde o início até o fim, incluindo fluxos alternativos
 */
export const ProcessDiagram = () => {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  // Fluxos paralelos e alternativos
  const alternativeFlows = [
    {
      title: 'Fluxo do Histórico',
      steps: [
        { name: 'Visualizar Histórico', description: 'Lista de splits salvos' },
        { name: 'Reutilizar Split', description: 'Usar novamente um split anterior' },
        { name: 'Continuar no Fluxo Principal', description: 'Vai para etapa de gastos' }
      ],
      icon: <History className="h-5 w-5 text-blue-600" />,
      color: 'bg-blue-50'
    },
    {
      title: 'Fluxo dos Contos',
      steps: [
        { name: 'Ler História', description: 'História fictícia do RachApp' },
        { name: 'Animações Interativas', description: 'Experiência visual envolvente' },
        { name: 'Início de Nova História', description: 'Botão para começar próprio split' }
      ],
      icon: <BookOpen className="h-5 w-5 text-purple-600" />,
      color: 'bg-purple-50'
    }
  ];

  // Ações finais possíveis
  const finalActions = [
    {
      name: 'Salvar no Histórico',
      icon: <Save className="h-4 w-4" />,
      description: 'Armazenar split para reutilização futura'
    },
    {
      name: 'Compartilhar WhatsApp',
      icon: <ChevronRight className="h-4 w-4" />,
      description: 'Enviar resultado formatado via WhatsApp'
    },
    {
      name: 'Copiar Resultado',
      icon: <ChevronRight className="h-4 w-4" />,
      description: 'Copiar texto formatado para área de transferência'
    },
    {
      name: 'Novo Split',
      icon: <Play className="h-4 w-4" />,
      description: 'Reiniciar processo para novo cálculo'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Fluxos Alternativos */}
      <div className="grid md:grid-cols-2 gap-6">
        {alternativeFlows.map((flow, flowIndex) => (
          <Card key={flowIndex} className={flow.color}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {flow.icon}
                {flow.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {flow.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm">{step.name}</p>
                      <p className="text-xs text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ações Finais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Ações Finais Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {finalActions.map((action, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0 text-blue-600">
                  {action.icon}
                </div>
                <div>
                  <p className="font-medium text-sm">{action.name}</p>
                  <p className="text-xs text-gray-600">{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Características Técnicas */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 Características Técnicas do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Estado & Navegação</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• useReducer para estado complexo</li>
                <li>• Hook customizado useSplitState</li>
                <li>• Navegação entre steps controlada</li>
                <li>• Validações em cada etapa</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Persistência & Performance</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• LocalStorage para histórico</li>
                <li>• useMemo para cálculos pesados</li>
                <li>• useCallback para otimização</li>
                <li>• Modo offline detectado</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">UX & Acessibilidade</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Loading states para operações</li>
                <li>• Toasts para feedback</li>
                <li>• Design responsivo</li>
                <li>• Animações e transições</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legenda */}
      <div className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
        <p><strong>📝 Nota:</strong> Este fluxograma representa o estado atual da aplicação.</p>
        <p>Clique nos passos do fluxo principal para ver mais detalhes de cada etapa.</p>
      </div>
    </div>
  );
};
