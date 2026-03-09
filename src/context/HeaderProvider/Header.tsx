import { useFirebaseMessaging } from "@/hooks/useFirebaseMessaging";
import { useGetUserEligibleForRewards } from "@/services/user";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

const HeaderContext = createContext<{
  showHeader: boolean;
  changeHeaderShownStatus: (value: boolean) => void;
  currScreen: string;
  setCurrScreen: (value: string) => void;
  isTabBarVisible: boolean;
  setIsTabBarVisible: (value: boolean) => void;
  isUserEligibleForRewards: boolean;
}>({
  showHeader: true,
  changeHeaderShownStatus: () => {},
  currScreen: "",
  setCurrScreen: () => {},
  isTabBarVisible: true,
  setIsTabBarVisible: () => {},
  isUserEligibleForRewards: false,
});

interface HeaderProviderProps {
  children: ReactNode;
}

export const HeaderProvider: React.FC<HeaderProviderProps> = ({ children }) => {
  const [showHeader, setShowHeader] = useState(true);
  const [currScreen, setCurrScreen] = useState("");
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  const { data: userEligibleForRewardsData, isSuccess } = useGetUserEligibleForRewards()
  const [isUserEligibleForRewards, setIsUserEligibleForRewards] = useState<boolean>(false);
  useFirebaseMessaging();

  useEffect(() => {
    setIsUserEligibleForRewards(userEligibleForRewardsData?.eligible || false)
  }, [userEligibleForRewardsData])

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
        isUserEligibleForRewards
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  return useContext(HeaderContext);
};
