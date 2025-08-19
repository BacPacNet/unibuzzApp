import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacityBase,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/atoms/FormInput";
import ReusableButton from "@/components/atoms/ReusableButton";
import { launchImageLibrary } from "react-native-image-picker";
import { ImageAsset } from "@/hooks/useImageUpload";
import { useCreateReportBug } from "@/services/reportBug";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeScreen } from "@/components/template";
const BugReportScreen = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [imageToUpload, setImageToUpload] = useState<ImageAsset | null>(null);
  const { mutateAsync: mutateReportBug, isPending } = useCreateReportBug();

  const handleImagePick = async () => {
    launchImageLibrary({ mediaType: "photo" }, (response: any) => {
      if (!response.didCancel && !response.errorCode) {
        const imageObject = response.assets[0];
        setImageToUpload(imageObject);
      }
    });
  };

  const onSubmit = (data: any) => {
    mutateReportBug(data);
    reset();
    setImageToUpload(null);
  };

  return (
    <SafeScreen>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraScrollHeight={20}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          <Text style={styles.title}>Report a Bug</Text>
          <Text style={styles.subtitle}>
            Help us improve by reporting any bugs you encounter.
          </Text>

          <View style={styles.formContainer}>
            <FormInput
              label="Description of the Bug *"
              placeholder="Type a message here..."
              name="description"
              control={control}
              isError={!!errors.description}
              errorMessage={
                errors.description ? "description  is required" : ""
              }
              isTextArea={true}
              rules={{
                required: {
                  value: true,
                  message: "description is required",
                },
              }}
            />
            <FormInput
              label="Steps to Reproduce (optional)"
              placeholder="Type a message here..."
              name="steps"
              control={control}
              isError={!!errors.steps}
              errorMessage={
                errors.steps ? "steps To Reproduce  is required" : ""
              }
              isTextArea={true}
            />

            <View style={styles.Attactcontainer}>
              <Text style={styles.label}>Attach a Screenshot (optional)</Text>
              <TouchableOpacity onPress={handleImagePick} style={styles.button}>
                <Text style={styles.buttonText}>Choose File</Text>
              </TouchableOpacity>
              {imageToUpload && (
                <Image
                  source={{ uri: imageToUpload?.uri }}
                  style={styles.image}
                />
              )}
            </View>

            <FormInput
              isLabelShown={true}
              label="Your Email (optional)"
              placeholder="john.dowry@example.com"
              name="email"
              control={control}
              keyboardType="email-address"
              isError={!!errors.email}
              errorMessage={errors.email?.message?.toString()}
            />
          </View>

          <Text style={styles.disclaimer}>
            By submitting this form, you agree to allow UniBuzz to contact you
            regarding this bug report. Please refer to our Privacy Policy for
            details.
          </Text>

          <ReusableButton
            onPress={handleSubmit(onSubmit)}
            buttonText="Submit"
            variant="primary"
            height="large"
          />
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#3A3B3C",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 48,
    color: "#6B7280",
  },
  formContainer: {
    gap: 32,
  },
  nameContainer: {
    flexDirection: "row",
    gap: 10,
  },
  nameInputContainer: {
    width: "50%",
  },
  disclaimer: {
    fontSize: 12,
    color: "#6B7280",
    marginVertical: 32,
  },
  submitButton: {
    marginTop: 32,
  },

  Attactcontainer: {},
  label: { fontSize: 14, fontWeight: "500", color: "#3A3B3C", marginBottom: 8 },
  button: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    height: 40,
  },
  buttonText: { fontSize: 16 },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 4,
    objectFit: "contain",
  },
});

export default BugReportScreen;
