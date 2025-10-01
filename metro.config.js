const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const { withNativeWind } = require("nativewind/metro");
const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

const config = mergeConfig(getDefaultConfig(__dirname), {
  /* your config */

  transformer: {
    babelTransformerPath: require.resolve(
      "react-native-svg-transformer/react-native"
    ),
    // Disable React Refresh in production
    unstable_allowRequireContext: false,
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...sourceExts, "svg"],
  },
  // Ensure React Refresh is only enabled in development
  unstable_enableSymlinks: false,
});

module.exports = withNativeWind(config, { input: "./global.css" });
