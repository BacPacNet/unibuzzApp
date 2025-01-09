import { useAuth } from "@/context/AuthProvider/AuthContext";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const AuthGuard = ({ children }: Props) => {
  const { isAuthenticated } = useAuth();

  // If the user has no centerId (most likely an FOH),
  // we treat them as unauthenticated and force center selection.
  if (isAuthenticated) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return null;
};

export default AuthGuard;
