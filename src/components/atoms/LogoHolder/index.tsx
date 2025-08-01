import React, { useEffect, useState } from "react";
import { View, Image, Platform, StyleSheet } from "react-native";
import UniversityLogoPlaceHolder from "@/assets/LogoCircle.svg";

// Define variant types
type LogoVariant = "extraSmall" | "small" | "default" | "large";

// Configuration object for different variants
const LOGO_VARIANTS: Record<LogoVariant, {
  size: number;
  padding: number;
  borderRadius: number;
}> = {
  extraSmall: {
    size: 16,
    padding: 2,
    borderRadius: 200,
  },
  small: {
    size: 32,
    padding: 3,
    borderRadius: 200,
  },
  default: {
    size: 40,
    padding: 4,
    borderRadius: 200,
  },
  large: {
    size: 30,
    padding: 4,
    borderRadius: 200,
  },
};

interface CommunityLogoProps {
  logoUrl: string;
  variant?: LogoVariant;
  onError?: () => void;
  style?: any;
}

const CommunityLogo: React.FC<CommunityLogoProps> = ({
  logoUrl,
  variant = "default",
  onError,
  style,
}) => {
  const [logoSrc, setLogoSrc] = useState(logoUrl);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setLogoSrc(logoUrl);
    setHasError(false);
  }, [logoUrl]);

  const variantConfig = LOGO_VARIANTS[variant];
  const { size, padding, borderRadius } = variantConfig;

  const handleImageError = () => {
    setLogoSrc("");
    setHasError(true);
    onError?.();
  };

  const renderLogoImage = () => {
    if (logoSrc?.length > 0 && !hasError) {
      return (
        <Image
          source={{ uri: logoSrc }}
          style={[
            styles.communityImage,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
          onError={handleImageError}
        />
      );
    }

    return (
      <View
        style={[
          styles.universityPlaceHolder,
          {
            width: size,
            height: size,
          },
        ]}
      >
        <UniversityLogoPlaceHolder
          width={size}
          height={size}
          style={[
            styles.communityImage,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
      </View>
    );
  };

  return (
    <View
      style={[
        styles.imageWrapper,
        {
          padding,
          borderRadius,
        },
        style,
      ]}
    >
      {renderLogoImage()}
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
  communityImage: {
    objectFit: "contain",
    width: "100%",
    height: "100%",
  },
  universityPlaceHolder: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CommunityLogo;
