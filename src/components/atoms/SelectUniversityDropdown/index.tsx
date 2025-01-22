import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Animated,
  KeyboardAvoidingView,
  Keyboard,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

import { NavArrowDown, NavArrowUp } from "iconoir-react-native";
import { useUniversitySearch } from "@/services/universitySearch";

interface SelectDropdownProps {
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  icon: string;
  search?: boolean;
  err: boolean;
}

const SelectUniversityDropdown: React.FC<SelectDropdownProps> = ({
  onChange,
  value,
  placeholder,
  icon,
  search = false,
  err,
}) => {
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownButtonRef = useRef<TouchableOpacity>(null);
  const [modalPosition, setModalPosition] = useState(0);
  const [modalWidth, setModalWidth] = useState(0);
  const { data: universities, isFetching } = useUniversitySearch(
    searchTerm || " ",
  );

  const toggleDropdown = () => {
    setShow((prev) => !prev);

    if (dropdownButtonRef.current) {
      dropdownButtonRef.current.measure((fx, fy, width, height, px, py) => {
        setModalPosition(py + height + 1);

        setModalWidth(width);
      });
    }
  };

  const closeModal = () => {
    setShow(false);
    Keyboard.dismiss();
  };

  const handleSelect = (optionValue: any) => {
    onChange(optionValue);
    setShow(false);
  };

  return (
    <View className="relative w-full">
      {/* Dropdown Toggle */}
      <TouchableOpacity
        className={`flex flex-row justify-between items-center border rounded-lg p-2 h-14 ${
          err ? "border-red-400" : "border-neutral-300"
        } bg-white`}
        onPress={(e) => toggleDropdown()}
        ref={dropdownButtonRef}
      >
        <Text
          className={`${value ? "text-neutral-900" : "text-neutral-400"} text-xs`}
        >
          {value || placeholder}
        </Text>
        {icon === "single" ? (
          <NavArrowDown width={20} height={20} color={"#d4d4d4"} />
        ) : (
          <View className="flex flex-col items-center">
            <NavArrowUp width={20} height={20} color={"#d4d4d4"} />
            <NavArrowDown width={20} height={20} color={"#d4d4d4"} />
          </View>
        )}
      </TouchableOpacity>

      {/* Dropdown Menu */}
      <Modal
        transparent={true}
        visible={show}
        animationType="fade"
        onRequestClose={() => setShow(!show)}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View className="flex-1 justify-center items-center  ">
            <TouchableWithoutFeedback>
              <View
                className="bg-white shadow-lg border border-neutral-200 rounded-lg max-h-52"
                style={{
                  top: modalPosition,
                  position: "absolute",
                  width: modalWidth,
                }}
              >
                {search && (
                  <TextInput
                    className="p-3 border-b border-neutral-200 text-neutral-700"
                    placeholder="Search..."
                    onChangeText={(text) => setSearchTerm(text)}
                    value={searchTerm}
                  />
                )}
                {isFetching ? (
                  <View className="flex bg-white justify-center items-center p-4">
                    {/* <Spinner /> */}
                    <ActivityIndicator />
                  </View>
                ) : universities?.result?.length > 0 ? (
                  <FlatList
                    data={universities.result}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className="flex bg-white flex-row items-center p-3 border-b border-neutral-200"
                        onPress={() => handleSelect(item)}
                      >
                        <Image
                          className="rounded-full"
                          style={{ width: 40, height: 40 }}
                          source={{ uri: item?.logos?.[0] }}
                        />
                        <Text
                          style={{ maxWidth: 250 }}
                          className="text-xs text-neutral-900 ml-3 "
                        >
                          {item?.name}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <Text className="text-neutral-500 text-center py-4">
                    No results found
                  </Text>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default SelectUniversityDropdown;
