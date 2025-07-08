import {
  Eye,
  EyeClosed,
  HomeSimpleDoor,
  Group,
  Spark,
  MailSolid,
  BellNotificationSolid,
} from "iconoir-react-native";
import { Text, View } from "react-native";

// const tabIcons: Record<string, (focused: boolean) => JSX.Element> = {

//   Home: (focused) => (
//     <HomeSimpleDoor
//       fill={focused ? "#6744FF" : "#6B7280"}
//       height={24}
//       width={24}
//       color="white"
//     />
//   ),
//   Example: (focused) =>
//     focused ? (
//       <Eye height={24} width={24} color="#6744FF" />
//     ) : (
//       <EyeClosed height={24} width={24} />
//     ),
//   Connection: (focused) => (
//     <Group
//       height={24}
//       width={24}
//       color="white"
//       fill={focused ? "#6744FF" : "#6B7280"}
//     />
//   ),
//   Messages: (focused) => (
//     <MailSolid height={24} width={24} color={focused ? "#6744FF" : "#6B7280"} />
//   ),
//   Notifications: (focused) => (
//     // <BellNotificationSolid
//     //   height={24}
//     //   width={24}
//     //   color={focused ? "#6744FF" : "#6B7280"}
//     // />

//     <View style={{ position: "relative" }}>
//       <BellNotificationSolid
//         height={24}
//         width={24}
//         color={focused ? "#6744FF" : "#6B7280"}
//       />
//       <View
//         style={{
//           position: "absolute",
//           top: -4,
//           right: -4,
//           backgroundColor: "red",
//           borderRadius: 8,
//           paddingHorizontal: 4,
//           paddingVertical: 1,
//           minWidth: 16,
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
//           2
//         </Text>
//       </View>
//     </View>
//   ),
//   AIAssistant: (focused) => (
//     <Spark height={24} width={24} color={focused ? "#6744FF" : "black"} />
//   ),
// };

export const getTabIcons = (
  unreadCount: number = 0,
  unreadMessagesCount: number = 0,
): Record<
  | "Home"
  | "Example"
  | "Connection"
  | "MessagesStack"
  | "Notifications"
  | "AIAssistant",
  (focused: boolean) => JSX.Element
> =>
  ({
    Home: (focused: boolean) => (
      <HomeSimpleDoor
        fill={focused ? "#6744FF" : "#6B7280"}
        height={28}
        width={28}
        color="white"
      />
    ),
    Example: (focused: boolean) =>
      focused ? (
        <Eye height={24} width={28} color="#6744FF" />
      ) : (
        <EyeClosed height={24} width={28} />
      ),
    Connection: (focused: boolean) => (
      <Group
        height={28}
        width={28}
        color="white"
        fill={focused ? "#6744FF" : "#6B7280"}
      />
    ),
    MessagesStack: (focused: boolean) => (
      <View style={{ position: "relative" }}>
        <MailSolid
          height={28}
          width={28}
          color={focused ? "#6744FF" : "#6B7280"}
        />
        {unreadMessagesCount && Number(unreadMessagesCount) > 0 ? (
          <View
            style={{
              position: "absolute",
              top: -4,
              right: -8,
              backgroundColor: "red",
              borderRadius: 8,
              paddingHorizontal: 4,
              minWidth: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
              {String(unreadMessagesCount)}
            </Text>
          </View>
        ) : null}
      </View>
    ),
    Notifications: (focused: boolean) => (
      <View style={{ position: "relative" }}>
        <BellNotificationSolid
          height={28}
          width={28}
          color={focused ? "#6744FF" : "#6B7280"}
        />
        {unreadCount && Number(unreadCount) > 0 ? (
          <View
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              backgroundColor: "red",
              borderRadius: 8,
              paddingHorizontal: 4,
              minWidth: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
              {String(unreadCount)}
            </Text>
          </View>
        ) : null}
      </View>
    ),
    AIAssistant: (focused: boolean) => (
      <Spark height={28} width={28} color={focused ? "#6744FF" : "black"} />
    ),
  }) satisfies Record<string, (focused: boolean) => JSX.Element>;

// export default tabIcons;
