import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import CommunityLogo from "@/components/atoms/LogoHolder";
import { FONTS } from "@/constants/fonts";

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
      style={styles.card}
    >
      <Image
        source={{ uri: imageSrc }}
        style={{
          width: "100%",
          height: 194,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
        onError={() =>
          setImageSrc(
            "https://cdn.pixabay.com/photo/2017/08/20/12/13/architecture-2661547_1280.jpg",
          )
        }
      />
      <View
        style={styles.bottomContainer}
        className="w-full   rounded-b-2xl relative flex flex-row items-center gap-3"
      >
        <CommunityLogo logoUrl={data?.logo} variant="small" />
        <Text style={styles.name} className=" flex flex-row items-center ">
          {data?.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default DiscoverUniversityCard;

const styles = StyleSheet.create({
  card:{
    marginHorizontal:16,
    marginBottom:16,
    borderWidth:1,
    borderColor:"#E5E7EB",
    backgroundColor:"white",
    borderRadius:16
  },
  bottomContainer: {
    height: 60,
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 12,
    fontWeight: 700,
    color: "#3A3B3C",
    fontFamily: FONTS.poppins.bold,
    marginLeft: 8,
    flexWrap: "wrap",
    width: "90%",
  },
});
