
import { useState, useEffect } from 'react';

/**
 * Hook customizado para detectar o status de conexão online/offline
 * Útil para mostrar indicadores visuais e adaptar funcionalidades
 */
export const useOnlineStatus = () => {
  // Estado inicial baseado no navegador
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Handlers para eventos de mudança de conexão
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Registra os listeners para eventos de conectividade
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup: remove os listeners quando o componente desmonta
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
