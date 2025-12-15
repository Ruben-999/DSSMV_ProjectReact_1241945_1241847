import { RootState } from '../store/store';

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectUserId = (state: RootState) => state.auth.user?.id;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
