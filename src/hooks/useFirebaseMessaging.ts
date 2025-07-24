import { useEffect } from "react";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { Alert, Platform } from "react-native";
import { storeNotificationToken } from "@/storage/NotificationToken";
import { useHandleSavePushNotificationToken } from "@/services/pushNotification";
import { notificationRoleAccess } from "@/types/notifications";
import { screenName } from "@/constant/screenName";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = StackNavigationProp<RootStackParamList, "Notifications">;

export const useFirebaseMessaging = (): void => {
  const { mutate: savePushNotificationToken } =
    useHandleSavePushNotificationToken();

  const navigation = useNavigation<NavigationProp>();
  const handleUpdateIsRead = async (data: any) => {
    switch (data?.type) {
      case notificationRoleAccess.FOLLOW:
        return navigation.navigate("ProfileStack", {
          screen: "Profile",
          params: {
            userId: data.sender_id,
            from: screenName.notifications,
          },
        });
      case notificationRoleAccess.COMMENT:
        return navigation.navigate("SinglePost", {
          postID: data.postId,
          type: "Timeline",
          commentId: data?.commentId,
          from: screenName.notifications,
        });
      case notificationRoleAccess.COMMUNITY_COMMENT:
        return navigation.navigate("SinglePost", {
          postID: data.postId,
          type: "Community",
          commentId: data?.commentId,
          from: screenName.notifications,
        });
      case notificationRoleAccess.REACTED_TO_POST:
        return navigation.navigate("SinglePost", {
          postID: data.postId,
          type: "Timeline",
          from: screenName.notifications,
        });
      case notificationRoleAccess.REACTED_TO_COMMUNITY_POST:
        return navigation.navigate("SinglePost", {
          postID: data.communityPostId,
          type: "Community",
          from: screenName.notifications,
        });
      case notificationRoleAccess.PRIVATE_GROUP_REQUEST:
      case notificationRoleAccess.ACCEPTED_OFFICIAL_GROUP_REQUEST:
      case notificationRoleAccess.ACCEPTED_PRIVATE_GROUP_REQUEST:
      case notificationRoleAccess.OFFICIAL_GROUP_REQUEST:
      case notificationRoleAccess.GROUP_INVITE:
      case notificationRoleAccess.REJECTED_OFFICIAL_GROUP_REQUEST:
      case notificationRoleAccess.REJECTED_PRIVATE_GROUP_REQUEST:
        return navigation.navigate("CommunityGroup", {
          communityId: data.communityGroupId?.communityId,
          communityGroupId: data.communityGroupId?._id,
          from: screenName.notifications,
        });
      default:
        break;
    }
  };

  useEffect(() => {
    const requestPermission = async (): Promise<void> => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        await getToken();
      }
    };

    const getToken = async (): Promise<void> => {
      try {
        const token = await messaging().getToken();

        storeNotificationToken(token);
        const data = {
          token: token,
        };
        savePushNotificationToken(data);
      } catch (error) {
        console.error("Failed to get FCM token", error);
      }
    };

    const unsubscribeOnNotificationOpenedApp =
      messaging().onNotificationOpenedApp(
        async (remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
          if (remoteMessage?.data) {
            await handleUpdateIsRead(remoteMessage.data);
          }
        },
      );

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage?.data) {
          handleUpdateIsRead(remoteMessage.data);
        }
      });

    const unsubscribe = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        // Alert.alert(
        //   "New FCM Message",
        //   remoteMessage?.notification?.body ?? "No message body"
        // );
        // console.log("Foreground FCM message:", remoteMessage);
      },
    );

    if (Platform.OS === "ios" || Number(Platform.Version) >= 33) {
      void requestPermission();
    } else {
      void getToken();
    }

    return () => {
      unsubscribe();
      unsubscribeOnNotificationOpenedApp();
    };
  }, []);
};
