import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
    paddingVertical: 40,
    backgroundColor: "white",
  },
  contentContainer: {
    gap: 64,
    backgroundColor: "white",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  title: {
    width: width,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "font-poppins",
    lineHeight: 28,
    color: "#3A3B3C",
    maxWidth: 326,
  },
  defaultTitle: {
    marginTop: 64,
  },
  lastSlideTitle: {
    marginTop: 32,
  },
  subtitle: {
    marginTop: 16,
    maxWidth: 326,
    textAlign: "center",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#6B7280",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 48,
  },
  indicator: {
    height: 12,
    width: 12,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 3,
    borderRadius: 100,
  },
  activeIndicator: {
    backgroundColor: "#9CA3AF",
    width: 12,
  },
  skipButton: {
    alignSelf: "center",
    height: 48,
  },
  skipText: {
    fontSize: 16,
    color: "#6744FF",
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: 16,
    width: "100%",
  },
});
