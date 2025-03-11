import CollapsibleMultiSelect from "@/components/atoms/CollapsibleMultiSelect";
import ReusableButton from "@/components/atoms/ReusableButton";
import { useCommunityFilterContext } from "@/context/CommunityFilterProvider/CommunityFilterProvider";
import { useHeader } from "@/context/HeaderProvider/Header";
import { GroupCategories, subCategories } from "@/types/CommunityFilter";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NavArrowLeft, Xmark } from "iconoir-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchCommunityGroupFilterScreen = () => {
  const navigate = useNavigation();

  const { changeHeaderShownStatus } = useHeader();

  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  const {
    setSelectedTypeMain,
    selectedTypeMain,
    selectedFiltersMain,
    setSelectedFiltersMain,
  } = useCommunityFilterContext();

  const handleSelectTypes = (type: string) => {
    setSelectedType((prev: string[]) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  const handleSelectAllTypes = (allTypes: string[]) => {
    setSelectedType((prev: string[]) =>
      prev.length === allTypes.length ? [] : allTypes
    );
  };

  const handleSelect = (category: string, option: string) => {
    setSelectedFilters((prev: any) => {
      const categoryFilters = prev[category] || [];
      if (categoryFilters.includes(option)) {
        const updatedFilters = categoryFilters.filter(
          (item: any) => item !== option
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

  useFocusEffect(
    useCallback(() => {
      changeHeaderShownStatus(false);

      return () => {
        changeHeaderShownStatus(true);
      };
    }, [])
  );

  useEffect(() => {
    setSelectedFilters(selectedFiltersMain);
    setSelectedType(selectedTypeMain);
  }, []);

  const handleClick = () => {
    setSelectedFiltersMain(selectedFilters);
    setSelectedTypeMain(selectedType);
    navigate.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigate.goBack()}
          style={styles.backButton}
        >
          <NavArrowLeft width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Groups</Text>
      </View>

      <ScrollView style={styles.content}>
        <CollapsibleMultiSelect
          title="Group Access Type"
          options={GroupCategories}
          selectedOptions={selectedType}
          onSelect={(value: any) => handleSelectTypes(value)}
          handleSelectAll={() => handleSelectAllTypes(GroupCategories)}
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
              subCategories["Recreation and Hobbies"]
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
              subCategories["Advocacy and Awareness"]
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
              subCategories["Professional Development"]
            )
          }
        />

        <View>
          {(selectedType.length > 0 ||
            Object.keys(selectedFilters).length > 0) && (
            <View style={styles.selectedFiltersContainer}>
              <Text style={styles.selectedFiltersTitle}>Selected Filters</Text>
              <View style={styles.filtersRow}>
                {selectedType.map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={styles.filterChip}
                    onPress={() => handleSelectTypes(filter)}
                  >
                    <Text style={styles.filterChipText}>{filter}</Text>
                    <Xmark width={24} height={24} color="#000" />
                  </TouchableOpacity>
                ))}

                {Object.entries(selectedFilters).map(([category, filters]) =>
                  filters.map((filter) => (
                    <TouchableOpacity
                      key={filter}
                      style={styles.filterChip}
                      onPress={() => handleSelect(category as any, filter)}
                    >
                      <Text style={styles.filterChipText}>{filter}</Text>
                      <Xmark width={24} height={24} color="#000" />
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.ButtonContainer}>
        <ReusableButton
          onPress={() => handleClick()}
          buttonText="Apply Filter"
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchCommunityGroupFilterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 8,
  },

  content: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  selectedFiltersContainer: {
    padding: 16,
  },
  selectedFiltersTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#6744FF",
    backgroundColor: "white",
    marginRight: 8,

    height: 28,
  },
  filterChipText: {
    color: "#6744FF",
    marginRight: 4,
  },
  ButtonContainer: {
    padding: 10,
    paddingBottom: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
});
