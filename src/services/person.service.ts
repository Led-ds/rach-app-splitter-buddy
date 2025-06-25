
import { apiClient } from './api.config';
import { PersonModel, PersonCreateRequest } from '../models/person.model';

export class PersonService {
  private endpoint = '/people';

  async getAllPeople(): Promise<PersonModel[]> {
    return apiClient.get<PersonModel[]>(this.endpoint);
  }

  async getPersonById(id: string): Promise<PersonModel> {
    return apiClient.get<PersonModel>(`${this.endpoint}/${id}`);
  }

  async createPerson(person: PersonCreateRequest): Promise<PersonModel> {
    return apiClient.post<PersonModel>(this.endpoint, person);
  }

  async updatePerson(person: PersonModel): Promise<PersonModel> {
    return apiClient.put<PersonModel>(`${this.endpoint}/${person.id}`, person);
  }

  async deletePerson(id: string): Promise<void> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`);
  }
}

export const personService = new PersonService();
