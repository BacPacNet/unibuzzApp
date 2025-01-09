import { useRef, useState } from "react";
import {
  Dimensions,
  View,
  Image,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";

import { useTheme } from "@/theme";

import Typography from "@/components/atoms/Typography/Typography";
import { TypographySize, TypographyVariant } from "@/theme/styling/types";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: require("../../../images/image1.png"),
    title: "Welcome to Unibuzz!",
    subtitle:
      "Welcome to Unibuzz, the global university network that caters to your university needs.",
  },
  {
    id: "2",
    image: require("../../../images/image2.png"),
    title: "First, search your university",
    subtitle:
      "Find your university from our database and get ready to join the vibrant community within it!",
  },
  {
    id: "3",
    image: require("../../../images/image3.png"),
    title: "Join the university community",
    subtitle:
      "Find your university from our database and get ready to join the vibrant community within it!",
  },
  {
    id: "4",
    image: require("../../../images/image4.png"),
    title: "Lastly, enjoy the features",
    subtitle:
      "With a wide range of social networking features, messaging, and an AI powered assistant, we will make your university life a blast.",
  },
];

const styles = StyleSheet.create({
  subtitle: {
    marginTop: 10,
    maxWidth: width,
    textAlign: "center",
    padding: 10,
  },
  title: {
    color: "black",
    fontSize: 22,
    textAlign: "center",
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },
  indicator: {
    height: 12,
    width: 12,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 3,
    borderRadius: 100,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});

interface SlideItem {
  image: any;
  title: string;
  subtitle: string;
}

function OnboardingSwiper() {
  const { colors, layout, fonts } = useTheme();
  //  const { t } = useTranslation(["startup"]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef<FlatList<SlideItem>>(null);
  const navigation = useNavigation();

  const updateCurrentSlideIndex = (e: {
    nativeEvent: { contentOffset: { x: any } };
  }) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };
  const Slide = ({ item }: { item: SlideItem }) => {
    return (
      <View style={[layout.itemsCenter]}>
        <Image
          source={item?.image}
          style={{ height: "75%", width, resizeMode: "contain" }}
        />
        <View style={{ justifyContent: "flex-start" }}>
          <Typography
            variant={TypographyVariant.HEADING}
            size={TypographySize.SMALL}
            style={[
              fonts.alignCenter,
              fonts.bold,
              { width: width, padding: 10 },
            ]}
          >
            {item?.title}
          </Typography>
          <Typography
            variant={TypographyVariant.PARAGRAPH}
            size={TypographySize.MEDIUM}
            style={styles.subtitle}
          >
            {item?.subtitle}
          </Typography>
        </View>
      </View>
    );
  };

  const Indicator = () => {
    return (
      <View style={[layout.justifyBetween]}>
        {/* Indicator container */}
        <View style={[layout.row, layout.justifyCenter]}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex == index && {
                  backgroundColor: "#9CA3AF",
                  width: 30,
                },
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <>
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        contentContainerStyle={{ height: height * 0.8 }}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        renderItem={({ item }) => <Slide item={item} />}
      />
      <Indicator />
      <Pressable
        onPress={() => {
          navigation.navigate("LoginScreen" as never);
        }}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
            alignSelf: "flex-start",
            margin: "auto",
            marginTop: 16,
          },
        ]}
      >
        <Typography
          variant={TypographyVariant.LINK}
          size={TypographySize.MEDIUM}
          color={colors.primary}
          style={[fonts.alignCenter]}
        >
          Skip Onboarding
        </Typography>
      </Pressable>
    </>
  );
}

export default OnboardingSwiper;
