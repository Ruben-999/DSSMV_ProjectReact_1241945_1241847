import { 
  AuthState, 
  LOGIN_REQUEST, 
  LOGIN_SUCCESS, 
  LOGIN_FAILURE,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS, 
  LOGOUT 
} from '../types';

const initialState: AuthState = {
  //user: null,
  //loading: false,
  //error: null,
  //isAuthenticated: false,
  // PARA TESTES, REPOR O QUE ESTÁ COMENTADO ACIMA DEPOIS
  user: {
    id: 'TEST_USER_ID',
    nome: 'TEST_USER',
    email: 'TEST_USER_EMAIL',
    created_at: '',
  },
  isAuthenticated: true,
  loading: false,
  error: null,
};

// O reducer recebe o estado atual e a action, e retorna o novo estado
export const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case LOGOUT:
      return {
        ...initialState, // Reseta tudo
      };
    default:
      return state;
  }
};