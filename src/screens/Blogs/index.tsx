import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { ArrowUp } from "iconoir-react-native";
import BlogCard from "@/components/molecules/Blogs/BlogCard";
import { BLOG_POSTS, BlogListItem } from "@/content/blogs";
import { FONTS } from "@/constants/fonts";

const Blogs = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const flatListRef = React.useRef<FlatList>(null);

  const renderItem = ({ item }: { item: BlogListItem }) => (
    <BlogCard data={item} />
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    setShowScrollTop(contentOffset.y > layoutMeasurement?.height / 2);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={BLOG_POSTS}
        keyExtractor={(item) => item.title}
        renderItem={renderItem}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Blogs</Text>
            <Text style={styles.description}>
              Keep informed with our latest blog posts covering new features,
              updates, and fixes.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No blogs found</Text>
          </View>
        }
      />

      {showScrollTop && (
        <TouchableOpacity style={styles.scrollTopButton} onPress={scrollToTop}>
          <ArrowUp width={24} height={24} color={"#6744FF"} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  listContent: {
    paddingBottom: 24,
  },
  header: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#374151",
    fontFamily: FONTS.poppins.bold,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: FONTS.inter.regular,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 128,
  },
  emptyText: {
    fontWeight: "700",
    fontSize: 24,
    color: "#171717",
    textAlign: "center",
  },
  scrollTopButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 30,
    elevation: 5,
  },
});

export default Blogs;
