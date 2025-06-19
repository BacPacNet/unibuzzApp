import MultiSelectDropdown from "@/components/atoms/MultiSelectDropDown";
import Title from "@/components/atoms/Title";
import { cities } from "@/content/city";
import { REGION } from "@/content/constant";
import { COUNTRY } from "@/content/country";
import { Refresh, Search } from "iconoir-react-native";
import React, { useRef, useState, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import COUNTRY_TO_CITY from "@/content/country_to_city.json";
import REGION_TO_COUNTRY from "@/content/region_to_country.json";
import REGION_TO_CITY from "@/content/region_to_city.json";

// Constants
const FILTER_TYPES = ["Region", "Country", "City", "Type"];
const UNIVERSITY_TYPES = ["Private", "Public", "Community"];
const ACTION_SHEET_SNAP_POINTS = [70, 100];

// Types
type FilterType = typeof FILTER_TYPES[number];
type UniversityType = typeof UNIVERSITY_TYPES[number];

interface FilterFormData {
  region: string;
  country: string;
  city: string;
  type: UniversityType;
  Search: string;
}

interface Props {
  setQuery: (value: string) => void;
}

const UniversitySearchFilters: React.FC<Props> = ({ setQuery }) => {
  const {
    control,
    watch,
    reset,
    setValue,
  } = useForm<FilterFormData>();

  const [cityOptions, setCityOptions] = useState<string[]>(cities);
  const [countryOptions, setCountryOptions] = useState<string[]>(COUNTRY);
  
  const regionSheetRef = useRef<ActionSheetRef>(null);
  const countrySheetRef = useRef<ActionSheetRef>(null);
  const citySheetRef = useRef<ActionSheetRef>(null);
  const typeSheetRef = useRef<ActionSheetRef>(null);

  const sheetRefs: Record<FilterType, React.RefObject<ActionSheetRef>> = {
    Region: regionSheetRef,
    Country: countrySheetRef,
    City: citySheetRef,
    Type: typeSheetRef,
  };

  const currentFormData = watch();

  // Handlers
  const handleBottomSheet = useCallback((filterType: FilterType) => {
    sheetRefs[filterType].current?.show();
  }, [sheetRefs]);

  const closeAllSheets = useCallback(() => {
    Object.values(sheetRefs).forEach(ref => ref.current?.hide());
  }, [sheetRefs]);

  const handleRegionChange = useCallback((selectedRegion: string[], field: any) => {
    const region = selectedRegion?.[0];
    
    if (region) {
      field.onChange(region);
      setCountryOptions((REGION_TO_COUNTRY as any)[region].sort());
      setCityOptions((REGION_TO_CITY as any)[region].sort());
    } else {
      setValue("region", "");
      setCountryOptions(COUNTRY);
      setCityOptions(cities);
    }
    
    closeAllSheets();
    setQuery(JSON.stringify(watch()));
  }, [setValue, closeAllSheets, setQuery, watch]);

  const handleCountryChange = useCallback((selectedCountry: string[], field: any) => {
    const country = selectedCountry?.[0];
    
    if (country) {
      setCityOptions((COUNTRY_TO_CITY as any)[country].sort());
      field.onChange(country);
      setValue("city", "");
    } else {
      setValue("country", "");
      setCityOptions(cities);
    }
    
    closeAllSheets();
    setQuery(JSON.stringify(watch()));
  }, [setValue, closeAllSheets, setQuery, watch]);

  const handleCityChange = useCallback((selectedCity: string[], field: any) => {
    field.onChange(selectedCity?.[0]);
    closeAllSheets();
    setQuery(JSON.stringify(watch()));
  }, [closeAllSheets, setQuery, watch]);

  const handleTypeChange = useCallback((selectedType: string[], field: any) => {
    field.onChange(selectedType?.[0]);
    closeAllSheets();
    setQuery(JSON.stringify(watch()));
  }, [closeAllSheets, setQuery, watch]);

  const handleSearch = useCallback((text: string) => {
    const finalData = { ...currentFormData, Search: text };
    setQuery(JSON.stringify(finalData));
  }, [currentFormData, setQuery]);

  const handleReset = useCallback(() => {
    reset();
    setCityOptions(cities);
    setCountryOptions(COUNTRY);
    setQuery(JSON.stringify(watch()));
  }, [reset, setQuery, watch]);

  // Render helpers
  const renderFilterTag = useCallback((filterType: FilterType) => {
    const key = filterType.toLowerCase() as keyof FilterFormData;
    const value = currentFormData[key];
    
    return (
      <Text
        key={filterType}
        onPress={() => handleBottomSheet(filterType)}
        style={styles.searchTag}
      >
        {value?.length ? value : filterType}
      </Text>
    );
  }, [currentFormData, handleBottomSheet]);

  const renderActionSheet = useCallback((
    filterType: FilterType,
    options: string[],
    onChange: (selected: string[], field: any) => void,
    placeholder: string,
    search = false
  ) => (
    <ActionSheet
      ref={sheetRefs[filterType]}
      gestureEnabled={true}
      snapPoints={ACTION_SHEET_SNAP_POINTS}
    >
      <Controller
        name={filterType.toLowerCase() as keyof FilterFormData}
        control={control}
        render={({ field }) => (
          <MultiSelectDropdown
            options={options}
            value={Array.isArray(field.value) ? field.value : []}
            onChange={(selected: string[]) => onChange(selected, field)}
            placeholder={placeholder}
            err={false}
            multiSelect={false}
            setCityOptions={search ? setCityOptions : undefined}
            search={search}
          />
        )}
      />
    </ActionSheet>
  ), [sheetRefs, control, setCityOptions]);

  return (
    <>
      <View className="p-4 flex">
        <Title>Discover</Title>
        
        <View style={styles.searchTagContainer}>
          {FILTER_TYPES.map(renderFilterTag)}
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Refresh width={20} height={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex relative">
          <Search
            style={styles.searchIcon}
            width={24}
            height={24}
            color="#d4d4d4"
            className="absolute z-30"
          />

          <Controller
            control={control}
            name="Search"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#9ca3af"
                onChangeText={(text) => {
                  onChange(text);
                  handleSearch(text);
                }}
                value={value}
              />
            )}
          />
        </View>
      </View>

      {renderActionSheet("Region", REGION, handleRegionChange, "Region")}
      {renderActionSheet("Country", countryOptions, handleCountryChange, "Country", true)}
      {renderActionSheet("City", cityOptions, handleCityChange, "City", true)}
      {renderActionSheet("Type", UNIVERSITY_TYPES, handleTypeChange, "Type")}
    </>
  );
};

export default UniversitySearchFilters;

const styles = StyleSheet.create({
  searchTagContainer: {
    marginTop: 24,
    display: "flex",
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
  searchTag: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 8,
    borderRadius: 16,
    fontSize: 14,
    fontWeight: "500",
    height: 36,
    paddingHorizontal: 16,
  },
  resetButton: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    fontSize: 14,
    fontWeight: "500",
    backgroundColor: "#6744FF",
  },
  searchInput: {
    height: 42,
    marginTop: 0,
    paddingRight: 24,
    paddingLeft: 58,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    fontSize: 14,
  },
  searchIcon: {
    top: "50%",
    left: 24,
  },
});
