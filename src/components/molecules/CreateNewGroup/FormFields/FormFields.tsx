import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FormInput } from "@/components/atoms/FormInput";
import RadioInput from "@/components/atoms/RadioInput";
import TextAreaWithWordCount from "@/components/atoms/TextAreaWIthWordCount";
import SelectedChip from "@/components/molecules/CreateNewGroup/SelectedChip";
import {
  GROUP_ACCESS_OPTIONS,
  GROUP_LABEL_OPTIONS,
  GROUP_TYPE_OPTIONS,
} from "../../../../screens/NewCommunityGroupScreen/constants";
import { WarningCircleSolid } from "iconoir-react-native";
import { FONTS } from "@/constants/fonts";

interface FormFieldsProps {
  control: any;
  errors: any;
  createSelectedFilters: any;
  setCreateSelectedFilters: (filters: any) => void;
  isPending?: boolean;
  groupType?: string;
  isNewGroup?: boolean;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  control,
  errors,
  createSelectedFilters,
  setCreateSelectedFilters,
  isPending,
  groupType,
  isNewGroup = false,
}) => (
  <>
    <View style={styles.section}>
      <Text style={styles.requiredTop}>Required Fields *</Text>
      <FormInput
        placeholder="Enter Group Name"
        required
        name="title"
        control={control}
        rules={{
          required: "This field is required",
        }}
        label="Group Name"
        isError={!!errors.title}
        errorMessage={errors.title?.message}
      />
    </View>

    <View style={styles.section}>
      <View style={styles.flexRowContainer}>
        <Text style={styles.inputLabels}>Group Description</Text>
        <Text style={styles.required}>*</Text>
      </View>
      <TextAreaWithWordCount
        control={control}
        name="description"
        maxChars={160}
      />
    </View>

    <View style={styles.section}>
      <View style={styles.flexRowContainer}>
        <Text style={styles.inputLabels}>Group Access</Text>
        <Text style={styles.required}>*</Text>
      </View>
      <RadioInput
        name="communityGroupAccess"
        control={control}
        options={GROUP_ACCESS_OPTIONS}
        required
      />
    </View>
    <View style={styles.section}>
      <View style={styles.flexRowContainer}>
        <Text style={styles.inputLabels}>Group Label</Text>
        <Text style={styles.required}>*</Text>
      </View>
      <RadioInput
        name="communityGroupLabel"
        control={control}
        options={GROUP_LABEL_OPTIONS}
        required
      />
    </View>

    <View style={styles.section}>
      <View style={styles.flexRowContainer}>
        <Text style={styles.inputLabels}>Group Type</Text>
        <Text style={styles.required}>*</Text>
        {isPending && (
          <WarningCircleSolid width={20} height={20} color="#F59E0B" />
        )}
      </View>
      {isPending && (
        <Text style={styles.warningText}>
          Your Official Group request is pending. Your Casual Group will convert
          after university admin accepts the request.
        </Text>
      )}

      {isNewGroup && (
        <RadioInput
          name="communityGroupType"
          control={control}
          options={GROUP_TYPE_OPTIONS}
          required
        />
      )}
      {isNewGroup ? null : groupType === "casual" ? (
        <View style={styles.container}>
          <Text style={styles.title}>Casual</Text>
          <Text style={styles.subtitle}>No approval required</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Official</Text>
          <Text style={styles.subtitle}>Require university approval</Text>
        </View>
      )}
    </View>

    {/* <View style={styles.section}>
      <View style={styles.flexRowContainer}>
        <Text style={styles.inputLabels}>Group Category</Text>
        <Text style={styles.required}>*</Text>
      </View>
      {Object.values(createSelectedFilters).flat()?.length ? (
        <SelectedChip
          selectedItem={[
            `${Object.values(createSelectedFilters).flat()?.length} Categories Selected`,
          ]}
          onRemove={() => setCreateSelectedFilters([])}
        />
      ) : null}
    </View> */}
  </>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  requiredTop: {
    color: "#EF4444",
    marginBottom: 16,
    fontSize: 12,
  },
  inputLabels: {
    fontSize: 14,
    fontFamily: FONTS.inter.medium,
    color: "#171717",
  },
  required: {
    color: "#EF4444",
    marginBottom: 0,
    fontSize: 12,
  },
  warningText: {
    fontSize: 12,
    color: "#D97706",
  },
  flexRowContainer: {
    flexDirection: "row",
    alignContent: "center",
    gap: 2,
  },
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: "#18191A",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#9CA3AF",
  },
});
