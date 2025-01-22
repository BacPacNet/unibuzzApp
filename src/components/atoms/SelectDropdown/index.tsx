import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import { NavArrowDown, NavArrowUp, Xmark } from "iconoir-react-native";

interface SelectDropdownProps {
  options: string[];
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  icon: string;
  search?: boolean;
  err: boolean;
  showIcon?: boolean;
  isAllowedToRemove?: boolean;
}

const SelectDropdown = ({
  options,
  onChange,
  value,
  isAllowedToRemove = true,
  placeholder,
  icon,
  search = false,
  err,
  showIcon = false,
}: SelectDropdownProps) => {
  const [show, setShow] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const searchRef = useRef<TextInput>(null);
  const dropdownButtonRef = useRef<TouchableOpacity>(null);
  const [modalPosition, setModalPosition] = useState(0);
  const [modalWidth, setModalWidth] = useState(0);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setShow(false);
  };

  const handleSearch = (searchValue: string) => {
    setFilteredOptions(
      searchValue === ""
        ? options
        : options.filter((option: string) =>
            option.toLowerCase().includes(searchValue.toLowerCase()),
          ),
    );
  };

  const toggleDropdown = (event: any) => {
    if (!show) {
      setFilteredOptions(options);
      if (searchRef.current) searchRef.current.clear();
    }
    setShow((prevShow) => !prevShow);

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

  return (
    <View className="relative">
      <TouchableOpacity
        onPress={(e) => toggleDropdown(e)}
        className={`flex flex-row justify-between items-center border rounded-lg p-2 h-14 ${
          err ? "border-red-400" : "border-neutral-300"
        } bg-white`}
        ref={dropdownButtonRef}
      >
        <Text
          className={`text-xs ${value ? "text-neutral-900" : "text-neutral-400 "} `}
        >
          {value || placeholder}
        </Text>
        <View>
          {value && isAllowedToRemove ? (
            <Xmark
              width={20}
              height={20}
              color={"#d4d4d4"}
              onPress={(e: any) => {
                e.stopPropagation();
                onChange("");
              }}
            />
          ) : icon === "single" ? (
            <NavArrowDown width={20} height={20} color={"#d4d4d4"} />
          ) : (
            <View>
              <NavArrowUp width={20} height={20} color={"#d4d4d4"} />
              <NavArrowDown width={20} height={20} color={"#d4d4d4"} />
            </View>
          )}
        </View>
      </TouchableOpacity>

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
                    ref={searchRef}
                    placeholder="Search..."
                    onChangeText={handleSearch}
                    className="p-3 border-b border-neutral-200 text-neutral-700"
                  />
                )}
                <FlatList
                  data={filteredOptions}
                  nestedScrollEnabled={true}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => handleSelect(item)}
                        className="bg-white flex flex-row gap-2 items-center p-3 border-b border-neutral-300 last:border-b-0 "
                      >
                        <Text className="text-neutral-900 text-2xs bg-white">
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  ListEmptyComponent={
                    <Text className="text-neutral-500 p-2 text-center">
                      No results found
                    </Text>
                  }
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default SelectDropdown;
