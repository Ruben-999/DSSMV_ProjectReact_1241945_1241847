import { Dispatch } from 'redux';
import { apiListas } from '../../services/api';
import { 
  FETCH_LISTAS_REQUEST, FETCH_LISTAS_SUCCESS, FETCH_LISTAS_FAILURE,
  ADD_LISTA_REQUEST, ADD_LISTA_SUCCESS, ADD_LISTA_FAILURE,
  DELETE_LISTA_REQUEST, DELETE_LISTA_SUCCESS, DELETE_LISTA_FAILURE,
  UPDATE_LISTA_REQUEST, UPDATE_LISTA_SUCCESS,UPDATE_LISTA_FAILURE,
  Lista
} from '../types';

// Fetch Listas
export const fetchListas = (userId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_LISTAS_REQUEST });
    try {
      const { data, error } = await apiListas.getListas(userId);
      if (error) throw new Error(error);
      dispatch({ type: FETCH_LISTAS_SUCCESS, payload: data });
    } catch (err: any) {
      dispatch({ type: FETCH_LISTAS_FAILURE, payload: err.message });
    }
  };
};

// Add Lista
export const addLista = (lista: Omit<Lista, 'id' | 'created_at' | 'is_default'>) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: ADD_LISTA_REQUEST });
    try {
      const { data, error } = await apiListas.createLista(lista);
      if (error) throw new Error(error);
      dispatch({ type: ADD_LISTA_SUCCESS, payload: data });
    } catch (err: any) {
      dispatch({ type: ADD_LISTA_FAILURE, payload: err.message });
    }
  };
};

// Update Lista
export const updateLista = (id: string, updates: Partial<Lista>) => {
    return async (dispatch: Dispatch) => {
        dispatch({type: UPDATE_LISTA_REQUEST});
        try{
            const {data,error} = await apiListas.updateLista(id,updates)
            if(error) throw new Error (error)
            dispatch({type: UPDATE_LISTA_SUCCESS, payload: data})
        } catch (err:any) {
            dispatch({ type: UPDATE_LISTA_FAILURE, payload: err.message });
        }
    }
}

// Delete Lista
export const deleteLista = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: DELETE_LISTA_REQUEST });
    try {
      const { error } = await apiListas.deleteLista(id);
      if (error) throw new Error(error);
      dispatch({ type: DELETE_LISTA_SUCCESS, payload: id }); // Payload é o ID para remover do estado
    } catch (err: any) {
      dispatch({ type: DELETE_LISTA_FAILURE, payload: err.message });
    }
  };
};