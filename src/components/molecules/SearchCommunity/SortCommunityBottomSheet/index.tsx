import { SortDown, SortUp } from "iconoir-react-native";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { FONTS } from "@/constants/fonts";

const sortOptions = [
  {
    label: "User Count",
    value: "userCountAsc",
    icon: <SortUp width={20} height={20} color="#6744FF" strokeWidth={2} />,
  },
  {
    label: "User Count",
    value: "userCountDesc",
    icon: <SortDown width={20} height={20} color="#6744FF" strokeWidth={2} />,
  },
  {
    label: "Alphabet (A-Z)",
    value: "alphabetAsc",
    icon: <SortUp width={20} height={20} color="#6744FF" strokeWidth={2} />,
  },
  {
    label: "Alphabet (Z-A)",
    value: "alphabetDesc",
    icon: <SortDown width={20} height={20} color="#6744FF" strokeWidth={2} />,
  },

  {
    label: "Latest",
    value: "latest",
    icon: <SortUp width={20} height={20} color="#6744FF" strokeWidth={2} />,
  },

  {
    label: "Oldest",
    value: "oldest",
    icon: <SortDown width={20} height={20} color="#6744FF" strokeWidth={2} />,
  },
];

interface SortCommunityBottomSheetProps {
  onSelect?: (value: string) => void;
  initialValue?: string;
}

const SortCommunityBottomSheet = ({
  onSelect,
  initialValue,
}: SortCommunityBottomSheetProps) => {
  const [sort, setSort] = useState(initialValue || "");

  const handleSelect = (value: string) => {
    setSort(value);
    onSelect?.(value);
  };

  return (
    <View style={styles.h} className=" bg-white">
      <View style={styles.container}>
        {sortOptions.map(({ label, value, icon }) => (
          <TouchableOpacity
            key={value}
            onPress={() => handleSelect(value)}
            className={`flex flex-row items-center gap-2 py-4 border-b border-neutral-200 rounded-lg mb-2 ${
              sort === value ? "bg-gray-200" : "bg-transparent"
            }`}
            activeOpacity={0.7}
          >
            <Text
              //   className={`text-xs capitalize  ${
              //     sort === value
              //       ? "text-primary-500 font-medium"
              //       : " text-neutral-700"
              //   }`}
              style={styles.text}
            >
              {label}
            </Text>
            {icon && <View className="ml-2">{icon}</View>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SortCommunityBottomSheet;

const styles = StyleSheet.create({
  h: {
    minHeight: "50%",
  },
  text: {
    fontSize: 14,
    fontFamily: FONTS.inter.semiBold,
    color: "#3A3B3C",
    marginLeft: 8,
  },
  container: {
    paddingVertical: 16,
    display: "flex",
    justifyContent: "space-between",
  },
});
