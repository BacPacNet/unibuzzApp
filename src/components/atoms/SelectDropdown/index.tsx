import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
// import { AnimatePresence, MotiView } from 'react-native-reanimated';

import { NavArrowDown, NavArrowUp, Xmark } from "iconoir-react-native";
// import { FiUserCheck, FiUser } from 'react-icons/fi';
// import { RxCross2 } from 'react-icons/rx';
// import { MdOutlinePublic } from 'react-icons/md';

// const icons = [MdOutlinePublic, FiUserCheck, FiUser];

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

  const toggleDropdown = () => {
    if (!show) {
      setFilteredOptions(options);
      if (searchRef.current) searchRef.current.clear();
    }
    setShow((prevShow) => !prevShow);
  };

  return (
    <View className="relative">
      {/* Dropdown Trigger */}
      <TouchableOpacity
        onPress={toggleDropdown}
        className={`flex flex-row justify-between items-center border rounded-lg p-2 h-14 ${
          err ? "border-red-400" : "border-neutral-300"
        } bg-white`}
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

      {/* Dropdown Options */}
      {/* <AnimatePresence> */}
      {show && (
        <View
          style={{ top: 48 }}
          className="absolute  bg-white shadow-lg border border-neutral-200 rounded-lg z-10 max-h-52 w-full overflow-hidden"
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
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              // const IconComponent = icons[index % icons.length];
              return (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  className="bg-white flex flex-row gap-2 items-center p-3 border-b border-neutral-300 last:border-b-0 "
                >
                  {/* {showIcon && <IconComponent size={16} className="text-neutral-900" />} */}
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
      )}
      {/* </AnimatePresence> */}
    </View>
  );
};

export default SelectDropdown;
