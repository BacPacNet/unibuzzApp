import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProfileCard from "../../RightSIdeBar/ProfileCard";
import ProfileInfo from "../UserInformation";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";

import { getUserStore } from "@/storage/user";
import { memo, useCallback, useMemo } from "react";

import CommunityLogo from "@/components/atoms/LogoHolder";
import Badge from "@/assets/badge.svg";
import { IsUniversityVerified } from "@/utils";
import { userTypeEnum } from "@/types/register";

type Props = {
  firstName: string;
  lastName: string;
  profile?: {
    profile_dp?: {
      imageUrl?: string;
    };
  };
  university_name: string;
  study_year?: string;
  degree?: string;

  userId: string;
  bio?: string;
  logos?: string;

  following?: any[];
  followers?: any[];
  major?: string;
  affiliation?: string;
  occupation?: string;
  email?: string;
  phone_number?: string;
  city?: string;
  dob?: string;
  country?: string;
  role: string;
};
type NavigationProp = StackNavigationProp<RootStackParamList, "Profile">;
export const FlatListProfileHeaderPart = ({
  firstName,
  lastName,

  university_name,
  userId,
  affiliation,
  bio,
  city,
  country,
  degree,
  dob,
  email,
  followers,
  following,
  logos,
  major,
  occupation,
  phone_number,
  profile,
  study_year,
  role,
}: Props) => {
  const userData = useMemo(() => getUserStore(), []);
  const { navigate } = useNavigation<NavigationProp>();
  const isStudent = role === userTypeEnum.Student;

  const handleNavigate = useCallback(
    (type: string) => {
      navigate("UsersScreen", {
        userId,
        type,
      });
    },
    [navigate, userId],
  );

  return (
    <View style={styles.bottomMargin} className="bg-white ">
      <View className="flex-1 ">
        <ProfileCard
          name={firstName + " " + lastName}
          avatarUrl={profile?.profile_dp?.imageUrl || ""}
          university={university_name}
          year={study_year || ""}
          degree={degree || ""}
          isSelfProfile={userData?.id == userId}
          toShow={true}
          isStudent={isStudent}
          occupation={occupation}
          major={major}
          affiliation={affiliation}
          isSideBar={false}
          userId={userId}
        />
      </View>
      <View
        style={styles.padding}
        className=" text-neutral-700 flex gap-4 flex-1"
      >
        {bio?.length ? (
          <Text className="text-neutral-500 text-xs">{bio}</Text>
        ) : null}

        <View style={styles.innerContainer}>
          <CommunityLogo logoUrl={logos || ""} variant="large" />
          <View style={styles.textContainer}>
            <Text
              style={[styles.communityName]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {university_name}
            </Text>

            {IsUniversityVerified() ? (
              <Badge width={12} height={12} style={styles.badge} />
            ) : (
              <Text></Text>
            )}
          </View>
        </View>
        <View className="flex flex-row gap-4">
          <TouchableOpacity
            onPress={() => handleNavigate("following")}
            style={styles.followButton}
          >
            <Text className="text-neutral-700 font-bold text-2xs">
              {following?.length || 0} Following
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleNavigate("followers")}
            style={styles.followButton}
          >
            <Text className="text-neutral-700 font-bold text-2xs">
              {followers?.length || 0} Followers
            </Text>
          </TouchableOpacity>
        </View>

        <ProfileInfo
          email={email || ""}
          phone={phone_number || ""}
          location={city}
          birthday={dob || ""}
          country={country || ""}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomMargin: {
    marginBottom: 32,
  },
  padding: {
    paddingHorizontal: 16,
  },
  UniversityLogoPic: {
    width: 30,
    height: 30,
    borderRadius: 30,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: "80%",
  },
  communityName: {
    fontSize: 12,
    color: "#3A3B3C",
    fontWeight: "700",
  },
  followButton: {
    paddingHorizontal: 16,
    // paddingVertical: 12,
    height: 36,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    width: 16,
    height: 16,
  },
});
