import React, { createContext, useContext, useState, ReactNode } from "react";

const CommunityContext = createContext<{
  currentCommunityId: string;
  setCurrentCommunityId: (value: string) => void;
  currentCommunityGroupId: string;
  setCurrentCommunityGroupId: (value: string) => void;
  selectedCommunityGroupLogo: string;
  setSelectedCommunityGroupLogo: (value: string) => void;
  selectedCommunityId: string;
  setSelectedCommunityId: (value: string) => void;
  isCommunityGroup: boolean;
  setIsCommunityGroup: (value: boolean) => void;
  refetchFilterCommunityGroupsRef: () => void;
  refetchFilterCommunityGroups: boolean;
}>({
  currentCommunityId: "",
  setCurrentCommunityId: () => {},
  currentCommunityGroupId: "",
  setCurrentCommunityGroupId: () => {},
  selectedCommunityGroupLogo: "",
  setSelectedCommunityGroupLogo: () => {},
  selectedCommunityId: "",
  setSelectedCommunityId: () => {},
  isCommunityGroup: false,
  setIsCommunityGroup: () => {},
  refetchFilterCommunityGroupsRef: () => {},
  refetchFilterCommunityGroups: false,
});

interface CommunityProviderProps {
  children: ReactNode;
}

export const CommunityProvider: React.FC<CommunityProviderProps> = ({
  children,
}) => {
  const [currentCommunityId, setCurrentCommunityId] = useState("");
  const [currentCommunityGroupId, setCurrentCommunityGroupId] = useState("");
  const [selectedCommunityGroupLogo, setSelectedCommunityGroupLogo] =
    useState("");
  const [selectedCommunityId, setSelectedCommunityId] = useState("");
  const [isCommunityGroup, setIsCommunityGroup] = useState(false);
  const [refetchFilterCommunityGroups, setRefetchFilterCommunityGroups] =
    useState(false);
  const refetchFilterCommunityGroupsRef = () => {
    setRefetchFilterCommunityGroups(!refetchFilterCommunityGroups);
  };
  return (
    <CommunityContext.Provider
      value={{
        currentCommunityId,
        setCurrentCommunityId,
        currentCommunityGroupId,
        setCurrentCommunityGroupId,
        selectedCommunityGroupLogo,
        setSelectedCommunityGroupLogo,
        selectedCommunityId,
        setSelectedCommunityId,
        isCommunityGroup,
        setIsCommunityGroup,
        refetchFilterCommunityGroupsRef,
        refetchFilterCommunityGroups,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunityContext = () => {
  return useContext(CommunityContext);
};
