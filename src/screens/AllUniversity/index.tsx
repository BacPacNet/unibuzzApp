import Title from "@/components/atoms/Title";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { Search } from "iconoir-react-native";
import DiscoverUniversityCard from "@/components/molecules/UniversityCard";
import { useGetFilteredUniversity } from "@/services/universitySearch";

const AllUniversities = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [query, setQuery] = useState<any>();
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    refetch,
  } = useGetFilteredUniversity(5, query);

  const renderItem = ({ item }: any) => <DiscoverUniversityCard data={item} />;

  return (
    <View className="flex-1  bg-white">
      <View className="p-4 flex ">
        <Title>Faculty Setup</Title>
        <View className="flex flex-row gap-2 items-center mt-4">
          {["Region", "Country", "City", "Type"].map((item) => (
            <Text className="border px-3 py-1 rounded-full border-neutral-200 text-black">
              {item}
            </Text>
          ))}
          <Text className="border px-3 py-1 rounded-full border-neutral-200 bg-primary-500 text-white ">
            Reset
          </Text>
        </View>

        <View className=" flex  relative mt-0 ">
          <Search
            style={{ top: "50%", left: 10 }}
            width={20}
            height={20}
            color={"#d4d4d4"}
            className="absolute  z-30"
          />
          <TextInput
            className="py-2 ps-10 pe-3 border-2 border-neutral-200  rounded-full drop-shadow-sm text-neutral-400 outline-none"
            placeholder="Search"
            placeholderTextColor="#9ca3af"
            style={{ marginTop: 0 }}
            onChangeText={(text) => setQuery(JSON.stringify({ Search: text }))}
          />
        </View>
      </View>

      <FlatList
        data={data?.pages?.flatMap((page) => page.Universities) || []}
        keyExtractor={(item, index) => item._id + item?.Universities?.name}
        renderItem={renderItem}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        ListEmptyComponent={
          isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#7367f0" />
            </View>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text>No Result Found</Text>
            </View>
          )
        }
      />
    </View>
  );
};

export default AllUniversities;
