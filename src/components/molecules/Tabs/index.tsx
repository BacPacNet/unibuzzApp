import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { Bell } from "iconoir-react-native";
import { FONTS } from "@/constants/fonts";

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
    <View>
      <View
        style={{ marginHorizontal: 16 }}
        className="flex-row border-b border-neutral-300"
      >
        {tabs.map((tab, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setSelectedTab(index);
              onChange(index);
            }}
            className={`flex-1 flex-row items-center justify-center py-4 gap-1 relative
            `}
            style={[
              selectedTab === index ? styles.tabActive : styles.tabInactive,
            ]}
          >
            {/* {tab.icon}
            <Bell fill={"#6B7280"} fontSize={18} /> */}
            <Text
              className={`   `}
              style={[
                styles.tabText,
                selectedTab === index
                  ? styles.tabTextActive
                  : styles.tabTextInactive,
              ]}
            >
              {tab.label}
            </Text>

            {tab.badgeCount && Number(tab.badgeCount) > 0 && (
              <View style={styles.badge} className=" bg-red-500 rounded-full ">
                <Text style={styles.badgeText} className="">
                  {tab.badgeCount}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>
      {tabs[selectedTab]?.content}
    </View>
  );
}

const styles = StyleSheet.create({
  tabActive: {
    borderBottomColor: "#3A169C",
    borderBottomWidth: 2,
  },
  tabInactive: {
    borderBottomColor: "#9CA3AF",
    borderBottomWidth: 2,
  },
  tabText: {
    fontFamily: FONTS.inter.extraBold,
    fontSize: 14,
  },
  tabTextActive: {
    color: "#3A169C",
  },
  tabTextInactive: {
    color: "#9CA3AF",
  },

  badge: {
    width: 16,
    height: 16,
    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,

    color: "white",
  },
});
