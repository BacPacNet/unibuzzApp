import ProfileInfo from "@/components/molecules/Profile/UserInformation";
import ProfileCard from "@/components/molecules/RightSIdeBar/ProfileCard";
import { EditPencil } from "iconoir-react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import universityPlaceHolder from "@/assets/unibuzz-orange.png";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";

interface UserProfileCardProps {
  firstName: string;
  lastName: string;

  description: string;
  university: string;
  isVerified: boolean;
  following: number;
  followers: number;
  study_year: string;
  major: string;
  email: string;
  phone: string;
  location: string;
  dob: string;
  avatarUrl: string;

  degree: string;
  country: string;
  isSelfProfile?: boolean;
  userId?: string;
  universityLogo: string;
  occupation: string;
  affiliation: string;
  imageUrl: string;
  university_name: string;
  university_Logo: string;
  city: string;
}
type NavigationProp = StackNavigationProp<RootStackParamList, "Timeline">;

//    <FlatListProfileHeaderPart
//             imageUrl={profile?.profile_dp?.imageUrl || ""}
//             university_Logo={logos?.[0]}
//             university_name={university_name}
//             degree={degree || ""}
//             major={major || ""}
//             affiliation={affiliation || ""}
//             occupation={occupation || ""}
//             email={email || ""}
//             phone={phone_number || ""}
//             location={city}
//             country={country || ""}
//             city={city}
//             firstName={firstName}
//             lastName={lastName}
//             description={bio || ""}
//             university={university_name || "Lorem University"}
//             isVerified={true}
//             following={following?.length || 0}
//             followers={followers?.length || 0}
//             study_year={study_year || ""}
//             dob={dob || ""}
//             avatarUrl={profile?.profile_dp?.imageUrl || ""}
//             isSelfProfile={true}
//             userId={userId}
//             universityLogo={logos?.[0] || ""}
//           />
const FlatListProfileHeaderPart = ({
  firstName,
  lastName,
  affiliation,
  university_name,
  university_Logo,
  dob,
  country,
  city,
  degree,
  occupation,
  email,
  followers,
  following,
  imageUrl,
  major,
  study_year,
  phone,
}: UserProfileCardProps) => {
  const { navigate } = useNavigation<NavigationProp>();
  return (
    <View className="bg-white flex-1">
      <View className="flex flex-row justify-between ">
        <ProfileCard
          name={firstName + " " + lastName}
          avatarUrl={imageUrl || ""}
          university={university_name || ""}
          year={study_year || ""}
          degree={degree || ""}
        />
        <TouchableOpacity
          onPress={() => navigate("ProfileEdit")}
          style={styles.editButton}
        >
          <Text className="text-[#6744FF]">Edit</Text>
          <EditPencil width={22} height={22} color="#6744FF" />
        </TouchableOpacity>
      </View>
      <View className="p-4 text-neutral-700 flex gap-4">
        <Text className="text-neutral-700">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
        <View className="flex flex-row items-center gap-2">
          <Image
            source={
              university_Logo ? { uri: university_Logo } : universityPlaceHolder
            }
            style={styles.UniversityLogoPic}
          />
          <Text className="text-neutral-700">{university_name}</Text>
        </View>
        <View className="flex flex-row gap-4">
          <TouchableOpacity>
            <Text className="text-primary-500 font-bold">4 Mutuals</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-primary-500 font-bold">
              {following || 0} Following
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-primary-500 font-bold">
              {followers || 0} Followers
            </Text>
          </TouchableOpacity>
        </View>

        <ProfileInfo
          year={study_year || ""}
          degree={degree || ""}
          major={major || ""}
          affiliation={affiliation || ""}
          occupation={occupation || ""}
          email={email || ""}
          phone={phone || ""}
          location={city}
          birthday={dob || ""}
          country={country || ""}
        />
      </View>
    </View>
  );
};

export default FlatListProfileHeaderPart;

const styles = StyleSheet.create({
  editButton: {
    paddingHorizontal: 10,
    margin: 10,
    borderColor: "#6744FF",
    borderWidth: 1,
    borderRadius: 8,
    width: 70,
    height: 30,
    display: "flex",
    flexDirection: "row",
    gap: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  UniversityLogoPic: {
    width: 30,
    height: 30,
    borderRadius: 30,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    display: "flex",
    gap: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
});
