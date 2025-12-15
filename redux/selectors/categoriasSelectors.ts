import { RootState } from '../store/store';
import { Categoria } from '../types';

export const selectCategorias = (state: RootState): Categoria[] =>
  state.categorias.items;
