
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { splitTemplates } from "@/data/templates";
import { SplitTemplate } from "@/types/history";

interface TemplateSelectorProps {
  onSelectTemplate: (template: SplitTemplate) => void;
  onStartFromScratch: () => void;
}

export const TemplateSelector = ({ onSelectTemplate, onStartFromScratch }: TemplateSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Escolha um template</h2>
        <p className="text-gray-600">
          Use um modelo pré-definido ou comece do zero
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {splitTemplates.map((template) => (
          <Card 
            key={template.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectTemplate(template)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-2xl">{template.icon}</span>
                {template.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="space-y-1">
                {template.defaultExpenses.slice(0, 3).map((expense, index) => (
                  <div key={index} className="text-xs text-gray-500">
                    • {expense.description}
                  </div>
                ))}
                {template.defaultExpenses.length > 3 && (
                  <div className="text-xs text-gray-400">
                    +{template.defaultExpenses.length - 3} mais...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button
          variant="outline"
          onClick={onStartFromScratch}
          className="w-full"
        >
          Começar do zero
        </Button>
      </div>
    </div>
  );
};
