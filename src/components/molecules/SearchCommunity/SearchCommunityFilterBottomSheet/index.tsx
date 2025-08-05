import CollapsibleMultiSelect from "@/components/atoms/CollapsibleMultiSelect";
import { useCommunityFilterContext } from "@/context/CommunityFilterProvider/CommunityFilterProvider";
import { GroupAccess, GroupType, subCategories } from "@/types/CommunityFilter";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-actions-sheet";
const SearchCommunityFilterBottomSheet = () => {
  const { selectedFiltersMain, setSelectedFiltersMain,selectedTypeMain,setSelectedTypeMain } =
    useCommunityFilterContext();
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [selectedType, setSelectedType] = useState<string[]>([])

  useEffect(() => {
    if (Object.keys(selectedFilters)?.length >= 0) {
      setSelectedFiltersMain(selectedFilters);
    }
  }, [selectedFilters]);

  useEffect(() => {
    if (selectedType?.length >= 0) {
        setSelectedTypeMain(selectedType);
    }
  }, [selectedType]);

  
  useFocusEffect(
    useCallback(() => {
      setSelectedFilters(selectedFiltersMain);
      setSelectedType(selectedTypeMain)
    }, []),
  );


  

  const handleSelectTypes = (type: string) => {
    setSelectedType((prev) => (prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]))
  }
  
  const handleSelect = (category: string, option: string) => {
    setSelectedFilters((prev: any) => {
      const categoryFilters = prev[category] || [];
      if (categoryFilters.includes(option)) {
        const updatedFilters = categoryFilters.filter(
          (item: any) => item !== option,
        );
        if (updatedFilters.length === 0) {
          const { [category]: _, ...rest } = prev;
          return rest;
        }
        return {
          ...prev,
          [category]: updatedFilters,
        };
      } else {
        return {
          ...prev,
          [category]: [...categoryFilters, option],
        };
      }
    });
  };

  const handleSelectAll = (category: string, allOptions: string[]) => {
    setSelectedFilters((prev: any) => {
      const currentFilters = prev[category] || [];

      if (currentFilters.length === allOptions.length) {
        const { [category]: _, ...rest } = prev;
        return rest;
      } else {
        return {
          ...prev,
          [category]: allOptions,
        };
      }
    });
  };

  return (
    <View>
      <ScrollView
        style={{
          width: "100%",
          flexShrink: 1,
        }}
      >
          <CollapsibleMultiSelect
          title="Group Access"
          options={GroupAccess}
          selectedOptions={ selectedType}
          onSelect={(value: string) => handleSelectTypes( value)}
        
        />
          <CollapsibleMultiSelect
          title="Group Type"
          options={GroupType}
          selectedOptions={ selectedType}
          onSelect={(value: string) => handleSelectTypes( value)}
        
        />
        <CollapsibleMultiSelect
          title="Academic Focus"
          options={subCategories["Academic Focus"]}
          selectedOptions={selectedFilters["Academic Focus"] || []}
          onSelect={(value: string) => handleSelect("Academic Focus", value)}
          handleSelectAll={() =>
            handleSelectAll("Academic Focus", subCategories["Academic Focus"])
          }
        />
        <CollapsibleMultiSelect
          title="Recreation and Hobbies"
          options={subCategories["Recreation and Hobbies"]}
          selectedOptions={selectedFilters["Recreation and Hobbies"] || []}
          onSelect={(value: string) =>
            handleSelect("Recreation and Hobbies", value)
          }
          handleSelectAll={() =>
            handleSelectAll(
              "Recreation and Hobbies",
              subCategories["Recreation and Hobbies"],
            )
          }
        />
        <CollapsibleMultiSelect
          title="Advocacy and Awareness"
          options={subCategories["Advocacy and Awareness"]}
          selectedOptions={selectedFilters["Advocacy and Awareness"] || []}
          onSelect={(value: string) =>
            handleSelect("Advocacy and Awareness", value)
          }
          handleSelectAll={() =>
            handleSelectAll(
              "Advocacy and Awareness",
              subCategories["Advocacy and Awareness"],
            )
          }
        />
        <CollapsibleMultiSelect
          title="Personal Growth"
          options={subCategories["Personal Growth"]}
          selectedOptions={selectedFilters["Personal Growth"] || []}
          onSelect={(value: string) => handleSelect("Personal Growth", value)}
          handleSelectAll={() =>
            handleSelectAll("Personal Growth", subCategories["Personal Growth"])
          }
        />
        <CollapsibleMultiSelect
          title="Professional Development"
          options={subCategories["Professional Development"]}
          selectedOptions={selectedFilters["Professional Development"] || []}
          onSelect={(value: string) =>
            handleSelect("Professional Development", value)
          }
          handleSelectAll={() =>
            handleSelectAll(
              "Professional Development",
              subCategories["Professional Development"],
            )
          }
        />
      </ScrollView>
    </View>
  );
};

export default SearchCommunityFilterBottomSheet;
