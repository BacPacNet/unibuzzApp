import React, { ReactNode, useCallback, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { deleteToken } from "@/storage/token";
import { removeUserProfileStore, removeUserStore } from "@/storage/user";

interface AuthProviderProps {
  children: ReactNode;
}

//const defaultUser: ZenotiTokenGuest = {
//  authToken: '',
//  centerId: '',
//  centerName: '',
//  firstName: '',
//  guestId: '',
//  lastName: '',
//  role: undefined,
//  userType: '',
//  username: '',
//};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const setAuthenticated = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const authenticate = (userData: any) => {};

  const deauthenticate = async () => {
    deleteToken();
    removeUserStore();
    removeUserProfileStore();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        authenticate,
        deauthenticate,
        isAuthenticated,
        setAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
