import { Toast } from "react-native-toast-notifications";

export const showToast = ({
  message = "Something went wrong",
  type = "success",
  placement = "top",
} = {}) => {
  Toast.hideAll();
  Toast.show(message, {
    type,
    placement: placement as "top" | "bottom" | "center",
  });
};
