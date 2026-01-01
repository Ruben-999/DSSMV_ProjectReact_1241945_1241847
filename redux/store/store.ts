// src/redux/store/store.ts
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Middleware para async
import { rootReducer } from '../reducers';
import type { ThunkDispatch } from 'redux-thunk';
import type { UnknownAction } from 'redux';
import { useDispatch } from 'react-redux';

// Criação da store com middleware
export const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;

// Typed hook for dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

