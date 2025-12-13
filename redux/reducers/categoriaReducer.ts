import { 
  CategoriaState,
  FETCH_CATEGORIAS_REQUEST, FETCH_CATEGORIAS_SUCCESS, FETCH_CATEGORIAS_FAILURE,
  ADD_CATEGORIA_REQUEST, ADD_CATEGORIA_SUCCESS, ADD_CATEGORIA_FAILURE,
  UPDATE_CATEGORIA_REQUEST, UPDATE_CATEGORIA_SUCCESS, UPDATE_CATEGORIA_FAILURE,
  DELETE_CATEGORIA_REQUEST, DELETE_CATEGORIA_SUCCESS, DELETE_CATEGORIA_FAILURE,
  LOGOUT
} from '../types';
import { listaReducer } from './listaReducer';

const initialState: CategoriaState = {
  items: [],
  loading: false,
  error: null,
};

export const categoriaReducer = (state = initialState, action: any): CategoriaState => {
  switch (action.type) {
    
    // --- LOADING ---
    case FETCH_CATEGORIAS_REQUEST:
    case ADD_CATEGORIA_REQUEST:
    case UPDATE_CATEGORIA_REQUEST:
    case DELETE_CATEGORIA_REQUEST:
      return { ...state, loading: true, error: null };

    // --- SUCCESS ---
    case FETCH_CATEGORIAS_SUCCESS:
      return { ...state, loading: false, items: action.payload };

    case ADD_CATEGORIA_SUCCESS:
      return { ...state, loading: false, items: [...state.items, action.payload] };

    case UPDATE_CATEGORIA_SUCCESS:
      return {
        ...state,
        loading: false,
        items: state.items.map(item => item.id === action.payload.id ? action.payload : item)
      };

    case DELETE_CATEGORIA_SUCCESS:
      return {
        ...state, 
        loading: false,
        items: state.items.filter(item => item.id !== action.payload)
      };
    
    // --- FAILURE ---
    case FETCH_CATEGORIAS_FAILURE:
    case ADD_CATEGORIA_FAILURE:
    case UPDATE_CATEGORIA_FAILURE:
    case DELETE_CATEGORIA_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};