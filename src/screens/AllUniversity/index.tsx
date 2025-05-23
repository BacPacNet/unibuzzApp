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
import DiscoverUniversityCard from "@/components/molecules/University/UniversityCard";
import { useGetFilteredUniversity } from "@/services/universitySearch";
import UniversitySearchFilters from "@/components/molecules/University/UniversityFilters";

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
      <UniversitySearchFilters setQuery={setQuery} />
      <FlatList
        data={data?.pages?.flatMap((page) => page.Universities) || []}
        keyExtractor={(item, index) => item._id + item?.index}
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
