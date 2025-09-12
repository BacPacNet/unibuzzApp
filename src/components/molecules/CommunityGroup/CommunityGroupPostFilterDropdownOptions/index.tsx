import { AllFiltersCommunityGroupPost } from "@/types/CommunityGroup";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Option = {
  key: string;
  label: string;
  showBadge?: boolean;
};

const CommunityGroupPostFilterDropdownOptions: React.FC<{
  setFilterBy: (filter: string) => void;
  pendingPostCount: number;
}> = ({ setFilterBy, pendingPostCount }) => {
  const options: Option[] = [
    { key: "", label: AllFiltersCommunityGroupPost["allPosts"] },
    { key: "myPosts", label: AllFiltersCommunityGroupPost["myPosts"] },
    {
      key: "pendingPosts",
      label: AllFiltersCommunityGroupPost["pendingPosts"],
      showBadge: true,
    },
  ];

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.key || "all"}
          style={styles.option}
          onPress={() => setFilterBy(option.key)}
        >
          <Text style={styles.optionText}>{option.label}</Text>
          {option.showBadge && pendingPostCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingPostCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CommunityGroupPostFilterDropdownOptions;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    width: 160,
    paddingVertical: 4,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  badge: {
    backgroundColor: "#DC2626",
    borderRadius: 999,
    minWidth: 16,
    minHeight: 16,
    marginLeft: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 8,
    fontWeight: "600",
  },
});
