import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import Tabs from "@/components/molecules/Tabs";
import ConnectionMutualUserTabList from "@/components/organism/Connection/ConnectionMutualUserTabList";
import ConnectionFollowersUserTabList from "@/components/organism/Connection/ConnectionFollowersUserTabList";
import ConnectionAllUserTabList from "@/components/organism/Connection/ConnectionAllUserTabList";
import ConnectionFollowingUserTabList from "@/components/organism/Connection/ConnectionFollowingUserTabList";

const Connections = () => {
  const paramValues: any = useRoute().params;
  const incomingValues = paramValues?.values ?? paramValues?.params?.values;
  const [filterParams, setFilterParams] = useState(incomingValues);

  useEffect(() => {
    setFilterParams(paramValues?.values ?? paramValues?.params?.values ?? null);
  }, [paramValues?.values, paramValues?.params?.values]);

  const dummyTabs = [
    {
      label: "All",

      content: (
        <ConnectionAllUserTabList
          values={filterParams}
          resetParams={() => setFilterParams(null)}
        />
      ),
    },
    {
      label: "Mutuals",
      content: <ConnectionMutualUserTabList />,
    },
    {
      label: "Following",
      content: <ConnectionFollowingUserTabList />,
    },
    {
      label: "Followers",
      content: <ConnectionFollowersUserTabList />,
    },
  ];
  return (
    <View className="flex-1 bg-white ">
      <Tabs tabs={dummyTabs} onChange={() => {}} />
    </View>
  );
};

export default Connections;
