import React, { useEffect, useState } from "react";
import { View, Image, Platform, StyleSheet } from "react-native";
import UniversityLogoPlaceHolder from "@/assets/uniorangeIcon.svg";

const CommunityLogo = ({
  logoUrl,
  variant = "default",
}: {
  logoUrl: string;
  variant?: "small" | "default";
}) => {
  const [logoSrc, setLogoSrc] = useState(logoUrl);

  useEffect(() => {
    setLogoSrc(logoUrl);
  }, [logoUrl]);

  return (
    <View
      style={[
        styles.imageWrapper,
        variant === "small" ? styles.smallWrapper : styles.defaultWrapper,
      ]}
    >
      {logoSrc ? (
        <Image
          source={{ uri: logoSrc }}
          style={[
            styles.communityImage,
            variant === "small" ? styles.smallImage : styles.defaultImage,
          ]}
          onError={() => setLogoSrc("")}
        />
      ) : (
        <View
          style={[
            styles.universityPlaceHolder,
            variant === "small"
              ? styles.smallPlaceholder
              : styles.defaultPlaceholder,
          ]}
        >
          <UniversityLogoPlaceHolder
            width={variant === "small" ? 16 : 20}
            height={variant === "small" ? 16 : 20}
            style={[
              styles.communityImage,
              variant === "small" ? styles.smallImage : styles.defaultImage,
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  defaultWrapper: {
    padding: 4,
    borderRadius: 200,
  },
  smallWrapper: {
    padding: 3,
    borderRadius: 200,
  },
  communityImage: {
    resizeMode: "contain",
  },
  defaultImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  smallImage: {
    width: 32,
    height: 32,
    borderRadius: 200,
  },
  universityPlaceHolder: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  defaultPlaceholder: {
    width: 40,
    height: 40,
  },
  smallPlaceholder: {
    width: 32,
    height: 32,
  },
});

export default CommunityLogo;
