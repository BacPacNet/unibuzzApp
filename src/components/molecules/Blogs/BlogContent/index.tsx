import React, { ReactNode, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  Linking,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { FONTS } from "@/constants/fonts";
import { NEXT_PROD_FE_BASE_URL } from "@env";

const FALLBACK_IMAGE =
  "https://cdn.pixabay.com/photo/2017/08/20/12/13/architecture-2661547_1280.jpg";

const WEB_BASE_URL =
  NEXT_PROD_FE_BASE_URL || "https://dev-unibuzz.vercel.app";

const resolveImageUrl = (src: string) => {
  if (src.startsWith("http")) {
    return src;
  }
  return `${WEB_BASE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

type BlogImageProps = {
  src: string;
  alt: string;
  style?: StyleProp<ViewStyle>;
};

export function BlogImage({ src, alt, style }: BlogImageProps) {
  const { width } = useWindowDimensions();
  const [imageSrc, setImageSrc] = useState(resolveImageUrl(src));
  const imageHeight = width >= 768 ? 270 : 200;

  return (
    <View
      style={[styles.imageContainer, { height: imageHeight }, style]}
      accessibilityLabel={alt}
    >
      <Image
        source={{ uri: imageSrc }}
        style={styles.image}
        resizeMode="cover"
        onError={() => setImageSrc(FALLBACK_IMAGE)}
      />
    </View>
  );
}

type BlogSectionProps = {
  title: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function BlogSection({
  title,
  subtitle,
  image,
  imageAlt,
  children,
  style,
}: BlogSectionProps) {
  return (
    <View style={[styles.section, style]}>
      {image ? <BlogImage src={image} alt={imageAlt || title} /> : null}
      <View style={styles.sectionBody}>
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle ? (
            <Text style={styles.sectionSubtitle}>{subtitle}</Text>
          ) : null}
        </View>
        <View style={styles.sectionContent}>{children}</View>
      </View>
    </View>
  );
}

type BlogParagraphProps = {
  children: ReactNode;
  bold?: boolean;
  style?: StyleProp<TextStyle>;
};

export function BlogParagraph({ children, bold, style }: BlogParagraphProps) {
  return (
    <Text style={[styles.paragraph, bold && styles.paragraphBold, style]}>
      {children}
    </Text>
  );
}

type BlogCtaProps = {
  label: string;
  href?: string;
  style?: StyleProp<ViewStyle>;
};

const getUniversityNameFromHref = (href: string) => {
  if (href.startsWith("/discover/")) {
    const encodedName = href.slice("/discover/".length).split("/")[0];
    return encodedName ? decodeURIComponent(encodedName) : null;
  }

  if (
    href.startsWith("http") ||
    href.startsWith("/") ||
    href === "/discover" ||
    href === "/blogs"
  ) {
    return null;
  }

  return href.trim() || null;
};

export function BlogCta({ label, href, style }: BlogCtaProps) {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    if (!href) {
      navigation.navigate("DiscoverStack", { screen: "Discover" });
      return;
    }

    if (href.startsWith("http")) {
      Linking.openURL(href);
      return;
    }

    if (href === "/blogs" || href.startsWith("/blogs")) {
      navigation.navigate("Blogs");
      return;
    }

    const universityName = getUniversityNameFromHref(href);
    if (universityName) {
      navigation.navigate("DiscoverStack", {
        screen: "University",
        params: { data: { name: universityName }, from: "blogs" },
      });
      return;
    }

    if (href === "/discover" || href.startsWith("/discover")) {
      navigation.navigate("DiscoverStack", { screen: "Discover" });
      return;
    }

    Linking.openURL(`${WEB_BASE_URL}${href.startsWith("/") ? "" : "/"}${href}`);
  };

  return (
    <View style={styles.ctaContainer}>
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.ctaButton, style]}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaLabel}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

type BlogBulletListProps = {
  children: ReactNode;
  intro?: string;
  style?: StyleProp<ViewStyle>;
  introStyle?: StyleProp<TextStyle>;
};

export function BlogBulletList({
  children,
  intro,
  style,
  introStyle,
}: BlogBulletListProps) {
  return (
    <View style={styles.bulletListWrapper}>
      {intro ? (
        <Text style={[styles.paragraph, introStyle]}>{intro}</Text>
      ) : null}
      <View style={[styles.bulletList, style]}>{children}</View>
    </View>
  );
}

type BlogBulletItemProps = {
  children: ReactNode;
  bold?: boolean;
  style?: StyleProp<TextStyle>;
};

export function BlogBulletItem({
  children,
  bold = true,
  style,
}: BlogBulletItemProps) {
  return (
    <View style={styles.bulletItem}>
      <Text style={styles.bulletMarker}>{"\u2022"}</Text>
      <Text
        style={[
          styles.bulletText,
          bold ? styles.paragraphBold : styles.bulletTextNormal,
          style,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  section: {
    width: "100%",
    alignItems: "flex-start",
    gap: 32,
  },
  sectionBody: {
    width: "100%",
    alignItems: "flex-start",
    gap: 16,
  },
  sectionHeading: {
    width: "100%",
    alignItems: "flex-start",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    fontFamily: FONTS.inter.semiBold,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
    fontFamily: FONTS.inter.bold,
  },
  sectionContent: {
    width: "100%",
    alignItems: "flex-start",
    gap: 16,
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 20,
    color: "#374151",
    fontFamily: FONTS.inter.regular,
  },
  paragraphBold: {
    fontWeight: "700",
    fontFamily: FONTS.inter.bold,
  },
  ctaContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
  },
  ctaButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#6744FF",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  ctaLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
    fontFamily: FONTS.inter.medium,
  },
  bulletListWrapper: {
    width: "100%",
    alignItems: "flex-start",
    gap: 12,
  },
  bulletList: {
    width: "100%",
    alignItems: "flex-start",
    gap: 8,
    paddingLeft: 16,
  },
  bulletItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bulletMarker: {
    fontSize: 12,
    lineHeight: 20,
    color: "#374151",
    marginRight: 8,
    fontFamily: FONTS.inter.regular,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 20,
    color: "#374151",
  },
  bulletTextNormal: {
    fontWeight: "400",
    fontFamily: FONTS.inter.regular,
  },
});
