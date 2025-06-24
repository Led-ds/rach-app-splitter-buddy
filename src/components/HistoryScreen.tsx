
import { useState } from "react";
import { Clock, Users, DollarSign, Search, Filter, MoreVertical, Play, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SplitHistory } from "@/types/history";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface HistoryScreenProps {
  onUseAgain?: (split: SplitHistory) => void;
}

export const HistoryScreen = ({ onUseAgain }: HistoryScreenProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [history] = useLocalStorage<SplitHistory[]>('split-history', []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filteredHistory = history.filter(split => {
    const matchesSearch = split.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         split.people.some(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || split.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (history.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Histórico de Splits</h2>
          <p className="text-gray-600">Veja seus rachões anteriores</p>
        </div>

        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum split ainda
          </h3>
          
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Quando você criar seu primeiro split, ele aparecerá aqui para você consultar depois.
          </p>

          <div className="space-y-3 max-w-md mx-auto opacity-50">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-700 text-sm">Churrasco da galera</p>
                  <p className="text-xs text-gray-500">5 pessoas • há 2 dias</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-700">R$ 280,00</p>
                <p className="text-xs text-green-600">Finalizado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Histórico de Splits</h2>
        <p className="text-gray-600">Gerencie seus rachões anteriores</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou pessoas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            Todos
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('pending')}
          >
            Pendentes
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('completed')}
          >
            Finalizados
          </Button>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {filteredHistory.map((split) => (
          <Card key={split.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {split.template ? (
                      <span className="text-lg">
                        {split.template === 'churrasco' ? '🍖' : 
                         split.template === 'viagem' ? '✈️' :
                         split.template === 'restaurante' ? '🍽️' :
                         split.template === 'balada' ? '🎉' : '💰'}
                      </span>
                    ) : (
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">{split.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {split.people.length} pessoas
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(split.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(split.totalAmount)}</p>
                    <Badge 
                      variant={split.status === 'completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {split.status === 'completed' ? 'Finalizado' : 'Pendente'}
                    </Badge>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => onUseAgain?.(split)}
                        className="flex items-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Usar Novamente
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* People chips */}
              <div className="mt-3 flex flex-wrap gap-1">
                {split.people.slice(0, 4).map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs"
                  >
                    <div className={`w-2 h-2 rounded-full ${person.color}`}></div>
                    {person.name}
                  </div>
                ))}
                {split.people.length > 4 && (
                  <div className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                    +{split.people.length - 4} mais
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHistory.length === 0 && history.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum resultado encontrado para sua busca.</p>
        </div>
      )}
    </div>
  );
};
