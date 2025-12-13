import { Dispatch } from 'redux';
import { apiCategorias } from '../../services/api';
import { 
  FETCH_CATEGORIAS_REQUEST, FETCH_CATEGORIAS_SUCCESS, FETCH_CATEGORIAS_FAILURE,
  ADD_CATEGORIA_REQUEST, ADD_CATEGORIA_SUCCESS, ADD_CATEGORIA_FAILURE,
  UPDATE_CATEGORIA_REQUEST, UPDATE_CATEGORIA_SUCCESS, UPDATE_CATEGORIA_FAILURE,
  DELETE_CATEGORIA_REQUEST, DELETE_CATEGORIA_SUCCESS, DELETE_CATEGORIA_FAILURE
} from '../types';
import { Categoria } from '../types';

// Fetch
export const fetchCategorias = (userId: string) => async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_CATEGORIAS_REQUEST });
    try {
        const { data, error } = await apiCategorias.getCategorias(userId);
        if (error) throw new Error(error);
        dispatch({ type: FETCH_CATEGORIAS_SUCCESS, payload: data });
    } catch (err: any) {
        dispatch({ type: FETCH_CATEGORIAS_FAILURE, payload: err.message });
    }
};

// Add
export const addCategoria = (categoria: Omit<Categoria, 'id' | 'created_at'>) => async (dispatch: Dispatch) => {
    dispatch({ type: ADD_CATEGORIA_REQUEST });
    try {
        const { data, error } = await apiCategorias.createCategoria(categoria);
        if (error) throw new Error(error);
        dispatch({ type: ADD_CATEGORIA_SUCCESS, payload: data });
    } catch (err: any) {
        dispatch({ type: ADD_CATEGORIA_FAILURE, payload: err.message });
    }
};

// Update
export const updateCategoria = (id: string, updates: Partial<Categoria>) => async (dispatch: Dispatch) => {
    dispatch({ type: UPDATE_CATEGORIA_REQUEST });
    try {
        const { data, error } = await apiCategorias.updateCategoria(id, updates);
        if (error) throw new Error(error);
        dispatch({ type: UPDATE_CATEGORIA_SUCCESS, payload: data });
    } catch (err: any) {
        dispatch({ type: UPDATE_CATEGORIA_FAILURE, payload: err.message });
    }
};

// Delete
export const deleteCategoria = (id: string) => async (dispatch: Dispatch) => {
    dispatch({ type: DELETE_CATEGORIA_REQUEST });
    try {
        const { error } = await apiCategorias.deleteCategoria(id);
        if (error) throw new Error(error);
        dispatch({ type: DELETE_CATEGORIA_SUCCESS, payload: id });
    } catch (err: any) {
        dispatch({ type: DELETE_CATEGORIA_FAILURE, payload: err.message });
    }
};