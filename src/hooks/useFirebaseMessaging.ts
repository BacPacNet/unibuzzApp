import { useEffect } from "react";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { Alert, PermissionsAndroid, Platform, ToastAndroid } from "react-native";
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
      case notificationRoleAccess.MESSAGE_NOTIFICATION:
        return navigation.navigate("Messages", {
          screen: "Messages",
          params: { selectedUserId: data.chatId },
        });
      case notificationRoleAccess.PRIVATE_GROUP_REQUEST:
      case notificationRoleAccess.ACCEPTED_OFFICIAL_GROUP_REQUEST:
      case notificationRoleAccess.ACCEPTED_PRIVATE_GROUP_REQUEST:
      case notificationRoleAccess.OFFICIAL_GROUP_REQUEST:
      case notificationRoleAccess.GROUP_INVITE:
      case notificationRoleAccess.REJECTED_OFFICIAL_GROUP_REQUEST:
      case notificationRoleAccess.REJECTED_PRIVATE_GROUP_REQUEST:
        return navigation.navigate("Notifications");
      default:
        break;
    }
  };

//   useEffect(() => {
//     const getToken = async (): Promise<void> => {
//       try {
//         const token = await messaging().getToken();
//         storeNotificationToken(token);
//         savePushNotificationToken({ token });
//       } catch (error) {
//         console.error("Failed to get FCM token", error);
//       }
//     };

//     const checkAndRequestPermission = async (): Promise<void> => {
//       if (Platform.OS === "ios") {
//         const status = await messaging().hasPermission();
//         if (
//           status === messaging.AuthorizationStatus.NOT_DETERMINED ||
//           status === messaging.AuthorizationStatus.DENIED
//         ) {
//           const requestStatus = await messaging().requestPermission();
//           const granted =
//             requestStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//             requestStatus === messaging.AuthorizationStatus.PROVISIONAL;

//           if (granted) {
//             await getToken();
//           }
//         } else if (
//           status === messaging.AuthorizationStatus.AUTHORIZED ||
//           status === messaging.AuthorizationStatus.PROVISIONAL
//         ) {
//           await getToken();
//         }
//       } else if (Platform.OS === "android") {
//         if (Platform.Version >= 33) {
//           const result = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//           );
//           if (result === PermissionsAndroid.RESULTS.GRANTED) {
//             await getToken();
//           } else {
//             console.warn("Android notification permission denied");
//           }
//         } else {
//           console.log("Android notification permission granted");
//           await getToken();
//         }
//       }
//     };

//     const unsubscribeOnNotificationOpenedApp =
//       messaging().onNotificationOpenedApp(
//         async (remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
//           if (remoteMessage?.data) {
//             await handleUpdateIsRead(remoteMessage.data);
//           }
//         },
//       );

//     messaging()
//       .getInitialNotification()
//       .then((remoteMessage) => {
//         if (remoteMessage?.data) {
//           handleUpdateIsRead(remoteMessage.data);
//         }
//       });

//     const unsubscribe = messaging().onMessage(
//       async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
//         // Optional: show local alert/toast if needed
//         // Alert.alert("New message", remoteMessage.notification?.body);
  
//         // ToastAndroid.show(`New message: ${remoteMessage.notification?.body}`, ToastAndroid.LONG);
//       },
//     );

//     void checkAndRequestPermission();

//     return () => {
//       unsubscribe();
//       unsubscribeOnNotificationOpenedApp();
//     };
//   }, []);


useEffect(() => {
  const getToken = async (): Promise<void> => {
    try {
      const token = await messaging().getToken();
      storeNotificationToken(token);
      savePushNotificationToken({ token });
    } catch (error) {
      console.error("Failed to get FCM token", error);
    }
  };

  const checkAndRequestPermission = async (): Promise<void> => {
    if (Platform.OS === "ios") {
      const status = await messaging().hasPermission();
      
      if (
        status === messaging.AuthorizationStatus.NOT_DETERMINED ||
        status === messaging.AuthorizationStatus.DENIED
      ) {

        const requestStatus = await messaging().requestPermission();
        
        const granted =
          requestStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          requestStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (granted) {

          await getToken();
        }
      } else if (
        status === messaging.AuthorizationStatus.AUTHORIZED ||
        status === messaging.AuthorizationStatus.PROVISIONAL
      ) {
   
        await getToken();
      }
    } else if (Platform.OS === "android") {
      if (Platform.Version >= 33) {
     
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
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
      // Optional: show local alert/toast if needed
      // Alert.alert("New message", remoteMessage.notification?.body);
      // ToastAndroid.show(`New message: ${remoteMessage.notification?.body}`, ToastAndroid.LONG);
    },
  );

  void checkAndRequestPermission();

  return () => {
    unsubscribe();
    unsubscribeOnNotificationOpenedApp();
  };
}, []);
};
