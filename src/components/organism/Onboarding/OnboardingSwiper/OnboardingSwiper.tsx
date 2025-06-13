import { useRef, useState } from "react";
import {
  Dimensions,
  View,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SLIDES } from "./constants";
import { OnboardingScreenNavigationProp } from "./types";
import { styles } from "./styles";
import {
  Slide,
  Indicator,
  SkipButton,
  CreateAccountButton,
} from "./components";

// Main Component
function OnboardingSwiper() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<OnboardingScreenNavigationProp>();

  const updateCurrentSlideIndex = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / styles.title.width);
    setCurrentSlideIndex(currentIndex);
  };

  const handleSkip = () => navigation.navigate("LoginScreen");
  const handleCreateAccount = () => navigation.navigate("RegisterScreen");

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <FlatList
          ref={flatListRef}
          onMomentumScrollEnd={updateCurrentSlideIndex}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled
          data={SLIDES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Slide item={item} />}
        />
        <Indicator
          currentIndex={currentSlideIndex}
          totalSlides={SLIDES.length}
        />

        {currentSlideIndex !== 3 ? (
          <SkipButton onPress={handleSkip} />
        ) : (
          <CreateAccountButton onPress={handleCreateAccount} />
        )}
      </View>
    </View>
  );
}

export default OnboardingSwiper;
