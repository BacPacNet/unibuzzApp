import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Share,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useMemo, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import BackHeader from "@/components/atoms/BackHeader";
import { Toast } from "react-native-toast-notifications";
import Avatar from "@/assets/avatar.svg";
import { format } from "date-fns";
import { useGetUserReferrals } from "@/services/user";
import { Referral } from "@/types/users";
import { NEXT_PROD_FE_BASE_URL } from "@env";
import { useReferralShare } from "@/hooks/useReferralShare";
import { getUserProfileSubtitleLines } from "@/lib/userProfileSubtitle";

const REFERRALS_PAGE_SIZE = 15;

const ReferralScreen = () => {
  const { goBack } = useNavigation();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUserReferrals(REFERRALS_PAGE_SIZE);

  const firstPage = data?.pages[0];
  const referralCode = firstPage?.referCode?.toUpperCase() || "";
  const baseUrl = NEXT_PROD_FE_BASE_URL;
  const referralLink = `${baseUrl}/register?referralCode=${referralCode}`;
  const referredUsers = useMemo(
    () => data?.pages.flatMap((page) => page.referrals) ?? [],
    [data]
  );
  const totalReferrals = firstPage?.totalReferrals ?? 0;

  const { shareReferral } = useReferralShare({
    referralCode,
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

  const renderReferralItem = useCallback(
    ({ item: user }: { item: Referral }) => {
      const { line1, line2 } = getUserProfileSubtitleLines({
        role: user.profile?.role,
        study_year: user.profile?.study_year,
        major: user.profile?.major,
        occupation: user.profile?.occupation,
        affiliation: user.profile?.affiliation,
      });

      return (
      <View style={styles.referredUserItem}>
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
            {line1 ? <Text style={styles.userMeta}>{line1}</Text> : null}
            {line2 ? <Text style={styles.userMeta}>{line2}</Text> : null}
          </View>
        </View>
        <View style={styles.userRightSection}>
          <Text style={styles.referredLabel}>Referred</Text>
          <Text style={styles.referredDate}>{formatDate(user.createdAt)}</Text>
        </View>
      </View>
      );
    },
    []
  );

  const listHeader = useMemo(
    () => (
      <>
        <BackHeader label="Settings" onPress={() => goBack()} />
        <View style={styles.paddingContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Refer Now</Text>
            <Text style={styles.description}>
              Share your referral code with friends and help them join the
              community!
            </Text>
            <TouchableOpacity
              style={styles.referNowButton}
              onPress={shareReferral}
              activeOpacity={0.8}
            >
              <Text style={styles.referNowButtonText}>Refer Now</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Referrals</Text>
            <Text style={styles.description}>
              View all users who have joined using your referral code. You have
              referred {totalReferrals}{" "}
              {totalReferrals === 1 ? "user" : "users"}.
            </Text>
            <View style={styles.divider} />
          </View>
        </View>
      </>
    ),
    [goBack, shareReferral, totalReferrals]
  );

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
      <FlatList
        data={referredUsers}
        keyExtractor={(item) => item._id}
        renderItem={renderReferralItem}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContent}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No referrals yet</Text>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoading}>
              <ActivityIndicator size="small" color="#6744FF" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default ReferralScreen;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: "white",
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  paddingContainer: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: "#374151",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  description: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
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
    paddingHorizontal: 16,
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
    paddingHorizontal: 16,
  },
  footerLoading: {
    paddingVertical: 16,
    alignItems: "center",
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
