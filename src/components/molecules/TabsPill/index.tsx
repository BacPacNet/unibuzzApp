import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  className?: string;
  tabAlign?: "left" | "center" | "right";
  labelSize?: "small" | "medium" | "large";
  onTabChange?: (index: number) => void; // Callback function prop
  index?: number;
}

const TabsPill: React.FC<TabsProps> = ({
  tabs,
  className = "",
  tabAlign = "left",
  labelSize = "medium",
  onTabChange, // Accepting callback function
  index = 0,
}) => {
  const [activeTab, setActiveTab] = useState(index || 0);

  const fontSize = {
    small: "text-xs",
    medium: "text-md",
    large: "text-lg",
  };

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    if (onTabChange) {
      onTabChange(index); // Notify parent about tab change
    }
  };

  useEffect(() => {
    if (index && index !== activeTab) {
      setActiveTab(index);
    }
  }, [index]);

  return (
    <View className={`w-full flex-1 ${className}`}>
      <View
        className={`flex-row gap-4 py-4 px-2 border-b border-neutral-200 justify-${tabAlign}`}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleTabClick(index)}
            className={`rounded-full ${
              activeTab === index ? "bg-primary-500" : "bg-secondary"
            }`}
          >
            <Text
              className={`${fontSize[labelSize]} py-2 px-4 font-semibold ${
                activeTab === index ? "text-white" : "text-primary-500"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tabs Content */}
      <View className="mt-2 bg-white rounded-md flex-1">
        {tabs[activeTab]?.content}
      </View>
    </View>
  );
};

export default TabsPill;
