import { Dispatch } from 'redux';
import { apiAuth } from '../../services/api' 
import { 
  LOGIN_REQUEST, 
  LOGIN_SUCCESS, 
  LOGIN_FAILURE, 
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  User 
} from '../types';

// Action Creator para Login
export const loginUser = (email: string, pass: string) => {
  return async (dispatch: Dispatch) => {
    // 1. Dispara ação de "Carregando"
    dispatch({ type: LOGIN_REQUEST });

    try {
      // 2. Chama o serviço (sem saber que é Supabase)
      const { data: user, error } = await apiAuth.signIn(email, pass);

      if (error) {
        throw new Error(error);
      }

      // 3. Sucesso!
      dispatch({ 
        type: LOGIN_SUCCESS, 
        payload: user 
      });

    } catch (err: any) {
      // 4. Falha
      dispatch({ 
        type: LOGIN_FAILURE, 
        payload: err.message || 'Erro ao fazer login'
      });
    }
  };
};

export const logoutUser = () => {
  return async (dispatch: Dispatch) => {
    try {
      // Tenta avisar o Supabase que saímos
      await apiAuth.signOut();
    } catch (error) {
      console.error("Erro ao fazer logout no backend:", error);
    } finally {
      // Isto garante que o utilizador volta ao ecrã inicial.
      dispatch({ type: LOGOUT });
    }
  };
}

export const registerUser = (email: string, pass: string, name: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: REGISTER_REQUEST }); // Avisa que começou

    try {
      // Chama o método signUp da interface
      const { data: user, error } = await apiAuth.signUp(email, pass, name);

      if (error) {
        throw new Error(error);
      }

      // Se sucesso, despacha o utilizador criado
      dispatch({ 
        type: REGISTER_SUCCESS, 
        payload: user 
      });

    } catch (err: any) {
      dispatch({ 
        type: REGISTER_FAILURE, 
        payload: err.message || 'Erro ao registar'
      });
    }
  };
};