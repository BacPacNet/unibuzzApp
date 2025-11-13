import { useEffect } from "react";
import messaging, {
  AuthorizationStatus,
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";
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
      case notificationRoleAccess.REPLIED_TO_COMMENT:
        return navigation.navigate("SinglePost", {
          postID: data.postId,
          type: "Timeline",
          commentId: data?.commentId,
          from: screenName.notifications,
          isReply: true,
        });
      case notificationRoleAccess.COMMUNITY_COMMENT:
        return navigation.navigate("SinglePost", {
          postID: data.postId,
          type: "Community",
          commentId: data?.commentId,
          from: screenName.notifications,
        });
      case notificationRoleAccess.REPLIED_TO_COMMUNITY_COMMENT:
        return navigation.navigate("SinglePost", {
          postID: data.postId,
          type: "Community",
          commentId: data?.commentId,
          from: screenName.notifications,
          isReply: true,
        });
      case notificationRoleAccess.COMMUNITY_ADMIN_POST:
        return navigation.navigate("SinglePost", {
          postID: data.communityPostId,
          type: "Community",

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
      case notificationRoleAccess.MESSAGE_NOTIFICATION:
        return navigation.navigate("Messages", {
          screen: "Messages",
          params: { selectedUserId: data.chatId },
        });

      case notificationRoleAccess.ACCEPTED_OFFICIAL_GROUP_REQUEST:
      case notificationRoleAccess.ACCEPTED_PRIVATE_GROUP_REQUEST:
      case notificationRoleAccess.OFFICIAL_GROUP_REQUEST:
      case notificationRoleAccess.GROUP_INVITE:
      case notificationRoleAccess.REJECTED_PRIVATE_GROUP_REQUEST:
      case notificationRoleAccess.community_post_accepted_notification:
      case notificationRoleAccess.community_post_rejected_notification:
      case notificationRoleAccess.community_post_live_request_notification:
        if (data.communityId && data.communityGroupId) {
          return navigation.navigate("CommunityGroup", {
            communityId: data.communityId,
            communityGroupId: data.communityGroupId,
            from: screenName.notifications,
          });
        } else {
          return navigation.navigate("Notifications");
        }
      case notificationRoleAccess.DELETED_COMMUNITY_GROUP:
      case notificationRoleAccess.REJECTED_OFFICIAL_GROUP_REQUEST:
      case notificationRoleAccess.PRIVATE_GROUP_REQUEST:
        return navigation.navigate("Notifications");
      default:
        break;
    }
  };

  useEffect(() => {
    const getToken = async (): Promise<void> => {
      try {
        await messaging().deleteToken();
        const token = await messaging().getToken();

        storeNotificationToken(token);
        savePushNotificationToken({ token });
      } catch (error) {
        console.error("Failed to get FCM token", error);
      }
    };

    const checkAndRequestPermission = async (): Promise<void> => {
      if (Platform.OS === "ios") {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          console.log("Notification permission not granted.");
          return;
        }
        await messaging().registerDeviceForRemoteMessages();
        await getToken();
      } else if (Platform.OS === "android") {
        if (Platform.Version >= 33) {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );

          if (result === PermissionsAndroid.RESULTS.GRANTED) {
            await getToken();
          }
        } else {
          await getToken();
        }
      }
    };

    const unsubscribeOnNotificationOpenedApp =
      messaging().onNotificationOpenedApp(
        async (remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
          if (remoteMessage?.data) {
            console.log("remoteMessage", remoteMessage);
            await handleUpdateIsRead(remoteMessage.data);
          }
        }
      );

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage?.data) {
          console.log("remoteMessage 2", remoteMessage);
          handleUpdateIsRead(remoteMessage.data);
        }
      });

    const unsubscribe = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        // Optional: show local alert/toast if needed
        // Alert.alert("New message", remoteMessage.notification?.body);
        // ToastAndroid.show(`New message: ${remoteMessage.notification?.body}`, ToastAndroid.LONG);
      }
    );

    void checkAndRequestPermission();

    return () => {
      unsubscribe();
      unsubscribeOnNotificationOpenedApp();
    };
  }, []);
};
