import { Dispatch } from 'redux';
import { apiLembretes } from '../../services/api';
import { 
  FETCH_LEMBRETES_REQUEST, FETCH_LEMBRETES_SUCCESS, FETCH_LEMBRETES_FAILURE,
  ADD_LEMBRETE_REQUEST, ADD_LEMBRETE_SUCCESS, ADD_LEMBRETE_FAILURE,
  UPDATE_LEMBRETE_REQUEST, UPDATE_LEMBRETE_SUCCESS, UPDATE_LEMBRETE_FAILURE,
  DELETE_LEMBRETE_REQUEST, DELETE_LEMBRETE_SUCCESS, DELETE_LEMBRETE_FAILURE,
  Lembrete,
  LembreteInput
} from '../types';

//Fetch
export const fetchLembretes = (userId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_LEMBRETES_REQUEST });
    try {
      const { data, error } = await apiLembretes.getLembretes(userId);
      if (error) throw new Error(error);
      dispatch({ type: FETCH_LEMBRETES_SUCCESS, payload: data });
    } catch (err: any) {
      dispatch({ type: FETCH_LEMBRETES_FAILURE, payload: err.message });
    }
  };
};

// 2. Add
export const addLembrete = (lembrete: LembreteInput) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: ADD_LEMBRETE_REQUEST });
    try {
      const { data, error } = await apiLembretes.createLembrete(lembrete);
      if (error) throw new Error(error);
      dispatch({ type: ADD_LEMBRETE_SUCCESS, payload: data });
    } catch (err: any) {
      dispatch({ type: ADD_LEMBRETE_FAILURE, payload: err.message });
    }
  };
};

// 3. Update (ex: marcar como concluído)
export const updateLembrete = (id: string, updates: Partial<Lembrete>) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: UPDATE_LEMBRETE_REQUEST });
    try {
      const { data, error } = await apiLembretes.updateLembrete(id, updates);
      if (error) throw new Error(error);
      dispatch({ type: UPDATE_LEMBRETE_SUCCESS, payload: data });
    } catch (err: any) {
      dispatch({ type: UPDATE_LEMBRETE_FAILURE, payload: err.message });
    }
  };
};

// 4. Delete
export const deleteLembrete = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: DELETE_LEMBRETE_REQUEST });
    try {
      const { error } = await apiLembretes.deleteLembrete(id);
      if (error) throw new Error(error);
      // No delete, o payload é o ID para removermos da lista localmente
      dispatch({ type: DELETE_LEMBRETE_SUCCESS, payload: id });
    } catch (err: any) {
      dispatch({ type: DELETE_LEMBRETE_FAILURE, payload: err.message });
    }
  };
};