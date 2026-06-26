import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import CommunityLogo from "@/components/atoms/LogoHolder";
import { FONTS } from "@/constants/fonts";
import Building from "@/assets/discover/partnerdUni.svg";

const DEFAULT_CAMPUS_IMAGE =
  "https://cdn.pixabay.com/photo/2017/08/20/12/13/architecture-2661547_1280.jpg";

const PRIMARY_COLOR = "#6744FF";

type Props = {
  data: {
    images: string[];
    logos: string[];
    name: string;
    pathUrl: string;
    logo: string;
    campus: string;
  };
  isPartnerUniversity?: boolean;
};

type NavigationProp = StackNavigationProp<RootStackParamList, "Discover">;

const DiscoverUniversityCard = ({
  data,
  isPartnerUniversity = false,
}: Props) => {
  const [imageSrc, setImageSrc] = useState(
    data?.campus || DEFAULT_CAMPUS_IMAGE,
  );

  const { navigate } = useNavigation<NavigationProp>();

  useEffect(() => {
    setImageSrc(data?.campus || DEFAULT_CAMPUS_IMAGE);
  }, [data?.campus]);

  const handlePress = () => {
    navigate("University", { data });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.card, isPartnerUniversity && styles.partnerCard]}
      activeOpacity={0.9}
    >
      {isPartnerUniversity && (
        <View style={styles.partnerBanner} pointerEvents="none">
          <Building width={14} height={18} color="#fff" />
          <Text style={styles.partnerBannerText}>Partner University</Text>
        </View>
      )}
      <Image
        source={{ uri: imageSrc }}
        style={styles.campusImage}
        onError={() => setImageSrc(DEFAULT_CAMPUS_IMAGE)}
      />
      <View
        style={[
          styles.bottomContainer,
          isPartnerUniversity && styles.partnerBottomContainer,
        ]}
      >
        <CommunityLogo logoUrl={data?.logo} variant="small" />
        <Text style={styles.name}>{data?.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DiscoverUniversityCard;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  partnerCard: {
    borderWidth: 3,
    borderColor: PRIMARY_COLOR,
  },
  partnerBanner: {
    height: 46,
    backgroundColor: PRIMARY_COLOR,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 21,
  },
  partnerBannerText: {
    color: "#fff",
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 10,
    fontWeight: "600",
  },
 
  campusImage: {
    width: "100%",
    height: 240,
    backgroundColor: "#E5E7EB",
  },
  bottomContainer: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  partnerBottomContainer: {
    height: 60,
    backgroundColor: "#E5E7EB",
  },
  name: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3A3B3C",
    fontFamily: FONTS.poppins.bold,
    flex: 1,
    flexWrap: "wrap",
  },
});
