import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Share,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import BackHeader from "@/components/atoms/BackHeader";
import { Toast } from "react-native-toast-notifications";
import Avatar from "@/assets/avatar.svg";
import { format } from "date-fns";
import { useGetUserReferrals } from "@/services/user";
import { Referral } from "@/types/users";
import { NEXT_PROD_FE_BASE_URL } from "@env";
import { useReferralShare } from "@/hooks/useReferralShare";
import { FONTS } from "@/constants/fonts";
import ReusableButton from "@/components/atoms/ReusableButton";
import ReferralImage from "@/assets/placeHolder/celebrate.svg";

const ReferralScreen = () => {
  const { goBack } = useNavigation();
  const { data: referralsData, isLoading, isError } = useGetUserReferrals();

  const referralCode = referralsData?.referCode?.toUpperCase() || "";
  const baseUrl = NEXT_PROD_FE_BASE_URL; // You may want to get this from env
  const referralLink = `${baseUrl}/register?referralCode=${referralCode}`;
  const referredUsers = referralsData?.referrals || [];
  const totalReferrals = referralsData?.totalReferrals || 0;

  // Use the custom referral share hook with platform-specific store URLs
  const { shareReferral } = useReferralShare({
    referralCode,
    // Optionally use referralLink as downloadUrl, or let hook use store URLs
    // downloadUrl: referralLink,
    customMessage: referralLink,
  });

  const handleCopyLink = async () => {
    try {
      await Share.share({
        message: referralLink,
      });
    } catch (error: any) {
      if (error.message !== "User did not share") {
        Toast.show("Failed to share link", { type: "error" });
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.containerMain}>
        <BackHeader label="Settings" onPress={() => goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6744FF" />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.containerMain}>
        <BackHeader label="Settings" onPress={() => goBack()} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Failed to load referrals. Please try again.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.containerMain}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <BackHeader label="Settings" onPress={() => goBack()} />
        <View style={styles.paddingContainer}>
          {/* Refer Now Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Referrals</Text>
            <ReferralImage width={"100%"} height={126} />
            <Text style={styles.description}>
              Copy your referral link and share it to earn rewards.
            </Text>
            {/* <TouchableOpacity
              style={styles.referNowButton}
              onPress={shareReferral}
              activeOpacity={0.8}
            >
              <Text style={styles.referNowButtonText}>Refer Now</Text>
            </TouchableOpacity> */}
            <ReusableButton
              variant="shade"
              buttonText="Share Link"
              size={"w-full"}
              height="large"
              onPress={shareReferral}
            />
          </View>

          {/* Referrals Section */}
          {/* <View style={styles.section}>
            <Text style={styles.sectionTitle}>Referrals</Text>
            <Text style={styles.description}>
              View all users who have joined using your referral code. You have
              referred {totalReferrals}{" "}
              {totalReferrals === 1 ? "user" : "users"}.
            </Text>
            <View style={styles.divider} />

            {referredUsers.length > 0 ? (
              <View>
                {referredUsers.map((user: Referral) => (
                  <View key={user._id} style={styles.referredUserItem}>
                    <View style={styles.userLeftSection}>
                      <View style={styles.avatarWrapper}>
                        {user.profile?.profile_dp?.imageUrl ? (
                          <Image
                            source={{ uri: user.profile.profile_dp.imageUrl }}
                            style={styles.avatar}
                          />
                        ) : (
                          <Avatar width={48} height={48} />
                        )}
                      </View>
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>
                          {user.firstName} {user.lastName}
                        </Text>
                        {user.profile?.study_year && (
                          <Text style={styles.userMeta}>
                            {user.profile.study_year}
                          </Text>
                        )}
                        {user.profile?.major && (
                          <Text style={styles.userMeta}>
                            {user.profile.major}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.userRightSection}>
                      <Text style={styles.referredLabel}>Referred</Text>
                      <Text style={styles.referredDate}>
                        {formatDate(user.createdAt)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>No referrals yet</Text>
            )}
          </View> */}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ReferralScreen;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: "white",
  },
  paddingContainer: {
    padding: 16,
  },
  section: {
    gap: 32,
  },
  sectionTitle: {
    fontSize: 28,
    fontFamily: FONTS.poppins.bold,
    color: "#3A3B3C",
  },
  description: {
    color: "#6B7280",
    fontSize: 16,
    lineHeight: 20,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  linkInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#374151",
    backgroundColor: "#F9FAFB",
  },
  copyButton: {
    backgroundColor: "#6744FF",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  copyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },
  referredUserItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  userLeftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  avatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  userInfo: {
    marginLeft: 12,
    flexShrink: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  userRightSection: {
    alignItems: "flex-end",
  },
  referredLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  referredDate: {
    fontSize: 14,
    color: "#6B7280",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    textAlign: "center",
  },
  referNowButton: {
    backgroundColor: "#6744FF",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  referNowButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
