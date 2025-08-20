import SelectUniversityDropdownBottomSheet from "@/components/atoms/SelectUniversityDropDownBottomSheet";
import { FormInput } from "@/components/atoms/FormInput";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import BackHeader from "@/components/atoms/BackHeader";
import ReusableButton from "@/components/atoms/ReusableButton";
import CommunityLogo from "@/components/atoms/LogoHolder";
import { useHandleUniversityEmailVerificationGenerate } from "@/services/auth";
import { useWatch } from "react-hook-form";

interface Props {
  control: any;
  setValue: any;
  goBack: () => void;
  handleSubmit: any;
  onValidSubmit: (data: any) => void;
  errors: any;
  logoUrl: string;
  universityName: string;
}

const UniversitySelect = ({
  control,
  setValue,
  goBack,
  handleSubmit,
  onValidSubmit,
  errors,
  logoUrl,
  universityName,
}: Props) => {
  const email = useWatch({ control, name: "email" });

  const {
    mutateAsync: generateUniversityEmailOTP,
    isPending: isResendPending,
    isError,
  } = useHandleUniversityEmailVerificationGenerate();

  const handleUniversityEmailSendCode = async () => {
    try {
      const data = { email: email };
      await generateUniversityEmailOTP(data);
      handleSubmit(onValidSubmit)();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <BackHeader label="University Verification" onPress={goBack} />
      <View style={styles.paddingContainer}>
        <SelectUniversityDropdownBottomSheet
          placeholder="Select University Name"
          icon="single"
          search={true}
          control={control}
          name="universityName"
          rules={{ required: "University is required!" }}
          setValue={setValue}
          label="University"
        />

        <FormInput
          label="University Email"
          placeholder="Enter your email"
          control={control}
          name="email"
          keyboardType="email-address"
          rules={{
            required: "Email is required!",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          isError={!!errors.email?.message}
          errorMessage={errors.email?.message}
        />
        {logoUrl && universityName && (
          <View className="w-full flex flex-row items-center justify-start gap-2">
            <CommunityLogo logoUrl={logoUrl} variant="small" />
            <Text className="text-sm text-gray-500">{universityName}</Text>
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <ReusableButton
          onPress={() => handleUniversityEmailSendCode()}
          buttonText="Verify"
          variant="primary"
          height="large"
          isLoading={isResendPending && !isError}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  paddingContainer: {
    padding: 16,

    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3A3B3C",
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 64,
    paddingBottom: "8%",
    paddingHorizontal: 16,
  },
});

export default UniversitySelect;
