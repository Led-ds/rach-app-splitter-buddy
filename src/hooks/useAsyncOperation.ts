
import { useState, useCallback } from 'react';

/**
 * Hook customizado para gerenciar operações assíncronas
 * Fornece estados de loading e error de forma padronizada
 */
export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);      // Estado de carregamento
  const [error, setError] = useState<string | null>(null);  // Estado de erro

  // Executa uma operação assíncrona com delay mínimo para UX
  const executeAsync = useCallback(async <T>(
    operation: () => Promise<T>,  // Função assíncrona a ser executada
    delay: number = 500          // Delay mínimo para mostrar loading
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      // Executa a operação e o delay em paralelo
      // Garante que o loading seja mostrado por tempo suficiente
      const [result] = await Promise.all([
        operation(),
        new Promise(resolve => setTimeout(resolve, delay))
      ]);
      
      return result;
    } catch (err) {
      // Tratamento padronizado de erros
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro na operação assíncrona:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para limpar erros manualmente
  const clearError = useCallback(() => setError(null), []);

  return {
    loading,     // Se está carregando
    error,       // Mensagem de erro atual
    executeAsync, // Função para executar operações
    clearError   // Função para limpar erros
  };
};
