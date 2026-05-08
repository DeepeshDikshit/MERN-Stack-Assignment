import { createContext } from 'react';

export const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  login: () => {},
  register: () => {},
  logout: () => {},
  setUser: () => {},
});
