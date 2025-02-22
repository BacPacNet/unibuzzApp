import { View, Text, Pressable } from "react-native";
import { useState } from "react";
import { Bell } from "iconoir-react-native";

type TabItem = {
  label: string;
  icon?: React.ReactNode;
  badgeCount?: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: TabItem[];
  activeIndex?: number;
  onChange: (index: number) => void;
};

export default function Tabs({ tabs, activeIndex = 0, onChange }: TabsProps) {
  const [selectedTab, setSelectedTab] = useState(activeIndex);

  return (
    <>
      <View className="flex-row border-b border-neutral-300">
        {tabs.map((tab, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setSelectedTab(index);
              onChange(index);
            }}
            className={`flex-1 flex-row items-center justify-center py-4 gap-1 relative ${
              selectedTab === index ? "border-b-2 border-primary-500" : ""
            }`}
          >
            {tab.icon}
            <Bell fill={"#6B7280"} fontSize={18} />
            <Text
              className={` text-neutral-500 text-md font-bold ${selectedTab === index ? "text-primary-500 " : ""}`}
            >
              {tab.label}
            </Text>

            {tab.badgeCount && Number(tab.badgeCount) > 0 && (
              <View className=" bg-red-500 rounded-full p-2 py-1">
                <Text className="text-white text-sm font-bold">
                  {tab.badgeCount}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>
      {tabs[selectedTab].content}
    </>
  );
}
