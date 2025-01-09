import { createContext, useContext } from "react";

interface AuthContextState {
  authenticate: (userData: any) => void;
  deauthenticate: () => void;
  isAuthenticated: boolean;
  setAuthenticated: () => void;
}

const AuthContext = createContext<AuthContextState>({
  authenticate: () => undefined,
  deauthenticate: () => undefined,
  setAuthenticated: () => undefined,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
