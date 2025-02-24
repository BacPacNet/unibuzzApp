import {
  Eye,
  EyeClosed,
  HomeSimpleDoor,
  Group,
  Spark,
  MailSolid,
  BellNotificationSolid,
} from "iconoir-react-native";

const tabIcons: Record<string, (focused: boolean) => JSX.Element> = {
  Home: (focused) => (
    <HomeSimpleDoor
      fill={focused ? "#6744FF" : "#6B7280"}
      height={24}
      width={24}
      color="white"
    />
  ),
  Example: (focused) =>
    focused ? (
      <Eye height={24} width={24} color="#6744FF" />
    ) : (
      <EyeClosed height={24} width={24} />
    ),
  Connection: (focused) => (
    <Group
      height={24}
      width={24}
      color="white"
      fill={focused ? "#6744FF" : "#6B7280"}
    />
  ),
  Messages: (focused) => (
    <MailSolid height={24} width={24} color={focused ? "#6744FF" : "#6B7280"} />
  ),
  Notifications: (focused) => (
    <BellNotificationSolid
      height={24}
      width={24}
      color={focused ? "#6744FF" : "#6B7280"}
    />
  ),
  AIAssistant: (focused) => (
    <Spark height={24} width={24} color={focused ? "#6744FF" : "black"} />
  ),
};

export default tabIcons;
