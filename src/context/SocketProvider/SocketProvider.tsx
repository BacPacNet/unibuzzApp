import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Platform } from "react-native";
import {
  useNavigationContainerRef,
  useNavigationState,
} from "@react-navigation/native";
import { getUserStore } from "@/storage/user";
import { useGetUserNotificationTotalCount } from "@/services/notification";
// import { useGetUserData, useGetUserProfileData } from "@/services/user";
// import { useGetNotification, useGetMessageNotification } from "@/services/notification";

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
  //   const { refetch: refetchNotification } = useGetNotification(3, true);
  //   const { refetch: refetchMessageNotification } = useGetMessageNotification(3, true);
  //   const { refetch: refetchUserData } = useGetUserData();
  //   const { refetch: refetchUserProfileData } = useGetUserProfileData();
  const { refetch: unreadNotificationCount } =
    useGetUserNotificationTotalCount();
  const navigationRef = useNavigationContainerRef();
  const routeNames = useNavigationState((state) => state?.routeNames || []);
  const currentRoute = useNavigationState(
    (state) => state?.routeNames?.[state.index] || "",
  );

  const isRouteMessage = currentRoute !== "Messages";

  useEffect(() => {
    if (!userData?.id) return;

    const newSocket = io(
      Platform.OS === "android"
        ? "http://10.0.2.2:8000"
        : "http://localhost:8000",
    );

    newSocket.on("connect", () => {
      console.log("Connected to the server");
      newSocket.emit("setup", userData?.id);
      setSocket(newSocket);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from the server");
      setSocket(null);
      setIsConnected(false);
    });

    // newSocket.on(`notification_${userData.id}`, (notification) => {
    //   if (notification.type === "ASSIGN") {
    //     refetchUserData();
    //     setNotificationType("ASSIGN");
    //   }
    //   if (notification.type === "FOLLOW") {
    //     refetchUserProfileData();
    //     setNotificationType("FOLLOW");
    //   }
    //   refetchNotification();
    // });
    newSocket.on(`notification_${userData.id}`, (notification) => {
      console.log("sockert");

      unreadNotificationCount();
    });

    // newSocket.on(`message_notification_${userData.id}`, () => {
    //   if (isRouteMessage) {
    //     refetchMessageNotification();
    //   }
    // });

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
