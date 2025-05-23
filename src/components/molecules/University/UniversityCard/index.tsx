import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import CommunityLogo from "@/components/atoms/LogoHolder";

type Props = {
  data: {
    images: string[];
    logos: string[];
    name: string;
    pathUrl: string;
    logo: string;
    campus: string;
  };
};

type NavigationProp = StackNavigationProp<RootStackParamList, "Discover">;

const DiscoverUniversityCard = ({ data }: Props) => {
  const [imageSrc, setImageSrc] = useState(
    data?.campus ||
      "https://cdn.pixabay.com/photo/2017/08/20/12/13/architecture-2661547_1280.jpg",
  );

  const { navigate } = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigate("University", { data });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{ backgroundColor: "#FAFAFA", borderRadius: 10 }}
      className="flex relative  shadow-md  m-4 "
    >
      <Image
        source={{ uri: imageSrc }}
        style={{
          width: "100%",
          height: 200,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
        onError={() =>
          setImageSrc(
            "https://cdn.pixabay.com/photo/2017/08/20/12/13/architecture-2661547_1280.jpg",
          )
        }
      />
      <View className="w-full p-4  rounded-b-2xl relative flex flex-row items-center gap-2">
        <CommunityLogo logoUrl={data?.logo} />
        <Text className=" flex flex-row items-center">{data?.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DiscoverUniversityCard;
