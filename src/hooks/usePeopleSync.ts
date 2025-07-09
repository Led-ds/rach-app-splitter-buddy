
import { useState, useEffect } from 'react';
import { PersonModel, PersonCreateRequest } from '../models/person.model';
import { personService } from '../services/person.service';

export const usePeopleSync = () => {
  const [people, setPeople] = useState<PersonModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPeople = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await personService.getAllPeople();
      setPeople(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar pessoas';
      setError(errorMessage);
      console.error('Erro ao carregar pessoas:', err);
    } finally {
      setLoading(false);
    }
  };

  const addPerson = async (person: PersonCreateRequest): Promise<PersonModel | null> => {
    try {
      setLoading(true);
      setError(null);
      const newPerson = await personService.createPerson(person);
      setPeople(prev => [...prev, newPerson]);
      return newPerson;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar pessoa';
      setError(errorMessage);
      console.error('Erro ao adicionar pessoa:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePerson = async (person: PersonModel): Promise<PersonModel | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedPerson = await personService.updatePerson(person);
      setPeople(prev => prev.map(p => p.id === person.id ? updatedPerson : p));
      return updatedPerson;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar pessoa';
      setError(errorMessage);
      console.error('Erro ao atualizar pessoa:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePerson = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await personService.deletePerson(id);
      setPeople(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar pessoa';
      setError(errorMessage);
      console.error('Erro ao deletar pessoa:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Carrega pessoas automaticamente ao montar o hook
  useEffect(() => {
    loadPeople();
  }, []);

  return {
    people,
    loading,
    error,
    loadPeople,
    addPerson,
    updatePerson,
    deletePerson,
    clearError: () => setError(null)
  };
};
