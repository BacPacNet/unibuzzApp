import {
  View,
  Text,
  Image,
  ScrollView,
  Linking,
  Pressable,
  StyleSheet,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
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
import { getUserProfileStore } from "@/storage/user";
import { useJoinCommunityFromUniversity } from "@/services/university-community";
import { Toast } from "react-native-toast-notifications";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import UniversityLimitReachedBottomSheet from "@/components/molecules/University/UniversityLimitReachedBottomSheet.tsx";

type NavigationProp = StackNavigationProp<RootStackParamList, "University">;
const University = ({ route }: any) => {
  const navigation = useNavigation<NavigationProp>();
  const { data } = route.params;

  const { mutate: joinCommunityFromUniversity, isPending: isJoinLoading } =
    useJoinCommunityFromUniversity();
  const limitActionSheetRef = useRef<ActionSheetRef>(null);
  const userProfileData = getUserProfileStore();
  const [imageSrc, setImageSrc] = useState(
    data?.campus ||
      "https://cdn.pixabay.com/photo/2017/08/20/12/13/architecture-2661547_1280.jpg",
  );

  const isCommunityAlreadyJoined = useMemo(() => {
    return userProfileData?.communities?.some(
      (c) => c.communityId === data?.communityId,
    );
  }, [data, userProfileData]);

  const handleViewCommunity = () => {
    return navigation.navigate("Community", {
      communityId: data?.communityId,
    });
  };

  const handleClick = () => {
    joinCommunityFromUniversity(data._id, {
      onSuccess: (response: any) => {
        if (response.statusCode === 406) {
          return limitActionSheetRef.current?.show();
        } else {
          Toast.show("Joined Community");
          return navigation.navigate("Community", {
            communityId: response.data.community._id,
          });
        }
      },
    });
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "white",
      }}
    >
      <View className="p-4">
        <Image
          source={{ uri: imageSrc }}
          style={{ width: "100%", height: 300, borderRadius: 10 }}
          onError={() =>
            setImageSrc(
              "https://cdn.pixabay.com/photo/2017/08/20/12/13/architecture-2661547_1280.jpg",
            )
          }
        />
        <View className="w-full py-4  rounded-b-2xl relative flex flex-row items-center gap-2">
          <CommunityLogo logoUrl={data?.logo} />
          <Text className=" flex flex-row items-center text-xl text-neutral-700 font-bold font-poppins max-w-72">
            {data?.name}
          </Text>
        </View>
        <Text className=" flex flex-row items-center text-md text-neutral-500   ">
          {data?.short_overview || "Not Available"}
        </Text>

        {isCommunityAlreadyJoined ? (
          <ReusableButton
            containerStyle="mt-4"
            buttonText="View Community"
            variant="primary"
            onPress={handleViewCommunity}
          />
        ) : (
          <ReusableButton
            containerStyle="mt-4"
            buttonText="Join Community"
            variant="primary"
            onPress={handleClick}
          />
        )}

        {UniversityOverview(data?.long_description)}
        {UniversityContact(data)}
        {/* {UniversityReviews()} */}
      </View>
      <ActionSheet
        ref={limitActionSheetRef}
        gestureEnabled={true}
        // snapPoints={[70, 100]}
      >
        <UniversityLimitReachedBottomSheet />
      </ActionSheet>
    </ScrollView>
  );
};

const UniversityOverview = (overview: string) => {
  return (
    <View className="flex flex-col gap-4 ">
      <Text className="text-neutral-900 text-base font-extrabold">
        Overview
      </Text>

      <View className="flex flex-col gap-4">
        <Text className="text-md text-neutral-500">{overview}</Text>
      </View>
    </View>
  );
};

const UniversityCard = ({
  icon,
  title,
  info,
}: {
  icon: any;
  title: string;
  info: string;
}) => {
  const Icon = icon;

  const handlePress = () => {
    if (!info) return;

    if (title === "Link") {
      let url = info[0];
      console.log("inff", info);

      if (!/^https?:\/\//i.test(info)) {
        url = `https://${info}`;
      }
      Linking.openURL(url);
    } else if (title === "Phone") {
      Linking.openURL(`tel:${info}`);
    } else if (title === "Email") {
      Linking.openURL(`mailto:${info}`);
    }
  };

  return (
    <View className="flex   ">
      <View className="flex flex-row gap-2 items-center">
        <Icon style={styles.primarycolor} height={20} width={20} />
        <Text style={styles.primarycolor} className=" text-lg ">
          {title}
        </Text>
      </View>
      <Pressable onPress={handlePress} className="flex flex-col">
        <Text
          style={title == "Link" ? styles.primaryLink : styles.neutral}
          className="text-neutral-900 text-md"
        >
          {info || "Not available"}
        </Text>
      </Pressable>
    </View>
  );
};

const UniversityContact = (data: any) => {
  const contactData = [
    {
      icon: Mail,
      title: "Email",
      info: data?.email,
    },
    {
      icon: Phone,
      title: "Phone",
      info: data?.phone,
    },
    {
      icon: City,
      title: "Address",
      info: data?.address,
    },
  ];

  const additionalData = [
    {
      icon: Link,
      title: "Link",
      info: data?.web_pages,
    },
    {
      icon: Community,
      title: "Total Students",
      info: data?.total_students,
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
      <Text className="text-neutral-900 text-base font-extrabold">
        Contact Info
      </Text>

      <View className="flex  justify-between gap-5 flex-col">
        <View className="bg-neutral-200 py-2 px-4 w-full  rounded-lg flex flex-col gap-10  ">
          {contactData.map((item, index) => (
            <UniversityCard
              key={index}
              icon={item.icon}
              title={item.title}
              info={item.info}
            />
          ))}
        </View>

        <View className="bg-neutral-200 py-2 px-4 w-full  rounded-lg flex flex-col gap-10  ">
          {additionalData.map((item, index) => (
            <UniversityCard
              key={index}
              icon={item.icon}
              title={item.title}
              info={item.info}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const UniversityReviews = () => {
  return (
    <View className="flex flex-col gap-4 mt-4">
      <Text className="text-neutral-900 text-base font-extrabold">Reviews</Text>

      <View className="flex flex-col gap-4 items-center justify-center h-60">
        <Text className="text-neutral-900 text-base font-extrabold">
          Reviews are coming soon!
        </Text>

        <Text className="text-neutral-700 text-xs text-center max-w-lg">
          This feature is under construction. If you would like to have it
          sooner send us some feedback!
        </Text>
      </View>
    </View>
  );
};

export default University;

const styles = StyleSheet.create({
  primarycolor: {
    color: "#3a169c",
  },
  primaryLink: {
    color: "#6744ff",
    textDecorationLine: "underline",
  },
  neutral: {
    color: "#18191A",
  },
});
