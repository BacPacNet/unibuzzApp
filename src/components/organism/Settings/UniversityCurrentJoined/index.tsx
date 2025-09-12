import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import BackHeader from "@/components/atoms/BackHeader";
import Badge from "@/assets/badge.svg";
import ReusableButton from "@/components/atoms/ReusableButton";
import CommunityLogo from "@/components/atoms/LogoHolder";
import { CheckCircleSolid, PlusCircleSolid } from "iconoir-react-native";
import { FormInput } from "@/components/atoms/FormInput";
import { universitySettingsScreen } from "@/screens/SettingsScreens/UniversityVerificationScreen";
import { FONTS } from "@/constants/fonts";
import { useGetUserProfileVerifiedUniversityEmailData } from "@/services/user-Profile";

const FeatureList = () => (
  <View style={{ marginTop: 32 }}>
    <View className="flex gap-1 my-2">
      <View className="flex-row gap-2 items-center">
        <CheckCircleSolid color={"#6744FF"} height={24} width={24} />
        <Text style={styles.featureListText}>
          Join multiple university communities.
        </Text>
      </View>
      <View className="flex-row gap-2 items-center">
        <CheckCircleSolid color={"#6744FF"} height={24} width={24} />
        <Text style={styles.featureListText}>
          Create your own groups within your university network.
        </Text>
      </View>
      <View className="flex-row gap-2 items-center">
        <CheckCircleSolid color={"#6744FF"} height={24} width={24} />
        <Text style={styles.featureListText}>
          Get full access to private groups and exclusive discussions.
        </Text>
      </View>
    </View>
  </View>
);

interface Props {
  goBack: () => void;
  email: any;
  setCurrScreen: (screen: universitySettingsScreen) => void;
  control: any;
}

const UniversityVerificationInfo = ({
  goBack,
  email,
  setCurrScreen,
  control,
}: Props) => {
  const {
    data: verifiedUniversityEmailData,
    refetch,
    isFetching,
  } = useGetUserProfileVerifiedUniversityEmailData();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <BackHeader label="Settings" onPress={goBack} />
      <View style={styles.paddingContainer}>
        <Text style={styles.title}>University Verification</Text>
        <Text style={styles.desc}>
          Verify your account through your university email to unlock full
          features:
        </Text>

        {FeatureList()}

        {isFetching ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#7367f0" />
          </View>
        ) : verifiedUniversityEmailData?.length > 0 ? (
          <View>
            <View style={{ marginVertical: 32 }}>
              <Text style={styles.emailText}>
                You are currently verified for the following universities.
              </Text>
            </View>
            {verifiedUniversityEmailData?.map((item: any, idx: number) => (
              <View style={{ marginBottom: 20 }} key={idx}>
                <FormInput
                  label="University Email"
                  placeholder="Email"
                  name="mail"
                  control={control}
                  isError={false}
                  disabled={true}
                  currentValue={item?.UniversityEmail}
                />
                <View className="flex flex-row items-center justify-start gap-2">
                  <CommunityLogo logoUrl={item?.logo} variant="small" />
                  <Text className="text-xs text-neutral-700 font-medium">
                    {item?.UniversityName}
                  </Text>
                  <Badge width={12} height={12} style={styles.badge} />
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-neutral-700">
            You are not verified for any university.
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <ReusableButton
          onPress={() => setCurrScreen(universitySettingsScreen.addUniversity)}
          buttonText="Verify Account"
          buttonContent={
            <View className="flex flex-row items-center justify-center gap-2">
              <Text className="text-sm text-white">Verify Account</Text>
              <PlusCircleSolid color="white" height={20} width={20} />
            </View>
          }
          variant="primary"
          height="large"
        />
      </View>
    </ScrollView>
  );
};

export default UniversityVerificationInfo;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  paddingContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.poppins.bold,
    color: "#3A3B3C",
  },
  desc: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    marginTop: 8,
    color: "#6B7280",
  },
  buttonContainer: {
    marginTop: 64,
    paddingBottom: "8%",
    paddingHorizontal: 16,
  },
  badge: {
    width: 16,
    height: 16,
  },
  featureListText: {
    fontFamily: FONTS.inter.regular,
    color: "#4B5563",
    fontSize: 14,
  },
  emailText: {
    fontFamily: FONTS.inter.regular,
    color: "#3A3B3C",
    fontSize: 16,
  },
});
