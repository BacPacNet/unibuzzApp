import { RootStackParamList } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { User } from "iconoir-react-native";
import UniversityLogoPlaceHolder from "@/assets/unibuzz_rounded.svg";
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

type NavigationProp = StackNavigationProp<RootStackParamList, "Timeline">;
const GroupSelectors = ({
  currSelectedGroup,
  setCurrSelectedGroup,

  data,
}: any) => {
  const navigation = useNavigation<NavigationProp>();

  const handleGroupNavigate = () => {
    setCurrSelectedGroup(data);
    navigation.navigate("CommunityGroup", {
      communityId: data?.communityId,
      communityGroupId: data?._id,
    });
  };

  const isSelected = currSelectedGroup?._id === data?._id;

  return (
    <TouchableOpacity
      onPress={handleGroupNavigate}
      style={[styles.container, isSelected && styles.selected]}
    >
      <View style={styles.innerContainer}>
        {data?.communityGroupLogoUrl?.imageUrl ? (
          <Image
            source={{ uri: data.communityGroupLogoUrl.imageUrl }}
            style={styles.image}
          />
        ) : (
          //   <User style={styles.icon} />
          <UniversityLogoPlaceHolder
            width={40}
            height={40}
            style={styles.placeHolderLogo}
          />
        )}
        <Text
          style={[
            styles.label,
            isSelected ? styles.selectedText : styles.unselectedText,
          ]}
        >
          {data?.title || data?.communityGroupName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  selected: {
    backgroundColor: "#f0f0f0",
  },

  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 200,
  },
  icon: {
    fontSize: 40,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 20,
    color: "#6647FF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  placeHolderLogo: {
    width: 40,
    height: 40,
    borderRadius: 200,
  },
  label: {
    fontSize: 12,
  },
  selectedText: {
    fontWeight: "bold",
    color: "#333",
  },
  unselectedText: {
    fontWeight: "500",
    color: "#666",
  },
});

export default GroupSelectors;
