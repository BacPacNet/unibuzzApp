import {
  View,
  Text,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Gesture, GestureDetector, ScrollView } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import ReusableButton from "@/components/atoms/ReusableButton";
import {
  Mail,
  Phone,
  Link,
  City,
  Clock,
  Community,
} from "iconoir-react-native";
import CommunityLogo from "@/components/atoms/LogoHolder";
import {
  getUserProfileStore,
  updateUserProfileCommunities,
} from "@/storage/user";
import { useJoinCommunityFromUniversity } from "@/services/university-community";
import { Toast } from "react-native-toast-notifications";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import UniversityLimitReachedBottomSheet from "@/components/molecules/University/UniversityLimitReachedBottomSheet.tsx";
import BackHeader from "@/components/atoms/BackHeader";
import { FONTS } from "@/constants/fonts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { userTypeEnum } from "@/types/register";
import { MESSAGES } from "@/content/constant";
import {
  useGetPartnerUniversities,
  useGetUniversitiesHighlightedPostd,
  useUniversitySearchByName,
} from "@/services/universitySearch";
import DiscoverPostCard from "@/components/molecules/Timeline/DiscoverPostCard";
import { PostType } from "@/types/postType";

type NavigationProp = StackNavigationProp<RootStackParamList, "University">;

interface UniversityData {
  _id: string;
  name: string;
  campus?: string;
  logo?: string;
  short_overview?: string;
  long_description?: string;
  communityId?: string;
  email?: string;
  phone?: string;
  address?: string;
  web_pages?: string;
  total_students?: string;
  office_hours?: string;
  isAllowedToJoin?: boolean;
}

interface UniversityCardProps {
  icon: React.ComponentType<any>;
  title: string;
  info?: string;
}

const DEFAULT_CAMPUS_IMAGE =
  "https://cdn.pixabay.com/photo/2017/08/20/12/13/architecture-2661547_1280.jpg";

const University = ({
  route,
}: {
  route: { params: { data: UniversityData } };
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { data: routeData } = route.params;
  const { data: searchedUniversity } = useUniversitySearchByName(
    routeData?.name ?? "",
  );
  const { data: highlightedPosts } = useGetUniversitiesHighlightedPostd(
    searchedUniversity?._id || "",
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalHighlightedPosts = highlightedPosts?.length ?? 0;
  const { height: screenHeight } = useWindowDimensions();
  const highlightedPostsMinHeight = screenHeight - 290;
  const { data: partnerUniversities } = useGetPartnerUniversities();
  const university = searchedUniversity ?? routeData;
  const isAllowedToJoin = useMemo(
    () => partnerUniversities?.some((u: any) => u._id === university?._id),
    [partnerUniversities, university?._id],
  );
  const insets = useSafeAreaInsets();
  const { mutate: joinCommunityFromUniversity, isPending: isJoinLoading } =
    useJoinCommunityFromUniversity();
  const limitActionSheetRef = useRef<ActionSheetRef>(null);
  const userProfileData = getUserProfileStore();
  const [imageSrc, setImageSrc] = useState(
    university?.campus || DEFAULT_CAMPUS_IMAGE
  );

  const isCommunityAlreadyJoined = useMemo(() => {
    return userProfileData?.communities?.some(
      (c) => c.communityId === university?.communityId
    );
  }, [university, userProfileData]);

  const handleViewCommunity = () => {
    navigation.navigate("Community", {
      communityId: university?.communityId,
    });
  };


  const handleSwipeNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === totalHighlightedPosts - 1 ? 0 : prev + 1,
    );
  }, [totalHighlightedPosts]);

  const handleSwipePrev = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? totalHighlightedPosts - 1 : prev - 1,
    );
  }, [totalHighlightedPosts]);

  const highlightedPostsSwipeGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-20, 20])
        .failOffsetY([-15, 15])
        .onEnd((event) => {
          if (event.translationX < -40) {
            runOnJS(handleSwipeNext)();
          } else if (event.translationX > 40) {
            runOnJS(handleSwipePrev)();
          }
        }),
    [handleSwipeNext, handleSwipePrev],
  );

  const currentHighlightedPost = highlightedPosts?.[currentIndex];

  const handleJoinCommunity = () => {
    const isStudentOrFaculty =
      userProfileData?.role === userTypeEnum.Student ||
      userProfileData?.role === userTypeEnum.Faculty;
    const partneredUniversity = userProfileData?.email?.[0];
    const isJoiningDifferentUniversity =
      !!partneredUniversity?.UniversityName &&
      (partneredUniversity.communityId
        ? partneredUniversity.communityId !== university?.communityId
        : partneredUniversity.UniversityName.toLowerCase() !==
          university?.name?.toLowerCase());

    if (isStudentOrFaculty && isJoiningDifferentUniversity) {
      navigation.navigate("Home", { screen: "Timeline" } as any);
      Toast.hideAll();
      Toast.show(
        MESSAGES.ALREADY_AFFILIATED_WITH_UNIVERSITY(
          partneredUniversity.UniversityName
        ),
        { placement: "top" }
      );
      return;
    }

    joinCommunityFromUniversity(university._id, {
      onSuccess: (response: any) => {
        if (response.statusCode === 406) {
          limitActionSheetRef.current?.show();
        } else {
          Toast.hideAll();
          Toast.show("Joined Community");
          updateUserProfileCommunities(response.data.profile.communities);

          navigation.navigate("Community", {
            communityId: response.data.community._id,
          });
        }
      },
    });
  };

  const handleImageError = () => {
    setImageSrc(DEFAULT_CAMPUS_IMAGE);
  };

  return (
    <ScrollView
      directionalLockEnabled
      nestedScrollEnabled
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "white",
      }}
    >
      <BackHeader
        label="Search Institution"
        onPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <Image
          source={{ uri: imageSrc }}
          style={{ width: "100%", height: 220, borderRadius: 10 }}
          onError={handleImageError}
        />

        <View
          style={{ marginTop: 32, marginBottom: 16 }}
          className="w-full rounded-b-2xl relative flex flex-row items-center justify-center gap-2"
        >
          <CommunityLogo logoUrl={university?.logo || ""} />
          <Text
            style={styles.universityName}
            className="flex flex-row items-center max-w-72"
          >
            {university?.name}
          </Text>
        </View>

        <Text
          style={{ marginBottom: 32 }}
          className="flex flex-row items-center text-xs text-neutral-600 text-center"
        >
          {university?.short_overview || "Not Available"}
        </Text>

        <View style={{ marginBottom: 64 }}>
          {isAllowedToJoin &&
            (isCommunityAlreadyJoined ? (
              <ReusableButton
                containerStyle="mt-4"
                buttonText="View Community"
                variant="shade"
                onPress={handleViewCommunity}
                height="large"
              />
            ) : (
              <ReusableButton
                containerStyle="mt-4"
                buttonText="Join Community"
                variant="primary"
                onPress={handleJoinCommunity}
                height="large"
                disabled={isJoinLoading}
              />
            ))}
        </View>
{highlightedPosts?.length > 0 && currentHighlightedPost && (
          <View
            style={[
              styles.highlightedPostsSection,
              { minHeight: highlightedPostsMinHeight },
            ]}
          >
            <Text style={styles.secTitle}>From the University</Text>

            <GestureDetector gesture={highlightedPostsSwipeGesture}>
              <View style={styles.highlightedPostsCarousel}>
                <DiscoverPostCard
                key={currentHighlightedPost._id}
                user={`${currentHighlightedPost.user?.firstName ?? ""} ${currentHighlightedPost.user?.lastName ?? ""}`.trim()}
                adminId={currentHighlightedPost.user?._id}
                university={currentHighlightedPost.profile?.university_name}
                year={currentHighlightedPost.profile?.study_year}
                text={currentHighlightedPost.content}
                date={currentHighlightedPost.createdAt}
                avatarLink={currentHighlightedPost.profile?.profile_dp?.imageUrl}
                postID={currentHighlightedPost._id}
                type={
                  "communityId" in currentHighlightedPost
                    ? PostType.Community
                    : PostType.Timeline
                }
                images={currentHighlightedPost.imageUrl || []}
                idx={currentIndex}
                major={currentHighlightedPost.profile?.major}
                affiliation={currentHighlightedPost.profile?.affiliation}
                occupation={currentHighlightedPost.profile?.occupation}
                role={currentHighlightedPost.profile?.role}
                communityName={currentHighlightedPost.communityName}
                communityGroupName={currentHighlightedPost.communityGroupName}
                isCommunityAdmin={currentHighlightedPost.profile?.isCommunityAdmin}
                communities={currentHighlightedPost.profile?.communities}
              />
              </View>
            </GestureDetector>

            <View style={styles.paginationDots}>
              {highlightedPosts.map((_: unknown, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentIndex === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          </View>
        )}
        <UniversityOverview description={university?.long_description} />
        <UniversityContact data={university} />

        
      </View>

      <ActionSheet
        ref={limitActionSheetRef}
        gestureEnabled={true}
        safeAreaInsets={insets}
      >
        <UniversityLimitReachedBottomSheet />
      </ActionSheet>
    </ScrollView>
  );
};

const UniversityOverview = ({ description }: { description?: string }) => (
  <View style={{ marginBottom: 32,marginTop: 64 }} className="flex flex-col gap-4">
    <Text style={styles.secTitle} >
      Overview
    </Text>
    <View className="flex flex-col gap-4">
      <Text className="text-xs text-neutral-500 text-center">{description}</Text>
    </View>
  </View>
);

const UniversityCard = ({ icon, title, info }: UniversityCardProps) => {
  const Icon = icon;

  const handlePress = () => {
    if (!info) return;

    switch (title) {
      case "Link":
        const url = /^https?:\/\//i.test(info) ? info : `https://${info}`;
        Linking.openURL(url);
        break;
      case "Phone":
        Linking.openURL(`tel:${info}`);
        break;
      case "Email":
        Linking.openURL(`mailto:${info}`);
        break;
    }
  };

  return (
    <View className="flex">
      <View className="flex flex-row gap-2 items-center">
        <Icon style={styles.primarycolor} height={20} width={20} />
        <Text style={styles.contactTitle}>{title}</Text>
      </View>
      <Pressable onPress={handlePress} className="flex flex-col">
        <Text
          style={title === "Link" ? styles.contactDesc : styles.contactDesc}
        >
          {info || "Not available"}
        </Text>
      </Pressable>
    </View>
  );
};

const UniversityContact = ({ data }: { data: UniversityData }) => {
  const contactData = [
    { icon: Mail, title: "Email", info: data?.email || "" },
    { icon: Phone, title: "Phone", info: data?.phone || "" },
    { icon: City, title: "Address", info: data?.address || "" },
  ];

  const additionalData = [
    { icon: Link, title: "Link", info: data?.web_pages || "" },
    {
      icon: Community,
      title: "Total Students",
      info: data?.total_students || "",
    },
    {
      icon: Clock,
      title: "Office Hours",
      info:
        data?.office_hours ||
        "Monday to Friday 9:00 am - 12:00 p.m. and 1:00 p.m - 5:00 p.m",
    },
  ];

  return (
    <View className="flex flex-col gap-4 mt-4">
      <Text
        style={[styles.secTitle, { paddingTop: 32 }]}
       
      >
        Contact Info
      </Text>

      <View className="flex justify-between gap-5 flex-col">
        <View
          style={styles.contactContainer}
          className="bg-neutral-200 w-full rounded-lg flex flex-col "
        >
          {contactData.map((item, index) => (
            <UniversityCard
              key={index}
              icon={item.icon}
              title={item.title}
              info={item.info || ""}
            />
          ))}
        </View>

        <View
          style={styles.contactContainer}
          className="bg-neutral-200 w-full rounded-lg flex flex-col "
        >
          {additionalData.map((item, index) => (
            <UniversityCard
              key={index}
              icon={item.icon}
              title={item.title}
              info={item.info || ""}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default University;

const styles = StyleSheet.create({
  primarycolor: {
    color: "#3A169C",
  },
  primaryLink: {
    color: "#6744ff",
    textDecorationLine: "underline",
  },
  neutral: {
    color: "#18191A",
  },
  universityName: {
    fontSize: 20,
    fontWeight: 700,
    color: "#3A3B3C",
    fontFamily: "poppins",
    marginLeft: 12,
  },

  container: {
    padding: 16,
    paddingBottom: 64,
  },
  contactContainer: {
    padding: 20,
    gap: 32,
  },
  contactTitle: {
    fontFamily: FONTS.inter.semiBold,
    color: "#3A169C",
    fontSize: 16,
  },
  contactDesc: {
    fontFamily: FONTS.inter.semiBold,
    color: "#3A3B3C",
    fontSize: 16,
  },
  highlightedPostsSection: {
    marginTop: 32,
    gap: 24,
  },
  highlightedPostsCarousel: {
    flex: 1,
    justifyContent: "flex-start",
  },

  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D4D4D4",
  },
  activeDot: {
    backgroundColor: "#6744FF",
  },
  secTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#3A3B3C",
    fontFamily: "poppins",
    textAlign: "center",
  },
});
