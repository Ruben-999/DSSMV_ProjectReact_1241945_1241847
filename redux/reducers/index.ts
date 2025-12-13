// src/redux/reducers/index.ts
import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { lembreteReducer } from './lembreteReducer'
import { listaReducer } from './listaReducer';
import {categoriaReducer} from './categoriaReducer'

export const rootReducer = combineReducers({
  auth: authReducer,
  lembretes: lembreteReducer,
  listas: listaReducer,
  categorias: categoriaReducer,
});

export type RootState = ReturnType<typeof rootReducer>;