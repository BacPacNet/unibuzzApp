import { useCallback, useEffect, useState } from "react";
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

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { editProfileInputs, GenderOptions } from "@/types/Profile";
import { SelectInputWithSearch } from "@/components/atoms/SelectInputWithSearch";
import { City, Country } from "country-state-city";

import StatusOptions from "@/components/organism/EditProfile/StatusSec";
import { launchImageLibrary } from "react-native-image-picker";
import { useGetUserData } from "@/services/user";
import { getUserProfileStore } from "@/storage/user";

import { useEditProfile } from "@/services/edit-Profile";

import ReusableButton from "@/components/atoms/ReusableButton";
import { DateSelect } from "@/components/atoms/DateSelect";
import { useHeader } from "@/context/HeaderProvider/Header";
import { UPLOAD_CONTEXT } from "@/types/uploads";
import { useUploadToS3 } from "@/services/upload";
import { Toast } from "react-native-toast-notifications";
import SelectUniversityDropdownBottomSheet from "@/components/atoms/SelectUniversityDropDownBottomSheet";
import CommunityLogo from "@/components/atoms/LogoHolder";

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
    control,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<editProfileInputs>({
    defaultValues: {
      firstName: "",
      lastName: "",
      displayEmail: "",
      gender: "",
      affiliation: "",
      bio: "",
      city: "",
      country: "",
      degree: "",
      dob: "",
      major: "",
      occupation: "",
      phone_number: "",
      study_year: "",
      university_name: "",
      universityId: "",
      communityId: "",
      universityLogo: "",
    },
  });

  const navigate = useNavigation();
  const userProfileData = getUserProfileStore();

  const { changeHeaderShownStatus } = useHeader();
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [userType, setUserType] = useState(userProfileData?.role || "student");
  const [previewProfileImage, setPreviewProfileImage] = useState<string | null>(
    null
  );
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [imageToUpload, setImageToUpload] = useState<ImageAsset | null>(null);

  const { data: userProfile } = useGetUserData(
    userProfileData?.users_id as string
  );
  const { mutateAsync: mutateEditProfile, isPending } = useEditProfile();
  const { mutateAsync: uploadToS3 } = useUploadToS3();

  const currCountryWatch = watch("country");
  const currCityWatch = watch("city");
  const currDob = watch("dob");

  useEffect(() => {
    if (userProfile) {
      const { firstName, lastName, gender, profile } = userProfile || {};

      // Set individual form values when userProfile data loads
      setValue("firstName", firstName || "");
      setValue("lastName", lastName || "");
      setValue("displayEmail", profile?.displayEmail || "");
      setValue("gender", gender || "");
      setValue("affiliation", profile?.affiliation || "");
      setValue("bio", profile?.bio || "");
      setValue("city", profile?.city || "");
      setValue("country", profile?.country || "");
      setValue("degree", profile?.degree || "");
      setValue("dob", profile?.dob || "");
      setValue("major", profile?.major || "");
      setValue("occupation", profile?.occupation || "");
      setValue("phone_number", profile?.phone_number || "");
      setValue("study_year", profile?.study_year || "");
      setValue("university_name", profile?.university_name || "");
      setValue("universityId", profile?.university_id || "");
      setValue("communityId", profile?.communityId || "");
      setValue("universityLogo", profile?.universityLogo || "");

      setPreviewProfileImage(profile?.profile_dp?.imageUrl);
    }
  }, [userProfile, setValue]);

  const handleCountryChange = (selectedCountry: string) => {
    const getCountyCode = Country.getAllCountries().find(
      (country) => country.name === selectedCountry
    )?.isoCode;
    if (getCountyCode) {
      setCityOptions(
        City.getCitiesOfCountry(getCountyCode)!.map((state) => state.name)
      );
      setValue("city", "");
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

  useEffect(() => {
    if (currCountryWatch && !currCityWatch) {
      const getCountyCode = Country.getAllCountries().find(
        (country) => country.name === currCountryWatch
      )?.isoCode;
      if (getCountyCode) {
        setCityOptions(
          City.getCitiesOfCountry(getCountyCode)!.map((state) => state.name)
        );
      }
    }
  }, [currCountryWatch && !currCityWatch]);

  const onSubmit = async (data: any) => {
    setIsProfileLoading(true);

    let logoImageData: any;
    let profileImageData = userProfile?.profile?.profile_dp;

    if (imageToUpload) {
      const uploadPayload = {
        files: [imageToUpload],
        context: UPLOAD_CONTEXT.DP,
      };

      logoImageData = await uploadToS3(uploadPayload);

      profileImageData = logoImageData?.data[0];
      setValue("profile_dp", logoImageData as any);
    }

    mutateEditProfile({
      ...data,
      profile_dp: profileImageData,
      role: userType,
    });
    setIsProfileLoading(false);
    navigate.goBack();
  };

  const onError = (errors: any) => {
    const firstError = Object.values(errors)[0];
    if (
      firstError &&
      typeof firstError === "object" &&
      "message" in firstError
    ) {
      Toast.show(firstError.message as string);
    } else {
      Toast.show("Form has errors. Please check.");
    }
  };

  //   useFocusEffect(
  //     useCallback(() => {
  //       changeHeaderShownStatus(false);

  //       return () => {
  //         changeHeaderShownStatus(true);
  //       };
  //     }, [])
  //   );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigate.goBack()}
              style={styles.backButton}
            >
              <NavArrowLeft width={20} height={20} color="#6744FF" />
              <Text style={styles.headerTitle}>Profile</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            {/* Profile Photo */}
            <View style={styles.photoSection}>
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

              <Text className="text-xs text-gray-500 ">
                Max file size: 5 MB
              </Text>
            </View>

            {/* Basic Information */}
            <View style={styles.section}>
              <Text style={styles.required}>Required Fields *</Text>

              <FormInput
                label="First Name"
                placeholder="Enter First Name"
                required
                rules={{ required: "First Name is required!" }}
                name="firstName"
                control={control}
                isError={!!errors.firstName}
                errorMessage={errors.firstName ? "First Name is required" : ""}
              />

              <FormInput
                label="Last Name"
                placeholder="Family Name"
                required
                rules={{ required: "Last Name is required!" }}
                name="lastName"
                control={control}
                isError={!!errors.lastName}
                errorMessage={errors.lastName?.message}
              />

              <DateSelect
                label="Date of Birth"
                placeholder="DD/MM/YYYY"
                name="dob"
                required
                control={control}
                rules={{ required: "Dob is required!" }}
                currDob={currDob || ""}
              />

              {/* <SelectInputWithSearch
                label="Gender"
                placeholder="Choose Gender"
                options={GenderOptions}
                name="gender"
                control={control}
                search={true}
              /> */}

              <FormInput
                label="Bio"
                placeholder="Short Description of You"
                name="bio"
                control={control}
                isError={!!errors.bio}
                errorMessage={errors.bio ? "bio  is required" : ""}
                isTextArea={true}
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
              {/* <Text style={styles.sectionTitle}>Contact Information</Text> */}

              <FormInput
                label="Email"
                placeholder="Enter an email you would like to show others"
                name="displayEmail"
                control={control}
                keyboardType="email-address"
                isError={!!errors.displayEmail}
                errorMessage={
                  errors.displayEmail
                    ? errors.displayEmail.message?.toString()
                    : "email  is required"
                }
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

              <SelectUniversityDropdownBottomSheet
                control={control}
                setValue={setValue as any}
                name="university_name"
                label="University"
                placeholder="Select University Name"
                icon="single"
                search={true}
                rules={{ required: "University is required!" }}
              />

              {watch("university_name") && (
                <View style={styles.universityDisplay}>
                  <CommunityLogo
                    logoUrl={watch("universityLogo") || ""}
                    variant="small"
                  />
                  <Text style={styles.universityName}>
                    {watch("university_name")}
                  </Text>
                </View>
              )}
            </View>

            {/* Status Section */}
            <View style={styles.section}>
              <View style={styles.statusHeader}>
                <Text style={styles.sectionTitle}>
                  What is your status? <Text style={styles.required}>*</Text>
                </Text>
                <Text style={styles.statusWarning}>
                  You can update your status once every 6 months. After making a
                  change, you’ll have 15 days to revert it if needed.
                </Text>
              </View>

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
                onPress={handleSubmit(onSubmit, onError)}
                height="large"
              />
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
    gap: 8,
  },
  backButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",

    color: "#6744FF",
    fontFamily: "poppins",
  },
  content: {
    padding: 16,
    paddingBottom: 0,
  },
  section: {
    marginBottom: 16,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  photoSection: {
    marginBottom: 32,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    // marginBottom: 16,
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
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  required: {
    color: "#EF4444",
    // marginBottom:16,
    fontSize: 12,
  },
  statusWarning: {
    fontSize: 14,
    color: "#EF4444",
    // marginBottom: 16,
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
    // marginTop: 32,
    marginBottom: 32,

    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    paddingTop: 32,
  },
  universityDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  universityName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
});
