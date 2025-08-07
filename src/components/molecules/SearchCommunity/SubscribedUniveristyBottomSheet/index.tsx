import CommunityLogo from "@/components/atoms/LogoHolder";
import { EmailType } from "@/types/users";
import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

interface SubscribedUniveristyBottomSheetProps {
  options: EmailType[];
  value: string[];
  err: boolean;
  onSelect: (value: { name: string; id: string }) => void;
}

const SubscribedUniveristyBottomSheet: React.FC<
  SubscribedUniveristyBottomSheetProps
> = ({ options = [], value = [], err = false, onSelect }) => {
  const [selected, setSelected] = useState<string[]>(value);

  console.log(options);
  const handleSelect = (university: any) => {
    onSelect({ name: university.UniversityName, id: university.communityId });
    toggleSelect(university.UniversityName);
  };

  const toggleSelect = (item: string) => {
    setSelected((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((i) => i !== item)
        : [...prevSelected, item],
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    const isSelected = selected.includes(item.UniversityName);
    return (
      <TouchableOpacity
        style={[styles.optionItem, isSelected && styles.optionSelected]}
        onPress={() => handleSelect(item)}
      >
        <CommunityLogo logoUrl={item.logo || ""} variant="small" />
        <Text style={styles.optionText}>{item.UniversityName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={options}
        renderItem={renderItem}
        keyExtractor={(item) => item.UniversityName}
        style={styles.optionsList}
        ListEmptyComponent={<View className="flex-1 justify-center items-center">
          <Text>No data found</Text>
        </View>}
      />
    </View>
  );
};

export default SubscribedUniveristyBottomSheet;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    height: "100%",
    gap: 10,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  parentCategory: {
    marginVertical: 4,
    padding: 6,
    borderRadius: 8,
    borderColor: "#0066CC",
    borderWidth: 1,
  },
  parentText: {
    color: "#0066CC",
    fontSize: 12,
  },
  dropdownBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  errorBorder: {
    borderColor: "red",
  },
  placeholder: {
    color: "#666",
    fontSize: 14,
  },
  selectedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 4,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0066CC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  selectedText: {
    color: "white",
    marginRight: 4,
    fontSize: 12,
  },
  searchInput: {
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 35,
    marginVertical: 10,
    height: 40,
  },
  optionsList: {
    minHeight: 200,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 12,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  optionText: {
    color: "#3A3B3C",
    fontSize: 14,
    fontWeight: "500",
  },
  optionSelected: {
    backgroundColor: "#f0f0f0",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedBox: {
    width: 10,
    height: 10,
    backgroundColor: "#0066CC",
  },
});
