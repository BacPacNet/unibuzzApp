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

export const getTabIcons = (
  unreadCount: number = 0,
  unreadMessagesCount: number = 0,
): Record<
  "Home" | "Example" | "Connection" | "Messages" | "Notifications" | "BuzzBot",
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
    Messages: (focused: boolean) => (
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
    BuzzBot: (focused: boolean) => (
      <Spark height={28} width={28} color={focused ? "#6744FF" : "black"} />
    ),
  }) satisfies Record<string, (focused: boolean) => JSX.Element>;
