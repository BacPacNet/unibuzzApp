import SidebarMenuSectionFour from "@/components/molecules/RightSIdeBar/MenuSecFour";
import SidebarMenuSectionOne from "@/components/molecules/RightSIdeBar/MenuSecOne";
import SidebarMenuSectionThree from "@/components/molecules/RightSIdeBar/MenuSecThree";
import SidebarMenuSectionTwo from "@/components/molecules/RightSIdeBar/MenuSecTwo";
import ProfileCard from "@/components/molecules/RightSIdeBar/ProfileCard";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  navigation: any;
  handleClick: (route: string) => void;
};

const RightSideSidebar = ({ navigation, handleClick }: Props) => {
  return (
    <SafeAreaView>
      <ScrollView>
        <ProfileCard toShow={true} />
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
    </SafeAreaView>
  );
};

export default RightSideSidebar;
