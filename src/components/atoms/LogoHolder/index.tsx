import React, { useEffect, useState } from "react";
import { View, Image, Platform, StyleSheet } from "react-native";
import UniversityLogoPlaceHolder from "@/assets/uniorangeIcon.svg";

const CommunityLogo = ({ logoUrl }: { logoUrl: string }) => {
  const [logoSrc, setLogoSrc] = useState(logoUrl);

  useEffect(() => {
    setLogoSrc(logoUrl);
  }, [logoUrl]);

  return (
    <View style={[styles.imageWrapper]}>
      {logoSrc ? (
        <Image
          source={{ uri: logoSrc }}
          style={styles.communityImage}
          onError={() => setLogoSrc("")}
        />
      ) : (
        <View style={styles.universityPlaceHolder}>
          <UniversityLogoPlaceHolder
            width={20}
            height={20}
            style={styles.communityImage}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    padding: 4,
    backgroundColor: "#fff",
    borderRadius: 24,
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
  communityImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "contain",
  },
  universityPlaceHolder: {
    width: 40,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CommunityLogo;
