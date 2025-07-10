export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
}

export const apiConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl;
    this.defaultHeaders = config.headers;
  }

  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      }
    };

    try {
      console.log('🌐 Fazendo requisição para:', url);
      console.log('📝 Config completo:', config);
      console.log('📦 Body da requisição:', config.body);
      
      const response = await fetch(url, config);
      
      console.log('📡 Status da resposta:', response.status);
      console.log('📋 Headers da resposta:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        // Tentar capturar o corpo da resposta de erro
        let errorBody = '';
        try {
          errorBody = await response.text();
          console.error('💥 Corpo da resposta de erro:', errorBody);
        } catch (e) {
          console.error('❌ Não foi possível ler o corpo do erro');
        }
        
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
      }
      
      // Verificar se há conteúdo para parsear
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      
      if (contentType && contentType.includes('application/json') && contentLength !== '0') {
        const result = await response.json();
        console.log('✅ Resposta JSON:', result);
        return result;
      } else {
        console.log('ℹ️ Resposta sem JSON (status ' + response.status + ')');
        // Para responses 201/204 sem corpo, retornar null em vez de array vazio
        return null as T;
      }
      
    } catch (error) {
      console.error('❌ Erro na requisição API:', error);
      console.error('🔗 URL:', url);
      console.error('⚙️ Configuração:', config);
      throw error;
    }
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(apiConfig);
