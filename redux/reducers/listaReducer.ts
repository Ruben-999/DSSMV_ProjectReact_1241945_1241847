import { 
  ListaState,
  FETCH_LISTAS_REQUEST, FETCH_LISTAS_SUCCESS, FETCH_LISTAS_FAILURE,
  ADD_LISTA_REQUEST, ADD_LISTA_SUCCESS, ADD_LISTA_FAILURE,
  DELETE_LISTA_REQUEST, DELETE_LISTA_SUCCESS, DELETE_LISTA_FAILURE,
  UPDATE_LISTA_REQUEST, UPDATE_LISTA_SUCCESS, UPDATE_LISTA_FAILURE,
  LOGOUT
} from '../types';

const initialState: ListaState = {
  items: [],
  loading: false,
  error: null,
};

export const listaReducer = (state = initialState, action: any): ListaState => {
  switch (action.type) {
    
    // --- LOADING ---
    case FETCH_LISTAS_REQUEST:
    case ADD_LISTA_REQUEST:
    case DELETE_LISTA_REQUEST:
    case UPDATE_LISTA_REQUEST:
      return { ...state, loading: true, error: null };

    // --- SUCCESS ---
    case FETCH_LISTAS_SUCCESS:
      return { ...state, loading: false, items: action.payload };

    case ADD_LISTA_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        items: [...state.items, action.payload] // Adiciona ao fim da lista
      };


    case UPDATE_LISTA_SUCCESS: // Recebe o lembrete atualizado
      return {
        ...state,
        loading: false,
        items: state.items.map(item => 
        item.id === action.payload.id ? action.payload : item
        )
     };

    case DELETE_LISTA_SUCCESS:
      return {
        ...state,
        loading: false,
        items: state.items.filter(item => item.id !== action.payload)
      };

    // --- FAILURE ---
    case FETCH_LISTAS_FAILURE:
    case ADD_LISTA_FAILURE:
    case UPDATE_LISTA_FAILURE:
    case DELETE_LISTA_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // --- LOGOUT ---
    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};