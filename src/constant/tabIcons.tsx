import React, { useEffect, useState } from "react";
import {
  Eye,
  EyeClosed,
  HomeSimpleDoor,
  Group,
  Spark,
  MailSolid,
  BellNotificationSolid,
} from "iconoir-react-native";
import { Image, Text, View } from "react-native";
import UniversityLogoPlaceHolder from "@/assets/LogoCircle.svg";
import { Grayscale } from "react-native-color-matrix-image-filters";

const TAB_ICON_SIZE = 28;

const isValidLogoUrl = (logo: string) =>
  typeof logo === "string" &&
  logo.trim().length > 0 &&
  logo !== "null" &&
  logo !== "undefined";

const GroupsTabIcon = ({
  logo,
  focused,
  isCommunityGroup,
}: {
  logo: string;
  focused: boolean;
  isCommunityGroup: boolean;
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [logo]);

  const showPlaceholder = !isValidLogoUrl(logo) || hasError;

  const placeholder = (
    <UniversityLogoPlaceHolder
      width={TAB_ICON_SIZE}
      height={TAB_ICON_SIZE}
      style={{
        width: TAB_ICON_SIZE,
        height: TAB_ICON_SIZE,
        borderRadius: TAB_ICON_SIZE / 2,
      }}
    />
  );

  if (showPlaceholder) {
    return (
      <View
        style={{
          width: TAB_ICON_SIZE,
          height: TAB_ICON_SIZE,
          borderRadius: TAB_ICON_SIZE / 2,
        }}
      >
        {placeholder}
      </View>
    );
  }

  const image = (
    <Image
      source={{ uri: logo }}
      style={{
        width: TAB_ICON_SIZE,
        height: TAB_ICON_SIZE,
        borderRadius: TAB_ICON_SIZE / 2,
      }}
      resizeMode="contain"
      onError={() => setHasError(true)}
    />
  );

  return (
    <View
      style={{
        width: TAB_ICON_SIZE,
        height: TAB_ICON_SIZE,
        borderRadius: TAB_ICON_SIZE / 2,
      }}
    >
      {focused || isCommunityGroup ? image : <Grayscale>{image}</Grayscale>}
    </View>
  );
};

export const getTabIcons = (
  unreadCount: number = 0,
  unreadMessagesCount: number = 0,
  logo: string = "",
  communityId: string | null = null,
  isCommunityGroup: boolean = false
): Record<
  | "Home"
  | "Example"
  | "Connection"
  | "Messages"
  | "Notifications"
  | "BuzzBot"
  | "Groups",
  (focused: boolean) => JSX.Element
> =>
  (() => {
    return {
    Home: (focused: boolean) => (
      <HomeSimpleDoor
        fill={focused ? "#6744FF" : "#6B7280"}
        height={28}
        width={28}
        color="white"
      />
    ),
    Groups: (focused: boolean) => (
      <GroupsTabIcon
        logo={logo}
        focused={focused}
        isCommunityGroup={isCommunityGroup}
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
  } satisfies Record<string, (focused: boolean) => JSX.Element>;
  })();
