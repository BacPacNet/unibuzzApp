import { userProfileType } from "@/types/users";

export const getUniqueById = (arr: any[]) => {
  const seen = new Map();
  arr.forEach((item) => {
    if (!seen.has(item._id)) {
      seen.set(item._id, item);
    }
  });
  return Array.from(seen.values());
};

export const filterData = (data: userProfileType[], selectedFilters: any) => {
  const { year: selectedYears, major: selectedMajors } = selectedFilters;

  if (
    (!selectedYears || selectedYears.length === 0) &&
    (!selectedMajors || selectedMajors.length === 0)
  ) {
    return [];
  }

  return data?.filter((item) => {
    const matchesYear = selectedYears
      ? item.study_year == selectedYears[0]
      : true;

    const matchesMajor = selectedMajors?.length
      ? selectedMajors.includes(item.major)
      : true;

    if (selectedYears?.length) {
      return matchesYear && matchesMajor;
    } else if (selectedMajors?.length) {
      return matchesMajor;
    }

    return true;
  });
};

export const filterFacultyData = (
  data: userProfileType[],
  selectedFilters: any,
) => {
  const { occupation, affiliation } = selectedFilters;
  if (
    (!occupation || occupation.length === 0) &&
    (!affiliation || affiliation.length === 0)
  ) {
    return [];
  }
  return data?.filter((item) => {
    const matchesOccupation = occupation
      ? item.occupation === occupation[0]
      : true;
    const matchesAffiliation = affiliation?.length
      ? affiliation.includes(item.affiliation)
      : true;
    if (occupation) {
      return matchesOccupation && matchesAffiliation;
    } else if (affiliation?.length) {
      return matchesAffiliation;
    }

    return true;
  });
};
