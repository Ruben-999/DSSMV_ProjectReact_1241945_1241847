// ========================================================================
// Tipos Auth
//=========================================================================

//Definição do User 
export interface User {
  id: string;
  nome: string;
  email: string;
  created_at: string;
}

//Estado da Autenticação
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

//Tipos das Actions (Constantes para o Reducer)
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

// ========================================================================
// Tipos Lembretes
//=========================================================================

export type Prioridade = 0 | 1 | 2 | 3; // 0: Nenhuma, 1: Baixa, 2: Média, 3: Alta

export interface Lembrete {
  id: string; // BIGSERIAL no SQL, mas vem como string no JSON geralmente
  user_id: string;
  lista_id: number | null; // BIGINT
  categoria_id: number | null; // BIGINT
  titulo: string;
  descricao?: string; // ? --> opcional
  prioridade: Prioridade;
  data_hora?: string; // TIMESTAMP (ISO String)
  notificar: boolean;
  antecedencia_minutos: number;
  repeticao?: string;
  local_latitude?: number;
  local_longitude?: number;
  raio_metros?: number;
  foto_url?: string;
  concluido: boolean;
  created_at: string;
}

// --- ESTADO REDUX ---

export interface LembreteState {
  items: Lembrete[];
  loading: boolean;
  error: string | null;
}

// --- ACTION TYPES ---

// Fetch (Ler todos)
export const FETCH_LEMBRETES_REQUEST = 'FETCH_LEMBRETES_REQUEST';
export const FETCH_LEMBRETES_SUCCESS = 'FETCH_LEMBRETES_SUCCESS';
export const FETCH_LEMBRETES_FAILURE = 'FETCH_LEMBRETES_FAILURE';

// Create (Criar novo)
export const ADD_LEMBRETE_REQUEST = 'ADD_LEMBRETE_REQUEST';
export const ADD_LEMBRETE_SUCCESS = 'ADD_LEMBRETE_SUCCESS';
export const ADD_LEMBRETE_FAILURE = 'ADD_LEMBRETE_FAILURE';

// Update (Editar/Concluir)
export const UPDATE_LEMBRETE_REQUEST = 'UPDATE_LEMBRETE_REQUEST';
export const UPDATE_LEMBRETE_SUCCESS = 'UPDATE_LEMBRETE_SUCCESS';
export const UPDATE_LEMBRETE_FAILURE = 'UPDATE_LEMBRETE_FAILURE';

// Delete (Apagar)
export const DELETE_LEMBRETE_REQUEST = 'DELETE_LEMBRETE_REQUEST';
export const DELETE_LEMBRETE_SUCCESS = 'DELETE_LEMBRETE_SUCCESS';
export const DELETE_LEMBRETE_FAILURE = 'DELETE_LEMBRETE_FAILURE';

// ========================================================================
// Tipos Listas
//=========================================================================

export interface Lista {
  id: string; // BIGINT no SQL
  user_id: string;
  nome: string;
  is_default: boolean; // Para saber se é a lista "Default" que não deve ser apagada
  descricao?: string | null;
  cor_hex?: string | null;
  created_at: string;
}

// --- ESTADO REDUX ---

export interface ListaState {
  items: Lista[];
  loading: boolean;
  error: string | null;
}

// --- ACTION TYPES --- (Dispacher)

// Fetch
export const FETCH_LISTAS_REQUEST = 'FETCH_LISTAS_REQUEST';
export const FETCH_LISTAS_SUCCESS = 'FETCH_LISTAS_SUCCESS';
export const FETCH_LISTAS_FAILURE = 'FETCH_LISTAS_FAILURE';

// Add
export const ADD_LISTA_REQUEST = 'ADD_LISTA_REQUEST';
export const ADD_LISTA_SUCCESS = 'ADD_LISTA_SUCCESS';
export const ADD_LISTA_FAILURE = 'ADD_LISTA_FAILURE';

//Update
export const UPDATE_LISTA_REQUEST = 'UPDATE_LISTA_REQUEST';
export const UPDATE_LISTA_SUCCESS = 'UPDATE_LISTA_SUCCESS';
export const UPDATE_LISTA_FAILURE = 'UPDATE_LISTA_FAILURE';

// Delete
export const DELETE_LISTA_REQUEST = 'DELETE_LISTA_REQUEST';
export const DELETE_LISTA_SUCCESS = 'DELETE_LISTA_SUCCESS';
export const DELETE_LISTA_FAILURE = 'DELETE_LISTA_FAILURE';

// ========================================================================
// Tipos Categorias
//=========================================================================

export interface Categoria {
  id: string; // BIGINT | 'todos'
  user_id: string;
  nome: string;
  cor_hex?: string;
  created_at: string;
}

// --- ESTADO REDUX ---

export interface CategoriaState {
  items: Categoria[];
  categoriaAtivaId: string;
  loading: boolean;
  error: string | null;
}

// --- ACTION TYPES ---

export const SET_CATEGORIA_ATIVA = 'SET_CATEGORIA_ATIVA';

// Fetch
export const FETCH_CATEGORIAS_REQUEST = 'FETCH_CATEGORIAS_REQUEST';
export const FETCH_CATEGORIAS_SUCCESS = 'FETCH_CATEGORIAS_SUCCESS';
export const FETCH_CATEGORIAS_FAILURE = 'FETCH_CATEGORIAS_FAILURE';

// Add
export const ADD_CATEGORIA_REQUEST = 'ADD_CATEGORIA_REQUEST';
export const ADD_CATEGORIA_SUCCESS = 'ADD_CATEGORIA_SUCCESS';
export const ADD_CATEGORIA_FAILURE = 'ADD_CATEGORIA_FAILURE';

// Update
export const UPDATE_CATEGORIA_REQUEST = 'UPDATE_CATEGORIA_REQUEST';
export const UPDATE_CATEGORIA_SUCCESS = 'UPDATE_CATEGORIA_SUCCESS';
export const UPDATE_CATEGORIA_FAILURE = 'UPDATE_CATEGORIA_FAILURE';

// Delete
export const DELETE_CATEGORIA_REQUEST = 'DELETE_CATEGORIA_REQUEST';
export const DELETE_CATEGORIA_SUCCESS = 'DELETE_CATEGORIA_SUCCESS';
export const DELETE_CATEGORIA_FAILURE = 'DELETE_CATEGORIA_FAILURE';