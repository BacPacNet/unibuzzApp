import CollapsibleMultiSelect from "@/components/atoms/CollapsibleMultiSelect";
import { useCommunityFilterContext } from "@/context/CommunityFilterProvider/CommunityFilterProvider";
import { GroupAccess, GroupLabel, GroupType, subCategories } from "@/types/CommunityFilter";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-actions-sheet";
const SearchCommunityFilterBottomSheet = () => {
  const { selectedFiltersMain, setSelectedFiltersMain,selectedTypeMain,setSelectedTypeMain,setSelectedLabelMain } =
    useCommunityFilterContext();
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [selectedType, setSelectedType] = useState<string[]>([])
  const [selectedLabel, setSelectedLabel] = useState<string[]>([])

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
  useEffect(() => {
    if (selectedLabel?.length >= 0) {
        setSelectedLabelMain(selectedLabel);
    }
  }, [selectedLabel]);

  
  useFocusEffect(
    useCallback(() => {
      setSelectedFilters(selectedFiltersMain);
      setSelectedType(selectedTypeMain)
    }, []),
  );


  const handleSelectLabel = (label: string) => {
    setSelectedLabel((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]))
  }

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
          title="Group Label"
          options={GroupLabel}
          selectedOptions={ selectedLabel}
          onSelect={(value: string) => handleSelectLabel( value)}
        
        />
         <CollapsibleMultiSelect
          title="Academic"
          options={subCategories["Academic"]}
          selectedOptions={selectedFilters["Academic"] || []}
          onSelect={(value: string) => handleSelect("Academic", value)}
          handleSelectAll={() =>
            handleSelectAll("Academic", subCategories["Academic"])
          }
        />
        <CollapsibleMultiSelect
          title="Educational"
          options={subCategories["Educational"]}
          selectedOptions={selectedFilters["Educational"] || []}
          onSelect={(value: string) =>
            handleSelect("Educational", value)
          }
          handleSelectAll={() =>
            handleSelectAll(
              "Educational",
              subCategories["Educational"],
            )
          }
        />
        <CollapsibleMultiSelect
          title="Interest"
          options={subCategories["Interest"]}
          selectedOptions={selectedFilters["Interest"] || []}
          onSelect={(value: string) =>
                handleSelect("Interest", value)
          }
          handleSelectAll={() =>
            handleSelectAll(
              "Interest",
              subCategories["Interest"],
            )
          }
        />
        <CollapsibleMultiSelect
          title="Events & Activities"
          options={subCategories["Events & Activities"]}
          selectedOptions={selectedFilters["Events & Activities"] || []}
          onSelect={(value: string) => handleSelect("Events & Activities", value)}
          handleSelectAll={() =>
            handleSelectAll("Events & Activities", subCategories["Events & Activities"])
          }
        />
        <CollapsibleMultiSelect
          title="Personal Growth"
          options={subCategories["Personal Growth"]}
          selectedOptions={selectedFilters["Personal Growth"] || []}
          onSelect={(value: string) =>
            handleSelect("Personal Growth", value)
          }
          handleSelectAll={() =>
            handleSelectAll(
              "Personal Growth",
              subCategories["Personal Growth"],
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
     
        />
     
        <CollapsibleMultiSelect
          title="Professional Development"
          options={subCategories["Professional Development"]}
          selectedOptions={selectedFilters["Professional Development"] || []}
          onSelect={(value: string) =>
            handleSelect("Professional Development", value)
          }
        />
        <CollapsibleMultiSelect
          title="Utility & Campus Life"
          options={subCategories["Utility & Campus Life"]}
          selectedOptions={selectedFilters["Utility & Campus Life"] || []}
          onSelect={(value: string) =>
            handleSelect("Utility & Campus Life", value)
          }
        />
      </ScrollView>
    </View>
  );
};

export default SearchCommunityFilterBottomSheet;
