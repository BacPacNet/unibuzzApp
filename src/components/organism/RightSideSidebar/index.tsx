import SidebarMenuSectionFour from "@/components/molecules/RightSIdeBar/MenuSecFour";
import SidebarMenuSectionOne from "@/components/molecules/RightSIdeBar/MenuSecOne";
import SidebarMenuSectionThree from "@/components/molecules/RightSIdeBar/MenuSecThree";
import SidebarMenuSectionTwo from "@/components/molecules/RightSIdeBar/MenuSecTwo";
import ProfileCard from "@/components/molecules/RightSIdeBar/ProfileCard";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

type Props = {};

const RightSideSidebar = ({ navigation, handleClick }: any) => {
  return (
    <ScrollView>
      <ProfileCard />
      <SidebarMenuSectionOne
        navigation={navigation}
        handleClick={handleClick}
      />

      <SidebarMenuSectionTwo />

      <SidebarMenuSectionThree />

      <SidebarMenuSectionFour />
      <View className="flex items-center justify-center">
        <Text className="">Unibuzz Networks © 2024 </Text>
      </View>
    </ScrollView>
  );
};

export default RightSideSidebar;
