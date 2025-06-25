
import { useState, useEffect } from 'react';

/**
 * Hook customizado para gerenciar dados no localStorage
 * Sincroniza estado do React com armazenamento local do navegador
 * Útil para persistir dados entre sessões (histórico, configurações, etc.)
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado inicial: tenta carregar do localStorage ou usa valor padrão
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Função para atualizar o valor (tanto no estado quanto no localStorage)
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permite usar função de update (como useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Atualiza o estado local
      setStoredValue(valueToStore);
      
      // Salva no localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
