import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Community {
  name: string;
  id: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  major?: string;
  occupation?: string;
  affiliation?: string;
  year?: string;
 
}

export interface CommunityFilterContextType {
  studentYearState: string[];
  majorState: string[];
  occupationState: string[];
  affiliationState: string[];
  communityState: Community;
  selectedUsersState: User[];
  individualUserState: User | [];
  filteredUsersState: User[];
  filteredFacultyUsersState: User[];
  setStudentYearState: (val: string[]) => void;
  setMajorState: (val: string[]) => void;
  setOccupationState: (val: string[]) => void;
  setAffiliationState: (val: string[]) => void;
  setCommunityState: (val: Community) => void;
  setSelectedUsersState: (val: User[]) => void;
  setIndividualUserState: (val: User | []) => void;
  setFilteredUsersState: (val: User[]) => void;
  setFilteredFacultyUsersState: (val: User[]) => void;
  resetFilters: () => void;
  selectedTypeState: "student" | "faculty" | null;
  setSelectedTypeState: (val: "student" | "faculty" | null) => void;
}

const defaultContextValue: CommunityFilterContextType = {
  studentYearState: [],
  majorState: [],
  occupationState: [],
  affiliationState: [],
  communityState: { name: "", id: "" },
  selectedUsersState: [],
  individualUserState: [],
  filteredUsersState: [],
  filteredFacultyUsersState: [],
  setStudentYearState: () => {},
  setMajorState: () => {},
  setOccupationState: () => {},
  setAffiliationState: () => {},
  setCommunityState: () => {},
  setSelectedUsersState: () => {},
  setIndividualUserState: () => {},
  setFilteredUsersState: () => {},
  setFilteredFacultyUsersState: () => {},
  resetFilters: () => {},
  selectedTypeState: null,
  setSelectedTypeState: () => {},
};

const NewCommunityGroupStatesContext = createContext<CommunityFilterContextType>(defaultContextValue);

export const useNewCommunityGroupStatesContext = () => useContext(NewCommunityGroupStatesContext);

export const NewCommunityGroupStatesProvider = ({ children }: { children: ReactNode }) => {
  const [studentYearState, setStudentYearState] = useState<string[]>([]);
  const [majorState, setMajorState] = useState<string[]>([]);
  const [occupationState, setOccupationState] = useState<string[]>([]);
  const [affiliationState, setAffiliationState] = useState<string[]>([]);
  const [communityState, setCommunityState] = useState<Community>({ name: "", id: "" });
  const [selectedUsersState, setSelectedUsersState] = useState<User[]>([]);
  const [individualUserState, setIndividualUserState] = useState<User | []>([]);
  const [filteredUsersState, setFilteredUsersState] = useState<User[]>([]);
  const [filteredFacultyUsersState, setFilteredFacultyUsersState] = useState<User[]>([]);
  const [selectedTypeState, setSelectedTypeState] = useState<"student" | "faculty" | null>(null);
  const resetFilters = () => {
    setStudentYearState([]);
    setMajorState([]);
    setOccupationState([]);
    setAffiliationState([]);
    setCommunityState({ name: "", id: "" });
    setSelectedUsersState([]);
    setIndividualUserState([]);
    setFilteredUsersState([]);
    setFilteredFacultyUsersState([]);
  };

  return (
    <NewCommunityGroupStatesContext.Provider
      value={{
        studentYearState,
        setStudentYearState,
        majorState,
        setMajorState,
        occupationState,
        setOccupationState,
        affiliationState,
        setAffiliationState,
        communityState,
        setCommunityState,
        selectedUsersState,
        setSelectedUsersState,
        individualUserState,
        setIndividualUserState,
        filteredUsersState,
        setFilteredUsersState,
        filteredFacultyUsersState,
        setFilteredFacultyUsersState,
        resetFilters,
        selectedTypeState,
        setSelectedTypeState
      }}
    >
      {children}
    </NewCommunityGroupStatesContext.Provider>
  );
};
