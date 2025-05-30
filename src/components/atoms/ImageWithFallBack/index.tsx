import { MediaImage } from "iconoir-react-native";
import React, { useState } from "react";
import { Image, View, StyleSheet } from "react-native";
import { ImageStyle } from "react-native";
import { SvgProps } from "react-native-svg";

type Props = {
  uri: string;
  style?: ImageStyle;
  iconProps?: SvgProps;
  resizeMode?: "cover" | "contain";
};

const ImageWithFallback: React.FC<Props> = ({
  uri,
  style,
  iconProps,
  resizeMode = "contain",
}) => {
  const [error, setError] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {!error ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          resizeMode={resizeMode}
          onError={() => setError(true)}
        />
      ) : (
        <View style={styles.iconWrapper}>
          <MediaImage width={40} height={40} {...iconProps} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
  },
});

export default ImageWithFallback;
