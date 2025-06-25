
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

  // Definição de todos os passos do processo principal
  const mainFlow = [
    {
      id: 'start',
      title: 'Início da Aplicação',
      description: 'Usuário acessa o RachApp',
      icon: <Play className="h-6 w-6 text-green-600" />,
      color: 'bg-green-100 border-green-300',
      details: 'Carregamento da página inicial com navegação e boas-vindas'
    },
    {
      id: 'navigation',
      title: 'Seleção de Aba',
      description: 'Escolha entre Novo Split, Histórico ou Contos',
      icon: <Settings className="h-6 w-6 text-blue-600" />,
      color: 'bg-blue-100 border-blue-300',
      details: 'Sistema de navegação por abas com estado gerenciado'
    },
    {
      id: 'welcome',
      title: 'Tela de Boas-vindas',
      description: 'Apresentação inicial do app',
      icon: <Home className="h-6 w-6 text-purple-600" />,
      color: 'bg-purple-100 border-purple-300',
      details: 'Tela explicativa com botão para iniciar novo split'
    },
    {
      id: 'template',
      title: 'Seleção de Template',
      description: 'Escolher template ou começar do zero',
      icon: <Settings className="h-6 w-6 text-orange-600" />,
      color: 'bg-orange-100 border-orange-300',
      details: 'Templates pré-definidos: Churrasco, Viagem, Restaurante, Balada'
    },
    {
      id: 'people',
      title: 'Gerenciar Pessoas',
      description: 'Adicionar participantes do split',
      icon: <Users className="h-6 w-6 text-cyan-600" />,
      color: 'bg-cyan-100 border-cyan-300',
      details: 'Adicionar/remover pessoas com avatars e validação'
    },
    {
      id: 'expenses',
      title: 'Gerenciar Gastos',
      description: 'Registrar todos os gastos',
      icon: <Calculator className="h-6 w-6 text-indigo-600" />,
      color: 'bg-indigo-100 border-indigo-300',
      details: 'Formulário para adicionar gastos com categorias e validações'
    },
    {
      id: 'division',
      title: 'Divisão dos Gastos',
      description: 'Configurar como dividir cada gasto',
      icon: <DollarSign className="h-6 w-6 text-yellow-600" />,
      color: 'bg-yellow-100 border-yellow-300',
      details: 'Divisão igual, por porcentagem ou customizada'
    },
    {
      id: 'result',
      title: 'Resultado Final',
      description: 'Visualizar quem deve para quem',
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      color: 'bg-green-100 border-green-300',
      details: 'Cálculos finais, transferências e resumo completo'
    }
  ];

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
      {/* Cabeçalho */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          📊 Fluxograma Completo do RachApp
        </h1>
        <p className="text-lg text-gray-600">
          Mapeamento de todos os processos e fluxos da aplicação
        </p>
      </div>

      {/* Fluxo Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-6 w-6 text-green-600" />
            Fluxo Principal - Processo Completo de Split
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mainFlow.map((step, index) => (
              <div key={step.id} className="relative">
                <div 
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedStep === step.id 
                      ? step.color + ' shadow-lg scale-105' 
                      : step.color + ' hover:shadow-md'
                  }`}
                  onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      Passo {index + 1}
                    </Badge>
                  </div>
                </div>

                {/* Detalhes expandidos */}
                {selectedStep === step.id && (
                  <div className="mt-2 ml-12 p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300">
                    <p className="text-sm text-gray-700">{step.details}</p>
                  </div>
                )}

                {/* Seta para próximo passo */}
                {index < mainFlow.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ArrowDown className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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

      {/* Pontos de Decisão */}
      <Card className="bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800">⚡ Pontos de Decisão Críticos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-yellow-800">Template vs. Do Zero</p>
                <p className="text-sm text-yellow-700">Usuário pode escolher template pré-definido ou começar do zero</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-yellow-800">Tipo de Divisão</p>
                <p className="text-sm text-yellow-700">Igual, por porcentagem ou valor customizado para cada gasto</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-yellow-800">Reutilizar ou Novo</p>
                <p className="text-sm text-yellow-700">No histórico, usuário pode reutilizar split anterior ou criar novo</p>
              </div>
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
