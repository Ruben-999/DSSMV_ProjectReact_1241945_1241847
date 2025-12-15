import { RootState } from '../../redux/store/store';
import { Lembrete } from '../types';

export const selectAllLembretes = (state: RootState): Lembrete[] =>
  state.lembretes.items;

export const selectLembretesHoje = (state: RootState): Lembrete[] =>
  state.lembretes.items.filter(l => !l.completed);

export const selectLembretesConcluidos = (state: RootState): Lembrete[] =>
  state.lembretes.items.filter(l => l.completed);
