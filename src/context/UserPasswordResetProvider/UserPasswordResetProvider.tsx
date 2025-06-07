import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

type UserPasswordResetState = {
  resetEmail: string;
  resetToken: string;
  resetPassword: string;
};

type UserPasswordResetAction = {
  setResetPasswordEmail: (email: string) => void;
  setResetPasswordToken: (token: string) => void;
  setResetPassword: (password: string) => void;
  setResetPasswordData: (data: Partial<UserPasswordResetState>) => void;
  resetPasswordResetData: () => void;
  reinitResetPasswordTimeout: () => void;
};

type UserPasswordResetContextType = UserPasswordResetState &
  UserPasswordResetAction;

const initialState: UserPasswordResetState = {
  resetEmail: "",
  resetToken: "",
  resetPassword: "",
};

const UserPasswordResetContext = createContext<
  UserPasswordResetContextType | undefined
>(undefined);

let tokenTimeout: ReturnType<typeof setTimeout> | null = null;

export const UserPasswordResetProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [resetEmail, setResetEmail] = useState(initialState.resetEmail);
  const [resetToken, setResetTokenState] = useState(initialState.resetToken);
  const [resetPassword, setResetPasswordState] = useState(
    initialState.resetPassword,
  );

  const clearTokenTimeout = () => {
    if (tokenTimeout) {
      clearTimeout(tokenTimeout);
      tokenTimeout = null;
    }
  };

  const setResetPasswordToken = useCallback((token: string) => {
    clearTokenTimeout();
    setResetTokenState(token);

    tokenTimeout = setTimeout(() => {
      setResetTokenState("");
      console.log("Token expired and cleared.");
    }, 300 * 1000);
  }, []);

  const reinitResetPasswordTimeout = useCallback(() => {
    if (resetToken && !tokenTimeout) {
      tokenTimeout = setTimeout(() => {
        setResetTokenState("");
        console.log("Token expired and cleared.");
      }, 300 * 1000);
    }
  }, [resetToken]);

  const setResetPasswordEmail = (email: string) => setResetEmail(email);
  const setResetPassword = (password: string) =>
    setResetPasswordState(password);

  const setResetPasswordData = (data: Partial<UserPasswordResetState>) => {
    if (data.resetEmail !== undefined) setResetEmail(data.resetEmail);
    if (data.resetToken !== undefined) setResetTokenState(data.resetToken);
    if (data.resetPassword !== undefined)
      setResetPasswordState(data.resetPassword);
  };

  const resetPasswordResetData = () => {
    clearTokenTimeout();
    setResetEmail(initialState.resetEmail);
    setResetTokenState(initialState.resetToken);
    setResetPasswordState(initialState.resetPassword);
  };

  const value: UserPasswordResetContextType = {
    resetEmail,
    resetToken,
    resetPassword,
    setResetPasswordEmail,
    setResetPasswordToken,
    setResetPassword,
    setResetPasswordData,
    resetPasswordResetData,
    reinitResetPasswordTimeout,
  };

  return (
    <UserPasswordResetContext.Provider value={value}>
      {children}
    </UserPasswordResetContext.Provider>
  );
};

export const useUserPasswordReset = (): UserPasswordResetContextType => {
  const context = useContext(UserPasswordResetContext);
  if (!context) {
    throw new Error(
      "useUserPasswordReset must be used within a UserPasswordResetProvider",
    );
  }
  return context;
};
