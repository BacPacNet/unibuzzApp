import React, {
  useRef,
  useState,
  ReactElement,
  cloneElement,
  ReactNode,
} from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  LayoutRectangle,
} from "react-native";

interface DropdownWrapperProps {
  children: ReactElement;
  position?: "top" | "bottom" | "left" | "right";
  extraLeft?: number;
  extraBottom?: number;
  viewTopPosition?: number;
  renderDropdown: (closeDropdown: () => void) => ReactNode;
}

const DropdownWrapper = ({
  children,
  renderDropdown,
  position = "bottom",
  extraLeft = 0,
  extraBottom = 0,
  viewTopPosition = 0,
}: DropdownWrapperProps) => {
  const triggerRef = useRef<TouchableOpacity>(null);
  const [show, setShow] = useState(false);
  const [triggerLayout, setTriggerLayout] = useState<LayoutRectangle | null>(
    null,
  );

  const [modalTop, setModalTop] = useState(0);
  const [modalLeft, setModalLeft] = useState(0);
  const [modalWidth, setModalWidth] = useState(0);
  const [modalHeight, setModalHeight] = useState(0);

  const toggleDropdown = () => {
    if (!show && triggerRef.current) {
      triggerRef.current.measure((fx, fy, width, height, px, py) => {
        const GAP = 8;

        let top = py;
        let left = px;

        switch (position) {
          case "top":
            top = py - 150 - GAP;
            break;
          case "bottom":
            top = py + height + GAP + extraBottom;
            break;
          case "left":
            top = py;
            left = px - width - GAP - extraLeft;
            break;
          case "right":
            top = py;
            left = px + width + GAP;
            break;
        }

        setModalTop(top);
        setModalLeft(left);
        setModalWidth(width);
        setShow(true);
      });
    } else {
      setShow(false);
    }
  };

  const closeDropdown = () => {
    setShow(false);
    Keyboard.dismiss();
  };

  return (
    <>
      {cloneElement(children, {
        ref: triggerRef,
        onPress: toggleDropdown,
      })}

      <Modal
        transparent
        visible={show}
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View className="flex-1">
            <TouchableWithoutFeedback>
              <View
                style={{
                  position: "absolute",
                  top: modalTop + viewTopPosition,
                  left: modalLeft,
                  minWidth: 160,
                }}
              >
                {renderDropdown(closeDropdown)}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default DropdownWrapper;
