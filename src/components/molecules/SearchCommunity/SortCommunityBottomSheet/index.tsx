import { SortDown, SortUp } from "iconoir-react-native";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useState } from "react";


const sortOptions = [
    {
        label: 'User Count',
        value: 'userCountAsc',
        icon: <SortUp width={20} height={20} color="#6366f1" />,
      },
      {
        label: 'User Count',
        value: 'userCountDesc',
        icon: <SortDown width={20} height={20} color="#6366f1" />,
      },
    {
      label: 'Alphabet (A-Z)',
      value: 'alphabetAsc',
      icon: <SortUp width={20} height={20} color="#6366f1" />,
    },
    {
      label: 'Alphabet (Z-A)',
      value: 'alphabetDesc',
      icon: <SortDown width={20} height={20} color="#6366f1" />,
    },
  
  ]

interface SortCommunityBottomSheetProps {
  onSelect?: (value: string) => void;
  initialValue?: string;
}

const SortCommunityBottomSheet = ({ onSelect, initialValue }: SortCommunityBottomSheetProps) => {
    const [sort, setSort] = useState(initialValue || '');

    const handleSelect = (value: string) => {
        setSort(value);
        onSelect?.(value);
    };

    return (
        <View style={styles.h} className=" bg-white">
            <View className="flex flex-col justify-between p-4">
                {sortOptions.map(({ label, value, icon }) => (
                    <TouchableOpacity
                        key={value}
                        onPress={() => handleSelect(value)}
                        className={`flex flex-row items-center gap-4 p-4 border-b border-neutral-200 rounded-lg mb-2 ${
                            sort === value ? 'bg-gray-200' : 'bg-transparent'
                        }`}
                        activeOpacity={0.7}
                    >
                        <Text 
                            className={`text-xs capitalize  ${
                                sort === value ? 'text-primary-500 font-medium' : ' text-neutral-700'
                            }`}
                        >
                            {label}
                        </Text>
                        {icon && (
                            <View className="ml-2">
                                {icon}
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

export default SortCommunityBottomSheet;


const styles = StyleSheet.create({
    h:{
        minHeight:"50%"
    }
 
});