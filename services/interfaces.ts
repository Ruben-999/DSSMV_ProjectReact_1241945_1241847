import { User, Lembrete, Lista, Categoria } from '../redux/types'; 

// Interface genérica de resposta para manter consistência
export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
}

// O Contrato para Autenticação
export interface IAuthService {
  signIn(email: string, pass: string): Promise<ServiceResponse<User>>;
  signUp(email: string, pass: string, name: string): Promise<ServiceResponse<User>>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

export interface ILembreteService {
  // Buscar todos os lembretes do utilizador
  getLembretes(userId: string): Promise<ServiceResponse<Lembrete[]>>;
  
  // Criar (recebe tudo menos id e created_at)
  createLembrete(lembrete: Omit<Lembrete, 'id' | 'created_at'>): Promise<ServiceResponse<Lembrete>>;
  
  // Atualizar (recebe o ID e apenas os campos que mudaram - Partial)
  updateLembrete(id: string, updates: Partial<Lembrete>): Promise<ServiceResponse<Lembrete>>;
  
  // Apagar
  deleteLembrete(id: string): Promise<ServiceResponse<boolean>>;
}

export interface IListaService {
  // Buscar todas as listas do user
  getListas(userId: string): Promise<ServiceResponse<Lista[]>>;
  
  // Criar lista (apenas precisa do nome e user_id)
  createLista(lista: Omit<Lista, 'id' | 'created_at' | 'is_default'>): Promise<ServiceResponse<Lista>>;

  //Atualizar
  updateLista(id: string, updates: Partial<Lista>): Promise<ServiceResponse<Lista>>,
  
  // Apagar lista
  deleteLista(id: string): Promise<ServiceResponse<boolean>>;
}

export interface ICategoriaService {
  getCategorias(userId: string): Promise<ServiceResponse<Categoria[]>>;
  
  // Criar (nome obrigatório, cor opcional)
  createCategoria(Categoria: Omit<Categoria, 'id' | 'created_at'>): Promise<ServiceResponse<Categoria>>;
  
  updateCategoria(id: string, updates: Partial<Categoria>): Promise<ServiceResponse<Categoria>>;
  
  deleteCategoria(id: string): Promise<ServiceResponse<boolean>>;
}