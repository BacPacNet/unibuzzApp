import MultiSelectDropdown from "@/components/atoms/MultiSelectDropDown";
import Title from "@/components/atoms/Title";
import { cities } from "@/content/city";
import { REGION } from "@/content/constant";
import { COUNTRY } from "@/content/country";
import { Search } from "iconoir-react-native";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import COUNTRY_TO_CITY from "@/content/country_to_city.json";
import REGION_TO_COUNTRY from "@/content/region_to_country.json";
import REGION_TO_CITY from "@/content/region_to_city.json";

type Props = {
  setQuery: (value: string) => void;
};

const UniversitySearchFilters = ({ setQuery }: Props) => {
  const {
    control,

    watch,
    reset,
    setValue,
  } = useForm();
  const [cityOptions, setCityOptions] = useState<string[]>(cities);
  const [countryOptions, setCountryOptions] = useState<string[]>(COUNTRY);
  const regionSheetRef = useRef<ActionSheetRef>(null);
  const countrySheetRef = useRef<ActionSheetRef>(null);
  const citySheetRef = useRef<ActionSheetRef>(null);
  const typeSheetRef = useRef<ActionSheetRef>(null);

  const handleBottomSheet = (target: string) => {
    if (target == "Region") {
      regionSheetRef.current?.show();
    }
    if (target == "Country") {
      countrySheetRef.current?.show();
    }
    if (target == "City") {
      citySheetRef.current?.show();
    }
    if (target == "Type") {
      typeSheetRef.current?.show();
    }
  };

  const closeAllSheets = () => {
    regionSheetRef.current?.hide();
    countrySheetRef.current?.hide();
    citySheetRef.current?.hide();
    typeSheetRef.current?.hide();
  };

  const handleRegionChange = (selectedRegion: string[], field: any) => {
    // return console.log("selectedRegion", selectedRegion);

    if (selectedRegion) {
      field.onChange(selectedRegion[0]);
      setCountryOptions((REGION_TO_COUNTRY as any)[selectedRegion[0]].sort());
      setCityOptions((REGION_TO_CITY as any)[selectedRegion[0]].sort());
    } else {
      setValue("region", "");
      setCountryOptions(COUNTRY);
      setCityOptions(cities);
    }
    closeAllSheets();
    setQuery(JSON.stringify(watch()));
  };

  const handleCountryChange = (selectedCountry: string[], field: any) => {
    if (selectedCountry) {
      setCityOptions((COUNTRY_TO_CITY as any)[selectedCountry[0]].sort());
      field.onChange(selectedCountry[0]);
      setValue("city", "");
    } else {
      setValue("country", "");
      setCityOptions(cities);
    }
    closeAllSheets();
    setQuery(JSON.stringify(watch()));
  };

  const handleReset = () => {
    reset();
    setCityOptions(cities);
    setCountryOptions(COUNTRY);
    setQuery(JSON.stringify(watch()));
  };
  return (
    <>
      <View className="p-4 flex ">
        <Title>Search Filter</Title>
        <View className="flex flex-row gap-2 items-center mt-4">
          {["Region", "Country", "City", "Type"].map((item) => (
            <Text
              onPress={() => handleBottomSheet(item)}
              className="border px-3 py-1 rounded-full border-neutral-200 text-black"
            >
              {item}
            </Text>
          ))}
          <TouchableOpacity onPress={handleReset}>
            <Text className="border px-3 py-1 rounded-full border-neutral-200 bg-primary-500 text-white ">
              Reset
            </Text>
          </TouchableOpacity>
        </View>

        <View className=" flex  relative mt-0 ">
          <Search
            style={{ top: "50%", left: 10 }}
            width={20}
            height={20}
            color={"#d4d4d4"}
            className="absolute  z-30"
          />
          <TextInput
            className="py-2 ps-10 pe-3 border-2 border-neutral-200  rounded-full drop-shadow-sm text-neutral-400 outline-none"
            placeholder="Search"
            placeholderTextColor="#9ca3af"
            style={{ marginTop: 0 }}
            onChangeText={(text) => setQuery(JSON.stringify({ Search: text }))}
          />
        </View>
      </View>

      <ActionSheet
        ref={regionSheetRef}
        gestureEnabled={true}
        snapPoints={[70, 100]}
      >
        <Controller
          name="region"
          control={control}
          render={({ field }) => (
            <MultiSelectDropdown
              options={REGION}
              value={field.value || []}
              onChange={(selectedRegion: string[]) =>
                handleRegionChange(selectedRegion, field)
              }
              placeholder="Region"
              err={false}
              multiSelect={false}
            />
          )}
        />
      </ActionSheet>
      <ActionSheet
        ref={countrySheetRef}
        gestureEnabled={true}
        snapPoints={[70, 100]}
      >
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <MultiSelectDropdown
              options={countryOptions}
              value={field.value || []}
              onChange={(selectedCountry: string[]) =>
                handleCountryChange(selectedCountry, field)
              }
              placeholder="Country"
              err={false}
              multiSelect={false}
              setCityOptions={setCityOptions}
              search={true}
            />
          )}
        />
      </ActionSheet>
      <ActionSheet
        ref={citySheetRef}
        gestureEnabled={true}
        snapPoints={[70, 100]}
      >
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <MultiSelectDropdown
              options={cityOptions}
              value={field.value || []}
              onChange={(selectedCity: string[]) => {
                field.onChange(selectedCity[0]);
                closeAllSheets();
                setQuery(JSON.stringify(watch()));
              }}
              placeholder="City"
              err={false}
              multiSelect={false}
              setCityOptions={setCityOptions}
              search={true}
            />
          )}
        />
      </ActionSheet>
      <ActionSheet
        ref={typeSheetRef}
        gestureEnabled={true}
        snapPoints={[70, 100]}
      >
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <MultiSelectDropdown
              options={["Private", "Public", "Community"]}
              value={field.value || []}
              onChange={(selectedCity: string[]) => {
                field.onChange(selectedCity[0]);
                closeAllSheets();
                setQuery(JSON.stringify(watch()));
              }}
              placeholder="Type"
              err={false}
              multiSelect={false}
              setCityOptions={setCityOptions}
            />
          )}
        />
      </ActionSheet>
    </>
  );
};

export default UniversitySearchFilters;
