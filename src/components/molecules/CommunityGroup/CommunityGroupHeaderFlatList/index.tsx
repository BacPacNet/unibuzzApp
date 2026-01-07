import React, { useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import ReusableButton from "../../../atoms/ReusableButton";
import JoinGroupButton from "../../../atoms/JoinGroupButton";
import OfficailLogoPlaceHolder from "@/assets/community/official-logo.svg";
import { CommunityGroupTypeEnum, status } from "@/types/CommunityGroup";
import {
  Globe,
  Lock,
  Settings,
  WarningCircleSolid,
} from "iconoir-react-native";
import DropdownWrapper from "../../SelectDropDownWrapper";
import CommunityGroupSettingPopMenu from "../CommunityGroupSettingPopMenu";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import CommmunityGroupInfo from "../CommunityGroupInfoBottomSheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { FONTS } from "@/constants/fonts";
import {
  notificationRoleAccess,
  notificationStatus,
} from "@/types/notifications";
import { useJoinCommunityGroup } from "@/services/notification";
import { Community as CommunityIcon } from "iconoir-react-native";
import UniversityPlaceholder from "@/assets/community/university_banner.svg";
import LeaveCommunityGroupBottomSheet from "../LeaveCommunityGroupBottomSheet";
import GenericInfoBottomSheet from "../../GenericInfoBottomSheet";
import { verifyUniversityEmailMessage } from "@/content/constant";
import DeleteCommunityGroupBottomSheet from "../DeleteCommunityGroupBottomSheet";

type CommunityGroup = {
  title: string;
  description: string;
  users: { id: string }[];
};

type Props = {
  imageSrc: any;
  logoSrc: any;
  isGroupOfficial: boolean;
  isGroupPrivate: boolean;
  isUserJoinedCommunityGroup: any;
  isGroupAdmin: boolean;
  isUserVerifiedForCommunity: boolean;
  isJoinCommunityPending: boolean;
  logoSrcErr: boolean;
  setLogoSrcErr: (err: boolean) => void;
  ImageSrcErr: boolean;
  setImageSrcErr: (err: boolean) => void;
  communityGroups: CommunityGroup | any;
  userStatus: any;
  handleToggleJoinCommunityGroup: () => void;
  setModalVisible: (visible: boolean) => void;
  membersBottomSheet: React.RefObject<any>;
  communityLogoUrl: string;
  groupStatus: string;
  adminId: string;
  leaveCommunityGroup: () => void;
  isCommunityGroupNotLive: boolean;
  refetch: () => void;
};
type NavigationProp = StackNavigationProp<RootStackParamList, "CommunityGroup">;

const FlatListCommunityHeader: React.FC<Props> = ({
  imageSrc,
  logoSrc,
  isGroupOfficial,
  isGroupPrivate,
  isUserJoinedCommunityGroup,
  isGroupAdmin,
  isUserVerifiedForCommunity,
  isJoinCommunityPending,
  logoSrcErr,
  setLogoSrcErr,
  ImageSrcErr,
  setImageSrcErr,
  communityGroups,
  userStatus,
  handleToggleJoinCommunityGroup,
  setModalVisible,
  membersBottomSheet,
  communityLogoUrl,
  groupStatus,
  adminId,
  leaveCommunityGroup,
  isCommunityGroupNotLive,
  refetch,
}) => {
  const { mutate: joinGroup, isPending: isJoinGroupPending } =
    useJoinCommunityGroup();
  const universityVerificationBottomSheet = useRef<ActionSheetRef>(null);
  const groupInfoBottomSheet = useRef<ActionSheetRef>(null);
  const leaveCommunityGroupBottomSheet = useRef<ActionSheetRef>(null);
  const deleteCommunityGroupBottomSheet = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();
  const { navigate } = useNavigation<NavigationProp>();
  const onSettingsPress = useCallback(
    () => setModalVisible(true),
    [setModalVisible]
  );

  const onJoinPress = useCallback(
    () => handleToggleJoinCommunityGroup(),
    [handleToggleJoinCommunityGroup]
  );
  const totalCommunityGroupMember = communityGroups?.users.filter(
    (user: { status: status }) => user.status === status.accepted
  ).length;
  const CommunityGroupMember = communityGroups?.users.filter(
    (user: { status: status }) => user.status === status.accepted
  );

  const handleAcceptInvite = () => (e: GestureResponderEvent) => {
    e.stopPropagation?.();
    if (!communityGroups?._id) return;

    if (
      communityGroups?.notificationTypes === notificationRoleAccess.GROUP_INVITE
    ) {
      const payload = {
        isAccepted: true,
        groupId: communityGroups?._id,
        id: communityGroups?.notificationId,
      };
      joinGroup(payload, {
        onSuccess: () => {
          refetch();
        },
        onError: (error: any) => {
          if (error.response.data.message == verifyUniversityEmailMessage) {
            universityVerificationBottomSheet.current?.show();
          }
        },
      });
    }
  };

  const handleNavigateToMembersScreen = useCallback(() => {
    navigate("MembersScreen", {
      CommunityGroupMember,
      communityGroupId: communityGroups?._id,
      communityId: communityGroups?.communityId,
      adminId: adminId,
      groupName: communityGroups?.title,
      communityAdminId: communityGroups?.communityId?.adminId as string[],
      isOfficialGroup:
        communityGroups?.communityGroupType === CommunityGroupTypeEnum.OFFICIAL,
    });
  }, [CommunityGroupMember, communityGroups?.id, navigate]);

  const handleNavigateToEditCommunityGroupScreen = () => {
    navigate("Groups", {
      screen: "EditCommunityGroupScreen",
      params: {
        communityId: communityGroups?.communityId?._id,
        communityGroups: communityGroups,
        groupStatus: groupStatus,
      },
    });
  };

  const handleLeaveCommunityGroup = () => {
    leaveCommunityGroupBottomSheet.current?.show();
  };

  const handleDeleteCommunityGroup = () => {
    deleteCommunityGroupBottomSheet.current?.show();
  };

  return (
    <View style={styles.card}>
      {imageSrc && !ImageSrcErr ? (
        <Image
          source={{
            uri: imageSrc,
          }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImageSrcErr(true)}
          fadeDuration={0}
        />
      ) : (
        <UniversityPlaceholder style={styles.image} />
      )}

      <View style={styles.content}>
        <View style={styles.PrimaryContainer}>
          <View style={styles.titleContainer}>
            <View style={styles.innerContainer}>
              <View style={styles.imageContainer}>
                <View
                  style={[
                    styles.imageWrapper,
                    isGroupOfficial && styles.officialBorder,
                  ]}
                >
                  {logoSrc && !logoSrcErr ? (
                    <Image
                      source={{ uri: logoSrc }}
                      style={styles.communityImage}
                      onError={() => setLogoSrcErr(true)}
                    />
                  ) : (
                    <View style={styles.universityPlaceHolder}>
                      <CommunityIcon
                        width={30}
                        height={30}
                        style={styles.communityImage}
                        fill={"#6647FF"}
                        color={"#6647FF"}
                      />
                    </View>
                  )}
                </View>
                {isGroupOfficial && (
                  <View style={styles.badgeWrapper}>
                    <OfficailLogoPlaceHolder
                      width={12}
                      height={12}
                      style={styles.badgeImage}
                    />
                  </View>
                )}
              </View>
            </View>
            <Text style={styles.title}>{communityGroups?.title}</Text>
          </View>
          {(isUserJoinedCommunityGroup || isGroupAdmin) && (
            <View>
              <DropdownWrapper
                position="left"
                extraLeft={70}
                viewTopPosition={-40}
                renderDropdown={(closeDropdown) => (
                  <CommunityGroupSettingPopMenu
                    isPending={groupStatus === status.pending}
                    isGroupAdmin={isGroupAdmin}
                    leaveCommunityGroup={handleLeaveCommunityGroup}
                    handleNavigateToEditCommunityGroupScreen={
                      handleNavigateToEditCommunityGroupScreen
                    }
                    handleDeleteCommunityGroup={handleDeleteCommunityGroup}
                    communityGroupId={communityGroups?._id}
                    communityId={communityGroups?.communityId?._id}
                    closeDropdown={closeDropdown}
                  />
                )}
              >
                <TouchableOpacity
                  style={styles.settingsGearContainer}
                  onPress={onSettingsPress}
                >
                  <Settings width={20} height={20} color="#6647ff" />
                  {groupStatus === status.pending && isGroupAdmin && (
                    <WarningCircleSolid
                      style={styles.warningIcon}
                      width={12}
                      height={12}
                      color="#F59E0B"
                    />
                  )}
                </TouchableOpacity>
              </DropdownWrapper>
            </View>
          )}
        </View>

        <Text style={styles.description}>{communityGroups?.description}</Text>

        <View style={styles.buttonContainer}>
          {communityGroups?.notificationStatus == notificationStatus.default &&
          communityGroups?.notificationTypes ==
            notificationRoleAccess.GROUP_INVITE ? (
            <ReusableButton
              onPress={() => handleAcceptInvite()({} as any)}
              variant="primary"
              size={120}
              buttonText={`Accept Request`}
              height="small"
              isLoading={isJoinGroupPending}
              disabled={isJoinGroupPending}
            />
          ) : !isUserJoinedCommunityGroup && !isCommunityGroupNotLive ? (
            <JoinGroupButton
              isPrivate={isGroupPrivate}
              isVerified={isUserVerifiedForCommunity}
              isPending={isJoinCommunityPending}
              userStatus={userStatus}
              onClick={onJoinPress}
            />
          ) : null}
          <ReusableButton
            onPress={() => handleNavigateToMembersScreen()}
            disabled={
              !isUserJoinedCommunityGroup &&
              communityGroups?.status !== "pending"
            }
            variant="border"
            size={120}
            buttonText={` ${totalCommunityGroupMember} Members`}
            height="small"
          />
          {!isGroupPrivate ? (
            <TouchableOpacity
              onPress={() => groupInfoBottomSheet.current?.show()}
              style={styles.settingsGearContainer}
            >
              <Globe width={20} height={20} color="#6744FF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => groupInfoBottomSheet.current?.show()}
              style={styles.settingsGearContainer}
            >
              <Lock width={20} height={20} color="#6744FF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ActionSheet
        useBottomSafeAreaPadding
        ref={groupInfoBottomSheet}
        gestureEnabled={true}
        safeAreaInsets={insets}
        // snapPoints={[70, 100]}
        containerStyle={{
          paddingTop: 10,
        }}
      >
        <CommmunityGroupInfo />
      </ActionSheet>
      <ActionSheet
        useBottomSafeAreaPadding
        ref={leaveCommunityGroupBottomSheet}
        gestureEnabled={true}
        safeAreaInsets={insets}
        // snapPoints={[70, 100]}
        containerStyle={{
          paddingTop: 10,
        }}
      >
        <LeaveCommunityGroupBottomSheet
          leaveCommunityGroup={leaveCommunityGroup}
          leaveCommunityGroupBottomSheet={leaveCommunityGroupBottomSheet}
        />
      </ActionSheet>
      <ActionSheet
        useBottomSafeAreaPadding
        ref={deleteCommunityGroupBottomSheet}
        gestureEnabled={true}
        safeAreaInsets={insets}
        // snapPoints={[70, 100]}
        containerStyle={{
          paddingTop: 10,
        }}
      >
        <DeleteCommunityGroupBottomSheet
          deleteCommunityGroupBottomSheet={deleteCommunityGroupBottomSheet}
          communityGroupId={communityGroups?._id}
          communityId={communityGroups?.communityId?._id}
        />
      </ActionSheet>
      <ActionSheet
        ref={universityVerificationBottomSheet}
        gestureEnabled={true}
        safeAreaInsets={insets}
      >
        <GenericInfoBottomSheet
          buttonLabel="Verify Student Email"
          title="Verify Account to Join "
          description="Access to private groups is limited to verified users. Please complete verification to continue."
          onButtonPress={() =>
            navigate("SettingsStack", {
              screen: "UniversityVerification",
            })
          }
        />
      </ActionSheet>
    </View>
  );
};

export default React.memo(FlatListCommunityHeader);
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",

    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
  },

  content: {
    padding: 16,
    // paddingBottom: 32,
    // marginBottom: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: "#E5E7EB",
    gap: 16,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  PrimaryContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "space-between",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontFamily: FONTS.inter.bold,
    color: "#3A3B3C",
    width: "60%",
    minWidth: 200,
    maxWidth: 250,
  },

  description: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: FONTS.inter.medium,
  },
  members: {
    fontWeight: "bold",
    color: "#6744FF",
    fontSize: 12,
  },

  deActive: {
    backgroundColor: "white",
  },

  active: {
    backgroundColor: "#6744FF",
    fontSize: 14,
    fontWeight: "bold",
  },

  communityImagePlaceHolder: {
    width: 46,
    height: 46,
    borderRadius: 200,

    overflow: "hidden",
  },

  officialBorder: {
    borderWidth: 2,
    borderColor: "#a544ff",
  },
  imageWrapper: {
    padding: 4,
    backgroundColor: "#fff",
    borderRadius: 240,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  settingsGearContainer: {
    backgroundColor: "#F3F2FF",
    width: 32,
    height: 32,
    borderRadius: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  warningIcon: {
    position: "absolute",
    top: 0,
    right: 1,
  },
  communityImage: {
    width: 48,
    height: 48,
    borderRadius: 280,
    resizeMode: "cover",
  },

  imageContainer: {
    position: "relative",
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeWrapper: {
    position: "absolute",
    bottom: -10,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#a544ff",
    justifyContent: "center",
    alignItems: "center",
  },

  badgeImage: {
    width: 12,
    height: 12,
    borderRadius: 6,
    objectFit: "contain",
  },

  universityPlaceHolder: {
    width: 48,
    height: 48,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
});
