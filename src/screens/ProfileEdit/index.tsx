import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from "react-native";
import { NavArrowLeft, User } from "iconoir-react-native";
import { FormInput } from "@/components/atoms/FormInput";

import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { editProfileInputs, GenderOptions } from "@/types/Profile";
import { SelectInputWithSearch } from "@/components/atoms/SelectInputWithSearch";
import { City, Country } from "country-state-city";

import StatusOptions from "@/components/organism/EditProfile/StatusSec";
import { launchImageLibrary } from "react-native-image-picker";
import { useGetUserData } from "@/services/user";
import { getUserProfileStore } from "@/storage/user";

import { useEditProfile } from "@/services/edit-Profile";
import { replaceImage } from "@/services/uploadImage";
import ReusableButton from "@/components/atoms/ReusableButton";

type ImageAsset = {
  uri: string;
  fileName?: string;
  fileSize?: number;
  height?: number;
  width?: number;
  type?: string;
};

export default function ProfileEdit() {
  const {
    handleSubmit,
    reset,
    control,

    formState: { errors, isDirty },
  } = useForm<editProfileInputs>();

  const navigate = useNavigation();
  const userProfileData = getUserProfileStore();
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [userType, setUserType] = useState("student");
  const [previewProfileImage, setPreviewProfileImage] = useState<string | null>(
    null
  );
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [imageToUpload, setImageToUpload] = useState<ImageAsset | null>(null);
  const [user, setUser] = useState<any>(null);
  const { data: userProfile } = useGetUserData(
    userProfileData?.users_id as string
  );
  const { mutate: mutateEditProfile, isPending } = useEditProfile();

  useEffect(() => {
    if (userProfile) {
      const { firstName, lastName, gender, profile, email } = userProfile || {};
      const userDefault = {
        firstName: firstName || "",
        lastName: lastName || "",
        email: email || "",
        gender: gender || "",
        affiliation: profile.affiliation || "",
        bio: profile.bio || "",
        city: profile.city || "",
        country: profile.country || "",
        degree: profile.degree || "test",
        dob: profile.dob || "",
        major: profile.major || "",
        occupation: profile.occupation || "",
        phone_number: profile.phone_number || "",
        study_year: profile.study_year || "",
        profilePicture: null,
      };
      reset(userDefault);
      setUser({ ...userDefault, profile_dp: profile?.profile_dp });
      setPreviewProfileImage(profile?.profile_dp?.imageUrl);
    }
  }, [userProfile, reset]);

  const handleCountryChange = (selectedCountry: string) => {
    const getCountyCode = Country.getAllCountries().find(
      (country) => country.name === selectedCountry
    )?.isoCode;
    if (getCountyCode) {
      setCityOptions(
        City.getCitiesOfCountry(getCountyCode)!.map((state) => state.name)
      );
    }
  };

  const handleImagePick = async () => {
    launchImageLibrary({ mediaType: "photo" }, (response: any) => {
      if (!response.didCancel && !response.errorCode) {
        const imageObject = response.assets[0];
        setImageToUpload(imageObject);
      }
    });
  };

  const onSubmit = async (data: any) => {
    setIsProfileLoading(true);

    let UploadedImageLink;
    let logoImageData;
    if (imageToUpload) {
      UploadedImageLink = await replaceImage(imageToUpload, "");

      logoImageData = {
        imageUrl: UploadedImageLink?.imageUrl,
        publicId: UploadedImageLink?.publicId,
      };
    }
    mutateEditProfile({ ...data, profile_dp: logoImageData });
    setIsProfileLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigate.goBack()}
          style={styles.backButton}
        >
          <NavArrowLeft width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView>
          <View style={styles.content}>
            {/* Profile Photo */}
            <View style={styles.photoSection}>
              <Text style={styles.sectionTitle}>Profile Photo</Text>

              <TouchableOpacity
                onPress={() => handleImagePick()}
                style={styles.photoUpload}
              >
                {imageToUpload ? (
                  <Image
                    source={{ uri: imageToUpload.uri }}
                    className="w-full h-full rounded-full absolute"
                  />
                ) : (
                  previewProfileImage && (
                    <Image
                      source={{ uri: previewProfileImage }}
                      className="w-full h-full rounded-full absolute"
                    />
                  )
                )}
                <User width={32} height={32} color="#9CA3AF" />
                <Text style={styles.photoUploadText}>Select Image</Text>
              </TouchableOpacity>
            </View>

            {/* Basic Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>

              <FormInput
                label="First Name"
                placeholder="Enter First Name"
                required
                name="firstName"
                control={control}
                isError={!!errors.firstName}
                errorMessage={errors.firstName ? "First Name is required" : ""}
              />

              <FormInput
                label="Last Name"
                placeholder="Family Name"
                required={true}
                name="lastName"
                control={control}
                isError={!!errors.lastName}
                errorMessage={errors.lastName?.message}
              />

              <FormInput
                label="Date of Birth"
                placeholder="DD/MM/YYYY"
                required
                name="dob"
                control={control}
                isError={!!errors.dob}
                errorMessage={errors.dob ? "dob  is required" : ""}
              />

              <SelectInputWithSearch
                label="Gender"
                placeholder="Choose Gender"
                options={GenderOptions}
                name="gender"
                control={control}
                search={true}
              />

              <FormInput
                label="Bio"
                placeholder="Short Description of You"
                name="bio"
                control={control}
                isError={!!errors.bio}
                errorMessage={errors.bio ? "bio  is required" : ""}
              />

              <SelectInputWithSearch
                label="Country"
                placeholder="Your country of birth"
                name="country"
                options={Country.getAllCountries().map(
                  (country) => country.name
                )}
                control={control}
                onChange={(selectedCountry: string) =>
                  handleCountryChange(selectedCountry)
                }
                search={true}
              />

              <SelectInputWithSearch
                label="City"
                placeholder="Your city"
                name="city"
                options={cityOptions}
                control={control}
                search={true}
              />
            </View>

            {/* Contact Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>

              <FormInput
                label="Email"
                placeholder="Enter an email you would like to show others"
                name="email"
                control={control}
                keyboardType="email-address"
                isError={!!errors.email}
                errorMessage={errors.bio ? "email  is required" : ""}
              />

              <FormInput
                label="Phone Number"
                placeholder="(000) 000-000"
                name="phone_number"
                control={control}
                isError={!!errors.phone_number}
                errorMessage={
                  errors.phone_number ? "phone number  is required" : ""
                }
                keyboardType="phone-pad"
              />
            </View>

            {/* Status Section */}
            <View style={styles.section}>
              <View style={styles.statusHeader}>
                <Text style={styles.sectionTitle}>
                  What is your status? <Text style={styles.required}>*</Text>
                </Text>
              </View>

              <Text style={styles.statusWarning}>
                You can only change your status once every calendar year. You
                cannot change back after updating your status for 1 year.
              </Text>
              <StatusOptions
                setUserType={setUserType}
                userType={userType}
                control={control}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <ReusableButton
                buttonText="Update Profile"
                variant="primary"
                isLoading={isProfileLoading}
                onPress={handleSubmit(onSubmit)}
              />

              <ReusableButton buttonText="Redo Changes" variant="shade" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
    color: "#1F2937",
  },
  photoUpload: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: "#9685FF",
    alignItems: "center",
    justifyContent: "center",
  },
  photoUploadText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  required: {
    color: "#EF4444",
  },
  statusWarning: {
    fontSize: 14,
    color: "#EF4444",
    marginBottom: 16,
  },
  statusOptions: {
    marginBottom: 16,
  },
  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  actions: {
    marginTop: 16,
    marginBottom: 32,
  },
});
