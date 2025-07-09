
import { useState, useEffect } from 'react';
import { SplitModel, SplitCreateRequest, SplitTemplateModel } from '../models/split.model';
import { splitService } from '../services/split.service';

export const useSplitSync = () => {
  const [splits, setSplits] = useState<SplitModel[]>([]);
  const [templates, setTemplates] = useState<SplitTemplateModel[]>([]);
  const [splitHistory, setSplitHistory] = useState<SplitModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSplits = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await splitService.getAllSplits();
      setSplits(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar splits';
      setError(errorMessage);
      console.error('Erro ao carregar splits:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await splitService.getAllTemplates();
      setTemplates(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar templates';
      setError(errorMessage);
      console.error('Erro ao carregar templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSplitHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await splitService.getSplitHistory();
      setSplitHistory(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar histórico';
      setError(errorMessage);
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setLoading(false);
    }
  };

  const createSplit = async (split: SplitCreateRequest): Promise<SplitModel | null> => {
    try {
      setLoading(true);
      setError(null);
      const newSplit = await splitService.createSplit(split);
      setSplits(prev => [...prev, newSplit]);
      return newSplit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar split';
      setError(errorMessage);
      console.error('Erro ao criar split:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const completeSplit = async (id: string): Promise<SplitModel | null> => {
    try {
      setLoading(true);
      setError(null);
      const completedSplit = await splitService.completeSplit(id);
      setSplits(prev => prev.map(s => s.id === id ? completedSplit : s));
      return completedSplit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao finalizar split';
      setError(errorMessage);
      console.error('Erro ao finalizar split:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Carrega dados automaticamente ao montar o hook
  useEffect(() => {
    loadSplits();
    loadTemplates();
    loadSplitHistory();
  }, []);

  return {
    splits,
    templates,
    splitHistory,
    loading,
    error,
    loadSplits,
    loadTemplates,
    loadSplitHistory,
    createSplit,
    completeSplit,
    clearError: () => setError(null)
  };
};
