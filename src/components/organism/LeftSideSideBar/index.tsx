import LeftSideBarPagesSection from "@/components/molecules/LeftSideBar/PagesSec/Index";
import UniversitySec from "@/components/molecules/LeftSideBar/UniversitySec";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LeftSideSideBar = () => {
  return (
    <SafeAreaView className="bg-white flex-1 ">
      <ScrollView>
        <LeftSideBarPagesSection />
        <UniversitySec />
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeftSideSideBar;
