
import { useState, useEffect } from "react";
import { Heart, Users, Calculator, Sparkles } from "lucide-react";

/**
 * Componente StoryScreen - Apresenta a história do RachApp
 * Com animações progressivas e elementos interativos
 * Conta a história fictícia de como o app foi criado
 */
export const StoryScreen = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Animação de entrada quando o componente monta
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Seções da história para animação progressiva
  const sections = [
    {
      id: 'intro',
      title: '🍻 Era uma sexta-feira típica em Recife...',
      content: 'Cícero, programador há 10 anos, estava no happy hour com a turma da empresa quando aconteceu aquela situação que todo brasileiro conhece...',
      icon: <Users className="h-8 w-8 text-orange-500" />
    },
    {
      id: 'problem',
      title: '💸 "Gente, vamos rachar?"',
      content: 'disse Severina, a colega do RH, olhando para a conta de R$ 847,90. O silêncio tomou conta da mesa. Seis pessoas, pedidos diferentes, duas cervejas compartilhadas...',
      icon: <Calculator className="h-8 w-8 text-red-500" />
    },
    {
      id: 'chaos',
      title: '😅 O caos começou...',
      content: '"Ah, eu só comi a salada..." murmurou Damiana. "Mas você bebeu duas caipirinhas!" rebateu Valdecir. E assim começou a confusão de sempre...',
      icon: <Sparkles className="h-8 w-8 text-yellow-500" />
    },
    {
      id: 'solution',
      title: '💡 A epifania de Cícero',
      content: 'Vendo Severina mordendo o lábio inferior (coisa que ela só fazia quando estava concentrada), Cícero teve uma ideia: "E se existisse um app que resolvesse isso?"',
      icon: <Heart className="h-8 w-8 text-pink-500" />
    }
  ];

  return (
    <div className={`max-w-4xl mx-auto p-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      
      {/* Header com título principal */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-6 animate-pulse">
          <Heart className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
          A História do RachApp
        </h1>
        <p className="text-lg text-gray-600 italic">
          Uma história de contas, confusões e... amor? 💕
        </p>
      </div>

      {/* Seções animadas da história */}
      <div className="space-y-8">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`transform transition-all duration-700 delay-${index * 200} ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 animate-bounce">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Seção do desenvolvimento */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 animate-fade-in">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
          🚀 Três meses depois...
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-gray-700 text-lg">
              Cícero estava apresentando o protótipo do RachApp para a mesma turma, 
              agora reunida na casa dele para testar.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-blue-800">
              "Cara, isso é genial!" - disse Valdecir, vendo como o app 
              automaticamente calculou que ele devia R$ 127,30.
            </blockquote>
          </div>
          <div className="space-y-4">
            <p className="text-gray-700 text-lg">
              Severina sorriu daquele jeito que fazia Cícero ficar sem graça: 
              "Nunca mais vou passar raiva tentando dividir conta!"
            </p>
            <p className="text-sm text-gray-600">
              E o Expedito? Agora não tinha mais escapatória - o app mostrava 
              claramente que ele devia R$ 89,40! 😅
            </p>
          </div>
        </div>
      </div>

      {/* Final romântico */}
      <div className="mt-12 text-center bg-gradient-to-r from-pink-50 to-red-50 rounded-2xl p-8">
        <div className="animate-pulse mb-6">
          <Heart className="h-16 w-16 text-red-500 mx-auto" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          💒 O final feliz
        </h3>
        <p className="text-lg text-gray-700 mb-4">
          O mais engraçado? No final das contas, literalmente, o RachApp não só 
          resolveu o problema financeiro da turma... Como também foi o pretexto 
          perfeito para Cícero chamar Severina para "testar o app" em outros restaurantes.
        </p>
        <p className="text-gray-600 mb-6">
          <strong>Seis meses depois:</strong> No casamento dos dois, o app teve sua primeira 
          grande propaganda boca-a-boca com 200 convidados descobrindo como dividir 
          as bebidas do open bar sem confusão!
        </p>
        
        <div className="bg-white rounded-xl p-6 shadow-inner">
          <p className="text-2xl font-bold text-green-600 mb-2">
            "RachApp: onde as contas se acertam e os corações se encontram."
          </p>
          <p className="text-sm text-gray-500 italic">
            A moral da história? Às vezes a solução para os pequenos perrengues 
            do dia a dia pode ser o início de algo muito maior... ✨
          </p>
        </div>
      </div>

      {/* Botão de ação */}
      <div className="mt-12 text-center">
        <button 
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          🎉 Começar minha própria história com o RachApp!
        </button>
      </div>
    </div>
  );
};
