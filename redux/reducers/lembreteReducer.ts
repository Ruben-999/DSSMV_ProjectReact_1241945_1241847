import { 
  LembreteState,
  FETCH_LEMBRETES_REQUEST, FETCH_LEMBRETES_SUCCESS, FETCH_LEMBRETES_FAILURE,
  ADD_LEMBRETE_REQUEST, ADD_LEMBRETE_SUCCESS, ADD_LEMBRETE_FAILURE,
  UPDATE_LEMBRETE_REQUEST, UPDATE_LEMBRETE_SUCCESS, UPDATE_LEMBRETE_FAILURE,
  DELETE_LEMBRETE_REQUEST, DELETE_LEMBRETE_SUCCESS, DELETE_LEMBRETE_FAILURE,
  LOGOUT
} from '../types';

const initialState: LembreteState = {
  items: [],
  loading: false,
  error: null,
};

export const lembreteReducer = (state = initialState, action: any): LembreteState => {
  switch (action.type) {
    
    // --- REQUESTS (Loading) ---
    case FETCH_LEMBRETES_REQUEST:
    case ADD_LEMBRETE_REQUEST:
    case UPDATE_LEMBRETE_REQUEST:
    case DELETE_LEMBRETE_REQUEST:
      return { ...state, loading: true, error: null };

    // --- SUCCESS ---
    
    case FETCH_LEMBRETES_SUCCESS: // Recebe array completo
      return { ...state, loading: false, items: action.payload };

    case ADD_LEMBRETE_SUCCESS: // Recebe 1 lembrete novo
      return { 
        ...state, 
        loading: false, 
        items: [action.payload, ...state.items] // Adiciona no início da lista
      };

    case UPDATE_LEMBRETE_SUCCESS: // Recebe o lembrete atualizado
      return {
        ...state,
        loading: false,
        items: state.items.map(item => 
          item.id === action.payload.id ? action.payload : item
        )
      };

    case DELETE_LEMBRETE_SUCCESS: // Recebe o ID removido
      return {
        ...state,
        loading: false,
        items: state.items.filter(item => item.id !== action.payload)
      };

    // --- FAILURES ---
    case FETCH_LEMBRETES_FAILURE:
    case ADD_LEMBRETE_FAILURE:
    case UPDATE_LEMBRETE_FAILURE:
    case DELETE_LEMBRETE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // --- LOGOUT (Limpar dados ao sair) ---
    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};