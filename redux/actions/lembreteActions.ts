import { Dispatch } from 'redux';
import { apiCategorias, apiLembretes } from '../../services/api';
import { NotificationService } from '../../services/notification/NotificationService';
import { LocationService } from '../../services/location/LocationService';
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

export const addLembrete = (lembrete: LembreteInput) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: ADD_LEMBRETE_REQUEST });
    try {
      // Guarda na Base de Dados
      const { data, error } = await apiLembretes.createLembrete(lembrete);
      
      if (error) throw new Error(error);

      if (data) {
        // Agendar Notificação 
        await NotificationService.scheduleLembreteNotification(data);

        // Se tiver Localização, Iniciar Geofencing 
        if (data.local_latitude && data.local_longitude) {
           await LocationService.startGeofencing(
             data.id, 
             data.local_latitude, 
             data.local_longitude, 
             data.raio_metros || 100
           );
        }
      }

      dispatch({ type: ADD_LEMBRETE_SUCCESS, payload: data });
    } catch (err: any) {
      dispatch({ type: ADD_LEMBRETE_FAILURE, payload: err.message });
    }
  };
};

//Update (ex: marcar como concluído)
export const updateLembrete = (id: string, updates: Partial<LembreteInput>) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: UPDATE_LEMBRETE_REQUEST });
    try {
      // Atualizar na Base de Dados primeiro
      const { data, error } = await apiLembretes.updateLembrete(id, updates);
      if (error) throw new Error(error);

      if (data) {
        
        // Notificações
        await NotificationService.cancelNotificationByLembreteId(id); // Mata a velha
        if (data.notificar) {
           await NotificationService.scheduleLembreteNotification(data); // Cria a nova
        }

        // Geolocalização
        await LocationService.stopGeofencing(id); // Mata a velha
        if (data.local_latitude && data.local_longitude) {
           await LocationService.startGeofencing(
             data.id,
             data.local_latitude,
             data.local_longitude,
             data.raio_metros || 100
           );
        }
      }

      dispatch({ type: UPDATE_LEMBRETE_SUCCESS, payload: data });
    } catch (err: any) {
      console.error("Erro Update:", err);
      dispatch({ type: UPDATE_LEMBRETE_FAILURE, payload: err.message });
    }
  };
};

// Delete
export const deleteLembrete = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: DELETE_LEMBRETE_REQUEST });
    try {
      // Limpar Notificações e Geofence
      await NotificationService.cancelNotificationByLembreteId(id);
      await LocationService.stopGeofencing(id);

      // Apagar da Base de Dados
      const { error } = await apiLembretes.deleteLembrete(id);
      if (error) throw new Error(error);

      dispatch({ type: DELETE_LEMBRETE_SUCCESS, payload: id });
    } catch (err: any) {
      console.error("Erro Delete:", err);
      dispatch({ type: DELETE_LEMBRETE_FAILURE, payload: err.message });
    }
  };
};