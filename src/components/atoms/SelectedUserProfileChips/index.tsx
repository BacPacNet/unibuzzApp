import React, { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AvatarPlaceHolder from "@/assets/avatarPlaceholder.png";
import { Xmark } from "iconoir-react-native";
type Props = {
  avatarUrl: string;
  onRemove: (userId: string) => void;
  userId: string;
  name: string;
};

const SelectedUserProfileChips = ({
  avatarUrl,
  onRemove,
  userId,
  name,
}: Props) => {
  const [imageError, setImageError] = useState(false);
  //   return console.log("avatarSrc", avatarSrc);

  return (
    <View style={styles.chipContainer}>
      <View style={[styles.imageWrapper]}>
        <Image
          // source={{ uri: avatarSrc }}
          source={
            !imageError && avatarUrl ? { uri: avatarUrl } : AvatarPlaceHolder
          }
          style={styles.communityImage}
          onError={() => setImageError(true)}
        />
        <TouchableOpacity
          style={styles.remove}
          onPress={() => onRemove(userId)}
        >
          <Xmark width={20} height={20} color="#6744FF" />
        </TouchableOpacity>
      </View>
      <Text>{name}</Text>
    </View>
  );
};

type IndividualUser = {
  profile: {
    profile_dp: {
      imageUrl: string;
    };
  };
  firstName: string;
  _id: string;
};

type ChipsProps = {
  individualsUsers: IndividualUser[];
  onRemove: (userId: string) => void;
};

export const SelectUserProfileChips = ({
  individualsUsers,
  onRemove,
}: ChipsProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {individualsUsers?.map((item, index) => (
        <SelectedUserProfileChips
          key={item._id || index}
          avatarUrl={item.profile.profile_dp.imageUrl}
          name={item.firstName}
          userId={item._id}
          onRemove={onRemove}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    overflow: "scroll",
  },
  imageWrapper: {
    width: 50,
    display: "flex",
    padding: 4,
    backgroundColor: "#fff",
    borderRadius: 24,
    position: "relative",
  },
  remove: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#E9E8FF",
    borderRadius: 24,
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
  chipContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
