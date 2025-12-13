// src/redux/store/store.ts
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Middleware para async
import { rootReducer } from '../reducers';

// Criação da store com middleware
export const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);