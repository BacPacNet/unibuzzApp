import React, { createContext, useContext, useState, ReactNode } from "react";

const CommunityFilterContext = createContext<{
  selectedFiltersMain: Record<string, string[]>;
  setSelectedFiltersMain: (value: any) => void;
  selectedTypeMain: string[];
  setSelectedTypeMain: (value: any) => void;
  setSort: (value: string) => void;
  sort: string;
  createSelectedFilters: Record<string, string[]>;
  setCreateSelectedFilters: (value: any) => void;
  selectedLabelMain: string[];
  setSelectedLabelMain: (value: any) => void;
}>({
  selectedFiltersMain: {},
  setSelectedFiltersMain: () => {},
  selectedTypeMain: [],
  setSelectedTypeMain: () => {},
  sort: "",
  setSort: () => "",
  createSelectedFilters: {},
  setCreateSelectedFilters: () => {},
  selectedLabelMain: [],
  setSelectedLabelMain: () => {},
});

interface CommunityFilterProviderProps {
  children: ReactNode;
}

export const CommunityFilterProvider: React.FC<
  CommunityFilterProviderProps
> = ({ children }) => {
  const [selectedFiltersMain, setSelectedFiltersMain] = useState<
    Record<string, string[]>
  >({});
  const [selectedTypeMain, setSelectedTypeMain] = useState<any>([]);
  const [selectedLabelMain, setSelectedLabelMain] = useState<any>([]);
  const [sort, setSort] = useState("");
  const [createSelectedFilters, setCreateSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  return (
    <CommunityFilterContext.Provider
      value={{
        selectedFiltersMain,
        setSelectedFiltersMain,
        selectedTypeMain,
        setSelectedTypeMain,
        setSort,
        sort,
        createSelectedFilters,
        setCreateSelectedFilters,
        selectedLabelMain,
        setSelectedLabelMain,
      }}
    >
      {children}
    </CommunityFilterContext.Provider>
  );
};

export const useCommunityFilterContext = () => {
  return useContext(CommunityFilterContext);
};
