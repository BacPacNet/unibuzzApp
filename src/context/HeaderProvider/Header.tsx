import { useFirebaseMessaging } from "@/hooks/useFirebaseMessaging";
import React, { createContext, useContext, useState, ReactNode } from "react";

const HeaderContext = createContext<{
  showHeader: boolean;
  changeHeaderShownStatus: (value: boolean) => void;
  currScreen: string;
  setCurrScreen: (value: string) => void;
  isTabBarVisible: boolean;
  setIsTabBarVisible: (value: boolean) => void;
}>({
  showHeader: true,
  changeHeaderShownStatus: () => {},
  currScreen: "",
  setCurrScreen: () => {},
  isTabBarVisible: true,
  setIsTabBarVisible: () => {},
});

interface HeaderProviderProps {
  children: ReactNode;
}

export const HeaderProvider: React.FC<HeaderProviderProps> = ({ children }) => {
  const [showHeader, setShowHeader] = useState(true);
  const [currScreen, setCurrScreen] = useState("");
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  useFirebaseMessaging();

  const changeHeaderShownStatus = (value: boolean) => {
    setShowHeader(value);
  };

  return (
    <HeaderContext.Provider
      value={{
        showHeader,
        changeHeaderShownStatus,
        currScreen,
        setCurrScreen,
        isTabBarVisible,
        setIsTabBarVisible,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  return useContext(HeaderContext);
};
