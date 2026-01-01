import {
  CategoriaState,
  FETCH_CATEGORIAS_REQUEST,
  FETCH_CATEGORIAS_SUCCESS,
  FETCH_CATEGORIAS_FAILURE,
  ADD_CATEGORIA_REQUEST,
  ADD_CATEGORIA_SUCCESS,
  ADD_CATEGORIA_FAILURE,
  UPDATE_CATEGORIA_REQUEST,
  UPDATE_CATEGORIA_SUCCESS,
  UPDATE_CATEGORIA_FAILURE,
  DELETE_CATEGORIA_REQUEST,
  DELETE_CATEGORIA_SUCCESS,
  DELETE_CATEGORIA_FAILURE,
  SET_CATEGORIA_ATIVA,
  LOGOUT,
} from '../types';

const ID_TODOS = 'todos';

const TODOS_CATEGORIA = {
  id: ID_TODOS,
  user_id: '',
  nome: 'Todos',
  created_at: '',
};

const initialState: CategoriaState = {
  items: [TODOS_CATEGORIA],
  categoriaAtivaId: ID_TODOS,
  loading: false,
  error: null,
};

export const categoriaReducer = (
  state = initialState,
  action: any
): CategoriaState => {
  switch (action.type) {
    // --- LOADING ---
    case FETCH_CATEGORIAS_REQUEST:
    case ADD_CATEGORIA_REQUEST:
    case UPDATE_CATEGORIA_REQUEST:
    case DELETE_CATEGORIA_REQUEST:
      return { ...state, loading: true, error: null };

    // --- SUCCESS ---
    case FETCH_CATEGORIAS_SUCCESS: {
      const apiCategorias = action.payload.filter(
        (c: any) => String(c.id) !== ID_TODOS
      );

      return {
        ...state,
        loading: false,
        items: [TODOS_CATEGORIA, ...apiCategorias],
        categoriaAtivaId: ID_TODOS,
      };
    }

    case ADD_CATEGORIA_SUCCESS:
      return {
        ...state,
        loading: false,
        items: [...state.items, action.payload],
      };

    case UPDATE_CATEGORIA_SUCCESS:
      if (String(action.payload.id) === ID_TODOS) return state;

      return {
        ...state,
        loading: false,
        items: state.items.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };

    case DELETE_CATEGORIA_SUCCESS:
      if (String(action.payload) === ID_TODOS) return state;

      return {
        ...state,
        loading: false,
        items: state.items.filter((c) => c.id !== action.payload),
        categoriaAtivaId:
          state.categoriaAtivaId === action.payload
            ? ID_TODOS
            : state.categoriaAtivaId,
      };

    // --- SET ATIVA ---
    case SET_CATEGORIA_ATIVA:
      return {
        ...state,
        categoriaAtivaId: action.payload,
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
