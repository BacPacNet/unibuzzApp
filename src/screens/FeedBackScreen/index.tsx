import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/atoms/FormInput";
import ReusableButton from "@/components/atoms/ReusableButton";
import { useSendContactMessage } from "@/services/contact";

const ContactForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      university: "",
      message: "",
      email: "",
    },
  });
  const { mutate, isPending, isSuccess } = useSendContactMessage();
  const onSubmit = (data: any) => {
    mutate(data);
    reset();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Send us a message</Text>
      <Text style={styles.subtitle}>
        Contact us regarding any concerns or inquiries.
      </Text>

      <View style={styles.formContainer}>
        <View style={styles.nameContainer}>
          <View style={styles.nameInputContainer}>
            <FormInput
              isLabelShown={true}
              label="First Name"
              placeholder="John"
              name="firstName"
              control={control}
              rules={{ required: "First name is required" }}
              isError={!!errors.firstName}
              errorMessage={errors.firstName?.message?.toString()}
            />
          </View>

          <View style={styles.nameInputContainer}>
            <FormInput
              isLabelShown={true}
              label="Last Name"
              placeholder="Dowry"
              name="lastName"
              control={control}
              rules={{ required: "Last name is required" }}
              isError={!!errors.lastName}
              errorMessage={errors.lastName?.message?.toString()}
            />
          </View>
        </View>

        <FormInput
          isLabelShown={true}
          label="University"
          placeholder="Lorem University"
          name="university"
          control={control}
          rules={{ required: "University is required" }}
          isError={!!errors.university}
          errorMessage={errors.university?.message?.toString()}
        />

        <FormInput
          isLabelShown={true}
          label="Email Address"
          placeholder="john.dowry@example.com"
          name="email"
          control={control}
          keyboardType="email-address"
          rules={{
            required: "Please enter your email!",
            pattern: {
              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Invalid email format",
            },
          }}
          isError={!!errors.email}
          errorMessage={errors.email?.message?.toString()}
        />

        <FormInput
          label="Additional Message"
          placeholder="Type a message here..."
          name="message"
          control={control}
          isError={!!errors.message}
          errorMessage={errors.message ? "bio  is required" : ""}
          isTextArea={true}
        />
      </View>

      <Text style={styles.disclaimer}>
        By pressing the submit button, I agree to Unibuzz contacting me by email
        and/or phone to share opportunities exclusively available to Select or
        Enterprise customers. I also understand that any information I've shared
        in this form is subject to Unibuzz Privacy Policy.
      </Text>

      <ReusableButton
        onPress={handleSubmit(onSubmit)}
        buttonText="Submit"
        variant="primary"
        isLoading={isPending}
        disabled={isPending}
        height="large"
      />
    </ScrollView>
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
});

export default ContactForm;
