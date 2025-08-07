import React, { useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import ReusableButton from "../../../atoms/ReusableButton";
import JoinGroupButton from "../../../atoms/JoinGroupButton";
import UniversityLogoPlaceHolder from "@/assets/unibuzz_rounded.svg";
import { status } from "@/types/CommunityGroup";
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
}) => {
  const groupInfoBottomSheet = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();
  const { navigate } = useNavigation<NavigationProp>();
  const onSettingsPress = useCallback(
    () => setModalVisible(true),
    [setModalVisible],
  );

  const onJoinPress = useCallback(
    () => handleToggleJoinCommunityGroup(),
    [handleToggleJoinCommunityGroup],
  );
  const totalCommunityGroupMember = communityGroups?.users.filter(
    (user: { status: status }) => user.status === status.accepted,
  ).length;
  const CommunityGroupMember = communityGroups?.users.filter(
    (user: { status: status }) => user.status === status.accepted,
  );

  const handleNavigateToMembersScreen = useCallback(() => {
    navigate("MembersScreen", {
      CommunityGroupMember,
      communityGroupId: communityGroups?._id,
      communityId: communityGroups?.communityId,
      adminId: adminId,
    });
  }, [CommunityGroupMember, communityGroups?.id, navigate]);

  const handleNavigateToEditCommunityGroupScreen = () => {
    navigate("manageGroupStack", {
      screen: "EditCommunityGroupScreen",
      params: {
        communityId: communityGroups?.communityId?._id,
        communityGroups: communityGroups,
        groupStatus: groupStatus,
      },
    });
  };

  return (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            imageSrc && !ImageSrcErr
              ? imageSrc
              : "https://cdn.pixabay.com/photo/2017/08/20/12/13/architecture-2661547_1280.jpg",
        }}
        style={styles.image}
        onError={() => setImageSrcErr(true)}
      />

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
                      <UniversityLogoPlaceHolder
                        width={40}
                        height={40}
                        style={styles.communityImage}
                      />
                    </View>
                  )}
                </View>
                {isGroupOfficial && (
                  <View style={styles.badgeWrapper}>
                    {communityLogoUrl?.length ? (
                      <Image
                        source={{ uri: communityLogoUrl }}
                        style={styles.badgeImage}
                        onError={() => setLogoSrcErr(true)}
                      />
                    ) : (
                      <UniversityLogoPlaceHolder
                        width={12}
                        height={12}
                        style={styles.badgeImage}
                      />
                    )}
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
                extraLeft={100}
                renderDropdown={() => (
                  <CommunityGroupSettingPopMenu
                    isPending={groupStatus === status.pending}
                    isGroupAdmin={isGroupAdmin}
                    leaveCommunityGroup={leaveCommunityGroup}
                    handleNavigateToEditCommunityGroupScreen={
                      handleNavigateToEditCommunityGroupScreen
                    }
                    communityGroupId={communityGroups?._id}
                    communityId={communityGroups?.communityId?._id}
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

        {/* <TouchableOpacity onPress={() => membersBottomSheet.current?.show()}>
          <Text style={styles.members}>
            {totalCommunityGroupMember} members
          </Text>
        </TouchableOpacity> */}

        <View style={styles.buttonContainer}>
          {!isUserJoinedCommunityGroup && (
            <JoinGroupButton
              isPrivate={isGroupPrivate}
              isVerified={isUserVerifiedForCommunity}
              isPending={isJoinCommunityPending}
              userStatus={userStatus}
              onClick={onJoinPress}
            />
          )}
          <ReusableButton
            onPress={() => handleNavigateToMembersScreen()}
            variant="border_primary"
            size={120}
            buttonText={` ${totalCommunityGroupMember} members`}
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#3A3B3C",
    width: "60%",
    minWidth: 200,
    maxWidth: 250,
  },

  description: {
    marginVertical: 16,
    fontSize: 14,
    color: "#6B7280",
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
    borderColor: "#6647ff",
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
    borderColor: "#6647ff",
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
