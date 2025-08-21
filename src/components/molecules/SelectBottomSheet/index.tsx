import ReusableButton from "@/components/atoms/ReusableButton";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, TextInput, View, Text } from "react-native";
import { FlatList } from "react-native-actions-sheet";

import BouncyCheckbox from "react-native-bouncy-checkbox";
type Props = {
  data: any;
  setSelectedField: (value: any) => void;
  selectedField: any;
};

const RenderItem = ({
  item,
  isSelected,
  handleClick,
}: {
  item: string;
  isSelected: boolean;
  handleClick: any;
}) => {
  let bouncyCheckboxRef: any = null;

  return (
    <View
      style={{
        paddingHorizontal: 12,
      }}
      className="flex flex-row justify-between p-4 border-b border-neutral-200 "
    >
      <View className="flex-1 flex-row items-center gap-4 justify-center">
        <View className=" flex-1 flex-row items-center ">
          <View className=" flex-1 ">
            <Text
              className="text-neutral-600 text-sm 
                             font-semibold"
            >
              {item}
            </Text>
          </View>

          <View className="flex justify-center items-center ">
            <BouncyCheckbox
              ref={bouncyCheckboxRef}
              size={25}
              fillColor="blue"
              unFillColor="#FFFFFF"
              text="Click Me"
              iconStyle={{ borderColor: "blue" }}
              innerIconStyle={{ borderWidth: 2 }}
              isChecked={isSelected}
              useBuiltInState={false}
              onPress={() => {
                handleClick(item);
              }}
              style={{ height: 24 }}
              bounceEffectIn={1}
              bounceEffectOut={1}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const SelectBottomSheet = ({
  data,
  selectedField,
  setSelectedField,
}: Props) => {
  const [searchInput, setSearchInput] = useState("");

  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const filtered = data.filter((item: any) =>
      item.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchInput, data]);

  const handleSelectAll = useCallback(() => {
    setSelectedField(filteredData);
  }, [filteredData]);

  const handleClick = (item: string) => {
    setSelectedField((prevSelected: any) => {
      const newSet = new Set(prevSelected);
      newSet.has(item) ? newSet.delete(item) : newSet.add(item);
      return [...newSet];
    });
  };

  return (
    <View
      style={{
        height: "100%",
        alignItems: "center",
        paddingTop: 20,
        gap: 10,
        width: "100%",
      }}
    >
      <View className="w-full p-3">
        <TextInput
          style={{ paddingStart: 8 }}
          onChangeText={(text) => setSearchInput(text)}
          className="border border-neutral-200 w-full text-neutral-500  rounded-lg h-14 p-0"
          placeholderTextColor="#9CA3AF"
          placeholder="Search User..."
        />
      </View>
      <View
        style={{
          paddingHorizontal: 12,
        }}
        className="flex flex-row  justify-start w-full"
      >
        <ReusableButton
          onPress={() => handleSelectAll()}
          buttonText="Select ALL"
          containerStyle="px-4 w-40"
        />
      </View>

      <FlatList
        data={filteredData}
        style={{
          width: "100%",
          height: "100%",
        }}
        keyExtractor={(item, index) => item}
        renderItem={({ item }) => (
          <RenderItem
            item={item}
            isSelected={selectedField.includes(item)}
            handleClick={handleClick}
          />
        )}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={2}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text className="text-neutral-500">No Result Found</Text>
          </View>
        }
      />
    </View>
  );
};

export default SelectBottomSheet;
