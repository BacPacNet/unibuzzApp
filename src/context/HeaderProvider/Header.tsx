import React, { createContext, useContext, useState, ReactNode } from "react";

const HeaderContext = createContext<{
  showHeader: boolean;
  changeHeaderShownStatus: (value: boolean) => void;
  currScreen: string;
  setCurrScreen: (value: string) => void;
}>({
  showHeader: true,
  changeHeaderShownStatus: () => {},
  currScreen: "",
  setCurrScreen: () => {},
});

interface HeaderProviderProps {
  children: ReactNode;
}

export const HeaderProvider: React.FC<HeaderProviderProps> = ({ children }) => {
  const [showHeader, setShowHeader] = useState(true);
  const [currScreen, setCurrScreen] = useState("");

  const changeHeaderShownStatus = (value: boolean) => {
    setShowHeader(value);
  };

  return (
    <HeaderContext.Provider
      value={{ showHeader, changeHeaderShownStatus, currScreen, setCurrScreen }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  return useContext(HeaderContext);
};
