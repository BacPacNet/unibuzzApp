import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Platform } from "react-native";
import {
  useNavigationContainerRef,
  useNavigationState,
} from "@react-navigation/native";
import { getUserStore } from "@/storage/user";
import {
  useGetUserNotificationTotalCount,
  useGetUserUnreadMessagesTotalCount,
  useGetUserNotification,
} from "@/services/notification";
import { NEXT_PUBLIC_SOCKET_URL, NEXT_PUBLIC_SOCKET_URL_IOS } from "@env";
import { SocketConnectionEnums } from "@/types/SocketType";
import { useQueryClient } from "@tanstack/react-query";
import { notificationRoleAccess } from "@/constant/notification";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  notificationType: string;
  setNotificationType: (type: string) => void;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  notificationType: "",
  setNotificationType: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notificationType, setNotificationType] = useState("");

  const userData = getUserStore();
  const queryClient = useQueryClient();
  const { refetch: unreadNotificationCount } =
    useGetUserNotificationTotalCount();
  const { refetch: userUnreadMessagesCount } =
    useGetUserUnreadMessagesTotalCount();
  const { refetch: refetchUserNotification } = useGetUserNotification(10, true);

  const navigationRef = useNavigationContainerRef();
  const routeNames = useNavigationState((state) => state?.routeNames || []);
  const currentRoute = useNavigationState(
    (state) => state?.routeNames?.[state.index] || ""
  );

  const isRouteMessage = currentRoute !== "Messages";

  const refetchCommunityGroup = () => {
    queryClient.invalidateQueries({
      queryKey: ["communityGroup"],
    });
  };

  useEffect(() => {
    if (!userData?.id) return;

    const newSocket = io(
      Platform.OS === "android"
        ? NEXT_PUBLIC_SOCKET_URL
        : NEXT_PUBLIC_SOCKET_URL_IOS
    );

    newSocket.on("connect", () => {
      console.log("Connected to the server");
      newSocket.emit(SocketConnectionEnums.SETUP, userData?.id);
      setSocket(newSocket);
      setIsConnected(true);
    });

    newSocket.on(SocketConnectionEnums.DISCONNECT, () => {
      console.log("Disconnected from the server");
      setSocket(null);
      setIsConnected(false);
    });

    newSocket.on(`notification_${userData.id}`, (notification) => {
      if (notification.type === notificationRoleAccess.REFETCHNOTIFICATIONS) {
        refetchUserNotification();
        refetchCommunityGroup();
      } else {
        unreadNotificationCount();
      }
    });

    newSocket.on(`message_notification_${userData.id}`, () => {
      if (isRouteMessage) {
        userUnreadMessagesCount();
      }
    });

    setSocket(newSocket);
    setIsConnected(true);

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [userData?.id, currentRoute]);

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, notificationType, setNotificationType }}
    >
      {children}
    </SocketContext.Provider>
  );
};
