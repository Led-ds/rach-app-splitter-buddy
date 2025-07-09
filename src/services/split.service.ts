
import { apiClient } from './api.config';
import { SplitModel, SplitCreateRequest, SplitTemplateModel } from '../models/split.model';

export class SplitService {
  private endpoint = '/splits';
  private templateEndpoint = '/split-templates';
  private historyEndpoint = '/split-history';

  async getAllSplits(): Promise<SplitModel[]> {
    return apiClient.get<SplitModel[]>(this.endpoint);
  }

  async getSplitById(id: string): Promise<SplitModel> {
    return apiClient.get<SplitModel>(`${this.endpoint}/${id}`);
  }

  async createSplit(split: SplitCreateRequest): Promise<SplitModel> {
    return apiClient.post<SplitModel>(this.endpoint, split);
  }

  async updateSplit(split: SplitModel): Promise<SplitModel> {
    return apiClient.put<SplitModel>(`${this.endpoint}/${split.id}`, split);
  }

  async deleteSplit(id: string): Promise<void> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`);
  }

  async completeSplit(id: string): Promise<SplitModel> {
    return apiClient.put<SplitModel>(`${this.endpoint}/${id}/complete`, {});
  }

  async getAllTemplates(): Promise<SplitTemplateModel[]> {
    return apiClient.get<SplitTemplateModel[]>(this.templateEndpoint);
  }

  async getTemplateById(id: string): Promise<SplitTemplateModel> {
    return apiClient.get<SplitTemplateModel>(`${this.templateEndpoint}/${id}`);
  }

  // Métodos para histórico de splits
  async getSplitHistory(): Promise<SplitModel[]> {
    return apiClient.get<SplitModel[]>(this.historyEndpoint);
  }

  async getSplitHistoryById(id: string): Promise<SplitModel> {
    return apiClient.get<SplitModel>(`${this.historyEndpoint}/${id}`);
  }
}

export const splitService = new SplitService();
