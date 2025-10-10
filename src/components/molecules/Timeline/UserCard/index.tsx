// components/CommentHeader.tsx
import { BinMinusIn, MoreHoriz } from "iconoir-react-native";
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Avatar from "@/assets/avatar.svg";
import DropdownWrapper from "../../SelectDropDownWrapper";
import { FONTS } from "@/constants/fonts";

interface CommenterProfile {
  profile_dp?: { imageUrl?: string };
  study_year?: string;
  major?: string;
  occupation?: string;
  affiliation?: string;
}

interface Commenter {
  _id: string;
  firstName: string;
  lastName: string;
}

interface CommentHeaderProps {
  commenter: Commenter;
  profile: CommenterProfile;
  isStudent: boolean;
  onNavigate: (id: string) => void;
}

interface UserCardProps {
  userId: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  isStudent: boolean;
  studyYear?: string;
  major?: string;
  occupation?: string;
  affiliation?: string;
  onNavigate: (id: string) => void;
  toShowOption: boolean;
  handleDelete: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
  userId,
  firstName,
  lastName,
  imageUrl,
  isStudent,
  studyYear,
  major,
  occupation,
  affiliation,

  onNavigate,
  toShowOption = false,
  handleDelete,
}) => {
  return (
    <View className="flex-1 flex-row items-center gap-4 justify-center">
      <View style={styles.avatarContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.profileImage}
            className="rounded-full"
            resizeMode="cover"
          />
        ) : (
          <Avatar width={48} height={48} />
        )}
      </View>

      <View className="flex-1 flex-row items-center">
        <TouchableOpacity onPress={() => onNavigate(userId)} className="flex-1">
          <Text style={styles.nameFont} className="text-neutral-700 text-2xs">
            {firstName} {lastName}
          </Text>
          <View className="flex">
            <Text style={styles.userDetails}>
              {isStudent ? studyYear : occupation}
            </Text>
            <Text style={styles.userDetails}>
              {isStudent ? major : affiliation}
            </Text>
          </View>
        </TouchableOpacity>

        {toShowOption && (
          <DropdownWrapper
            position="left"
            extraLeft={10}
            viewTopPosition={-40}
            renderDropdown={(closeDropdown) => (
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  handleDelete();
                  closeDropdown();
                }}
              >
                <BinMinusIn height={16} width={16} />
                <Text className="text-neutral-700">Delete</Text>
              </TouchableOpacity>
            )}
          >
            {/* <View className="flex justify-center items-center"> */}
            <TouchableOpacity style={styles.moreButton}>
              <MoreHoriz height={20} width={20} color="#6744FF" />
            </TouchableOpacity>
            {/* </View> */}
          </DropdownWrapper>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 20,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  userDetails: {
    fontSize: 10,
    color: "#6B7280",
    fontFamily: FONTS.inter.regular,
  },
  moreButton: {
    backgroundColor: "#F3F2FF",
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: 90,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  nameFont: {
    fontFamily: FONTS.inter.semiBold,
  },
});

export default UserCard;
