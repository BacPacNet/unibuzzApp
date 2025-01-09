import { useAuth } from "@/context/AuthProvider/AuthContext";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const UnauthenticatedGuard = ({ children }: Props) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export default UnauthenticatedGuard;
