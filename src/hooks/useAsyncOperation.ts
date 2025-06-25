
import { useState, useCallback } from 'react';

export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    delay: number = 500
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      // Adiciona um delay mínimo para mostrar o loading
      const [result] = await Promise.all([
        operation(),
        new Promise(resolve => setTimeout(resolve, delay))
      ]);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro na operação assíncrona:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    loading,
    error,
    executeAsync,
    clearError
  };
};
