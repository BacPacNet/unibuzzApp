import React, { ReactNode } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavArrowRight } from "iconoir-react-native";
import { RootStackParamList } from "@/types/navigation";
import { FONTS } from "@/constants/fonts";

type BlogPostLayoutProps = {
  title: string;
  date: string;
  children: ReactNode;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const BlogPostLayout = ({ title, date, children }: BlogPostLayoutProps) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.article}>
        <View style={styles.breadcrumb} accessibilityLabel="Breadcrumb">
          <TouchableOpacity onPress={() => navigation.navigate("Blogs")}>
            <Text style={styles.breadcrumbLink}>Blogs</Text>
          </TouchableOpacity>
          <NavArrowRight width={14} height={14} color="#9CA3AF" />
          <Text style={styles.breadcrumbTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>

        {children}
      </View>
    </ScrollView>
  );
};

export default BlogPostLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    alignItems: "center",
    paddingVertical: 64,
  },
  article: {
    width: "100%",
    maxWidth: 510,
    alignItems: "flex-start",
    gap: 32,
    paddingHorizontal: 16,
  },
  breadcrumb: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  breadcrumbLink: {
    fontSize: 12,
    color: "#6744FF",
    fontFamily: FONTS.inter.regular,
  },
  breadcrumbTitle: {
    flex: 1,
    fontSize: 12,
    color: "#6B7280",
    fontFamily: FONTS.inter.regular,
  },
  header: {
    width: "100%",
    alignItems: "flex-start",
    gap: 16,
  },
  date: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: FONTS.inter.regular,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
    fontFamily: FONTS.poppins.bold,
  },
});
