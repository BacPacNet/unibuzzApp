import LeftSideBarPagesSection from "@/components/molecules/LeftSideBar/PagesSec/Index";
import UniversitySec from "@/components/molecules/LeftSideBar/UniversitySec";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LeftSideSideBar = () => {
  return (
    <SafeAreaView className="bg-white flex-1 ">
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* <LeftSideBarPagesSection /> */}
        <UniversitySec />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingVertical: 48,
  },
});

export default LeftSideSideBar;
