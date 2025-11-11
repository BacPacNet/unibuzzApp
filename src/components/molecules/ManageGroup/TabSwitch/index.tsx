import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";

export default function TabSwitch({
  currTab,
  setCurrTab,
  tabs,
}: {
  currTab: string;
  setCurrTab: (value: string) => void;
  tabs: string[];
}) {
  const [activeTab, setActiveTab] = useState(tabs.indexOf(currTab));
  const [containerWidth, setContainerWidth] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;
  const stepSizeRef = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: activeTab,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  useEffect(() => {
    if (containerWidth > 0) {
      stepSizeRef.setValue(containerWidth / tabs.length);
    }
  }, [containerWidth]);

  const indicatorWidth = `${100 / tabs.length}%`;

  const tabIndex = anim.interpolate({
    inputRange: tabs.map((_, i) => i),
    outputRange: tabs.map((_, i) => i),
  });

  const translateX = Animated.multiply(tabIndex, stepSizeRef);

  return (
    <View style={styles.container}>
      <View
        style={styles.tabContainer}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >
        <Animated.View
          style={[
            styles.activeBg,
            {
              width: indicatorWidth as `${number}%`,
              transform: [{ translateX }],
            },
          ]}
        />
        {tabs.map((tab, i) => (
          <Pressable
            key={i}
            style={styles.tab}
            onPress={() => {
              setActiveTab(i);
              setCurrTab(tab);
            }}
          >
            <Text
              style={[styles.tabText, i === activeTab && styles.activeText]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F6F6FB",
    borderRadius: 360,
    overflow: "hidden",
    position: "relative",
    height: 48,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    color: "#7C7C8A",
    fontWeight: "500",
  },
  activeText: {
    color: "#6C63FF",
    fontWeight: "600",
  },
  activeBg: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(108, 99, 255, 0.1)",
    borderRadius: 25,
  },
});
