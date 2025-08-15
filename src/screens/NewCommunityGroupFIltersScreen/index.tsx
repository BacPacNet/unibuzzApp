import BackHeader from "@/components/atoms/BackHeader";
import CollapsibleMultiSelect from "@/components/atoms/CollapsibleMultiSelect";
import ReusableButton from "@/components/atoms/ReusableButton";
import { SafeScreen } from "@/components/template";
import { FONTS } from "@/constants/fonts";
import { useCommunityFilterContext } from "@/context/CommunityFilterProvider/CommunityFilterProvider";
import { subCategories } from "@/types/CommunityFilter";
import { useNavigation } from "@react-navigation/native";
import { Xmark } from "iconoir-react-native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
type Props = {};

const NewCommunityGroupFilterScreen = (props: Props) => {
  const navigate = useNavigation();

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  const { createSelectedFilters, setCreateSelectedFilters } =
    useCommunityFilterContext();

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

  useEffect(() => {
    setSelectedFilters(createSelectedFilters);
  }, []);

  const handleClick = () => {
    setCreateSelectedFilters(selectedFilters);

    navigate.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}

      <ScrollView style={styles.content}>
        <BackHeader label="Create Group" isLeftPadding={false} />
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
          onSelect={(value: string) => handleSelect("Educational", value)}
          handleSelectAll={() =>
            handleSelectAll("Educational", subCategories["Educational"])
          }
        />
        <CollapsibleMultiSelect
          title="Interest"
          options={subCategories["Interest"]}
          selectedOptions={selectedFilters["Interest"] || []}
          onSelect={(value: string) => handleSelect("Interest", value)}
          handleSelectAll={() =>
            handleSelectAll("Interest", subCategories["Interest"])
          }
        />
        <CollapsibleMultiSelect
          title="Events & Activities"
          options={subCategories["Events & Activities"]}
          selectedOptions={selectedFilters["Events & Activities"] || []}
          onSelect={(value: string) =>
            handleSelect("Events & Activities", value)
          }
          handleSelectAll={() =>
            handleSelectAll(
              "Events & Activities",
              subCategories["Events & Activities"]
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

        <View>
          {Object.keys(selectedFilters).length > 0 && (
            <View style={styles.selectedFiltersContainer}>
              <Text style={styles.selectedFiltersTitle}>
                Selected Categories
              </Text>
              <View style={styles.filtersRow}>
                {Object.entries(selectedFilters).map(([category, filters]) =>
                  filters.map((filter) => (
                    <TouchableOpacity
                      key={filter}
                      style={styles.filterChip}
                      onPress={() => handleSelect(category as any, filter)}
                    >
                      <Text style={styles.filterChipText}>{filter}</Text>
                      <Xmark width={24} height={24} color="#6744FF" />
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>
          )}
        </View>
        <View style={styles.ButtonContainer}>
          <ReusableButton
            onPress={() => handleClick()}
            buttonText="Apply Categories"
            variant="primary"
            height="large"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default NewCommunityGroupFilterScreen;

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
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginHorizontal: 16,
  },
  selectedFiltersTitle: {
    fontSize: 14,
    color: "#3A3B3C",
    marginBottom: 16,

    fontFamily: FONTS.inter.semiBold,
  },
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 8,
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
    fontSize: 12,
    fontFamily: FONTS.inter.medium,
  },
  ButtonContainer: {
    // padding: 10,
    paddingTop: 32,
    paddingHorizontal: 16,
    paddingBottom: 62,

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
});
