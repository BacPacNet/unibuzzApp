import { deleteToken } from "@/storage/token";
import { removeUserProfileStore, removeUserStore } from "@/storage/user";
import { triggerAuthStateChange } from "@/context/AuthProvider/AuthProvider";

export const forceDeauthenticate = () => {
  deleteToken();
  removeUserStore();
  removeUserProfileStore();

  triggerAuthStateChange();
};
