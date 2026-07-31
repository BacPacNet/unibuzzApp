import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BlogListItem } from "@/content/blogs";
import { RootStackParamList } from "@/types/navigation";
import { FONTS } from "@/constants/fonts";
import { NEXT_PROD_FE_BASE_URL } from "@env";

const FALLBACK_IMAGE =
  "https://cdn.pixabay.com/photo/2017/08/20/12/13/architecture-2661547_1280.jpg";

const WEB_BASE_URL =
  NEXT_PROD_FE_BASE_URL || "https://dev-unibuzz.vercel.app";

const BLOG_SCREENS: Record<
  string,
  | "AggarwalCollegeBlog"
  | "BestEngineeringCollegesBlog"
  | "CampusLifePlacementsBlog"
  | "KietUnibuzzBlog"
> = {
  "aggarwal-college-ballabgarh-digital-student-life": "AggarwalCollegeBlog",
  "best-engineering-colleges-in-ghaziabad-for-2026-applicants":
    "BestEngineeringCollegesBlog",
  "why-campus-life-clubs-and-hackathons-matter-for-placements":
    "CampusLifePlacementsBlog",
  "kiet-ghaziabad-unibuzz-digital-campus": "KietUnibuzzBlog",
};

type Props = {
  data: BlogListItem;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const resolveImageUrl = (image: string) => {
  if (image.startsWith("http")) {
    return image;
  }
  return `${WEB_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

const BlogCard = ({ data }: Props) => {
  const navigation = useNavigation<NavigationProp>();
  const [imageSrc, setImageSrc] = useState(resolveImageUrl(data.image));

  const handlePress = () => {
    const screen = BLOG_SCREENS[data.title];
    if (screen) {
      navigation.navigate(screen);
      return;
    }
    Linking.openURL(`${WEB_BASE_URL}/blogs/${data.title}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.card}
      activeOpacity={0.9}
    >
      <Text style={styles.date}>{data.date}</Text>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageSrc }}
          style={styles.image}
          onError={() => setImageSrc(FALLBACK_IMAGE)}
        />
      </View>
      <Text style={styles.heading} numberOfLines={2}>
        {data.heading}
      </Text>
    </TouchableOpacity>
  );
};

export default BlogCard;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 32,
    height: 400,
    gap: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  date: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: FONTS.inter.regular,
  },
  imageContainer: {
    flex: 1,
    minHeight: 0,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    color: "#4B5563",
    fontFamily: FONTS.poppins.semiBold,
  },
});
