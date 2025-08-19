import React, { ReactNode, useCallback, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { deleteToken } from "@/storage/token";
import { removeUserProfileStore, removeUserStore } from "@/storage/user";

interface AuthProviderProps {
  children: ReactNode;
}

let authStateChangeCallbacks: (() => void)[] = [];

export const subscribeToAuthStateChange = (callback: () => void) => {
  authStateChangeCallbacks.push(callback);
  return () => {
    authStateChangeCallbacks = authStateChangeCallbacks.filter(
      (cb) => cb !== callback
    );
  };
};

export const triggerAuthStateChange = () => {
  authStateChangeCallbacks.forEach((callback) => callback());
};

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

  useEffect(() => {
    const unsubscribe = subscribeToAuthStateChange(() => {
      deauthenticate();
    });

    return unsubscribe;
  }, []);

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
