import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { NavArrowDown, NavArrowUp } from "iconoir-react-native";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  contentStyle?: ViewStyle;
}

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  containerStyle,
  titleStyle,
  contentStyle,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>

        {expanded ? (
          <NavArrowUp width={20} height={20} color="#9CA3AF" />
        ) : (
          <NavArrowDown width={20} height={20} color="#9CA3AF" />
        )}
      </TouchableOpacity>
      {expanded && (
        <View style={[styles.content, contentStyle]}>{children}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
  },
  header: {
    padding: 12,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 16,
    color: "#3A3B3C",
  },
  content: {
    padding: 12,
    backgroundColor: "#fff",
  },
});

export default Accordion;
