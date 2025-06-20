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
import BackHeader from "@/components/atoms/BackHeader";

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
  const { data } = route.params;

  const { mutate: joinCommunityFromUniversity, isPending: isJoinLoading } =
    useJoinCommunityFromUniversity();
  const limitActionSheetRef = useRef<ActionSheetRef>(null);
  const userProfileData = getUserProfileStore();
  const [imageSrc, setImageSrc] = useState(
    data?.campus || DEFAULT_CAMPUS_IMAGE,
  );

  const isCommunityAlreadyJoined = useMemo(() => {
    return userProfileData?.communities?.some(
      (c) => c.communityId === data?.communityId,
    );
  }, [data, userProfileData]);

  const handleViewCommunity = () => {
    navigation.navigate("Community", {
      communityId: data?.communityId,
    });
  };

  const handleJoinCommunity = () => {
    joinCommunityFromUniversity(data._id, {
      onSuccess: (response: any) => {
        if (response.statusCode === 406) {
          limitActionSheetRef.current?.show();
        } else {
          Toast.show("Joined Community");
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
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "white",
      }}
    >
      <BackHeader
        label="Search Institution"
        onPress={() => navigation.goBack()}
      />

      <View className="p-4">
        <Image
          source={{ uri: imageSrc }}
          style={{ width: "100%", height: 220, borderRadius: 10 }}
          onError={handleImageError}
        />

        <View
          style={{ marginTop: 32, marginBottom: 16 }}
          className="w-full rounded-b-2xl relative flex flex-row items-center gap-2"
        >
          <CommunityLogo logoUrl={data?.logo || ""} />
          <Text
            style={styles.universityName}
            className="flex flex-row items-center max-w-72"
          >
            {data?.name}
          </Text>
        </View>

        <Text
          style={{ marginBottom: 32 }}
          className="flex flex-row items-center text-xs text-neutral-600"
        >
          {data?.short_overview || "Not Available"}
        </Text>

        <View style={{ marginBottom: 64 }}>
          {isCommunityAlreadyJoined ? (
            <ReusableButton
              containerStyle="mt-4"
              buttonText="View Community"
              variant="primary"
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
          )}
        </View>

        <UniversityOverview description={data?.long_description} />
        <UniversityContact data={data} />
      </View>

      <ActionSheet ref={limitActionSheetRef} gestureEnabled={true}>
        <UniversityLimitReachedBottomSheet />
      </ActionSheet>
    </ScrollView>
  );
};

const UniversityOverview = ({ description }: { description?: string }) => (
  <View style={{ marginBottom: 32 }} className="flex flex-col gap-4">
    <Text style={{ fontSize: 24 }} className="text-neutral-700 font-bold">
      Overview
    </Text>
    <View className="flex flex-col gap-4">
      <Text className="text-xs text-neutral-500">{description}</Text>
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
        <Text style={styles.primarycolor} className="text-xs font-semibold">
          {title}
        </Text>
      </View>
      <Pressable onPress={handlePress} className="flex flex-col">
        <Text
          style={title === "Link" ? styles.primaryLink : styles.neutral}
          className="text-neutral-900 text-sm"
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
        style={{ fontSize: 24, paddingTop: 32 }}
        className="text-neutral-900 text-base font-extrabold"
      >
        Contact Info
      </Text>

      <View className="flex justify-between gap-5 flex-col">
        <View className="bg-neutral-200 py-2 px-4 w-full rounded-lg flex flex-col gap-10">
          {contactData.map((item, index) => (
            <UniversityCard
              key={index}
              icon={item.icon}
              title={item.title}
              info={item.info || ""}
            />
          ))}
        </View>

        <View className="bg-neutral-200 py-2 px-4 w-full rounded-lg flex flex-col gap-10">
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
});
