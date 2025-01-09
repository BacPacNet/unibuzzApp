import { deleteToken, getToken } from "@/storage/token";
import { removeUserProfileStore, removeUserStore } from "@/storage/user";
import { useNavigation } from "@react-navigation/native";
import { useMemo } from "react";

const useAuth = () => {
  const navigation = useNavigation();
  const isAuthenticated = useMemo(() => !!getToken(), [getToken]);

  const deauthenticate = () => {
    deleteToken();
    removeUserStore();
    removeUserProfileStore();
  };

  return {
    isAuthenticated,
    deauthenticate,
  };
};

export default useAuth;
