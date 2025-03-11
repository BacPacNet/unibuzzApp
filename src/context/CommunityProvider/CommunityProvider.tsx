import React, { createContext, useContext, useState, ReactNode } from "react";

const CommunityContext = createContext<{
  currentCommunityId: string;
  setCurrentCommunityId: (value: string) => void;
  currentCommunityGroupId: string;
  setCurrentCommunityGroupId: (value: string) => void;
}>({
  currentCommunityId: "",
  setCurrentCommunityId: () => {},
  currentCommunityGroupId: "",
  setCurrentCommunityGroupId: () => {},
});

interface CommunityProviderProps {
  children: ReactNode;
}

export const CommunityProvider: React.FC<CommunityProviderProps> = ({
  children,
}) => {
  const [currentCommunityId, setCurrentCommunityId] = useState("");
  const [currentCommunityGroupId, setCurrentCommunityGroupId] = useState("");

  return (
    <CommunityContext.Provider
      value={{
        currentCommunityId,
        setCurrentCommunityId,
        currentCommunityGroupId,
        setCurrentCommunityGroupId,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunityContext = () => {
  return useContext(CommunityContext);
};
