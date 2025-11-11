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
  fieldRefs?: any;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  control,
  errors,
  createSelectedFilters,
  setCreateSelectedFilters,
  isPending,
  groupType,
  isNewGroup = false,
  fieldRefs,
}) => (
  <>
    <View style={styles.section}>
      <Text style={styles.requiredTop}>Required Fields *</Text>
      <FormInput
        ref={fieldRefs?.title}
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
        ref={fieldRefs?.description}
        control={control}
        name="description"
        maxChars={160}
        required
      />
      {/* {errors.description && (
        <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
          {errors.description.message}
        </Text>
      )} */}
    </View>

    <View style={styles.section}>
      <View style={styles.flexRowContainer}>
        <Text style={styles.inputLabels}>Group Access</Text>
        <Text style={styles.required}>*</Text>
      </View>
      <RadioInput
        ref={fieldRefs?.communityGroupAccess}
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
        ref={fieldRefs?.communityGroupLabel}
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
          Your request for creating an Official Group is pending. Your group
          will be deleted if it is rejected.
        </Text>
      )}

      {isNewGroup && (
        <RadioInput
          ref={fieldRefs?.communityGroupType}
          name="communityGroupType"
          control={control}
          options={GROUP_TYPE_OPTIONS}
          required
        />
      )}
      {isNewGroup ? null : isPending ? (
        <View style={styles.container}>
          <Text style={styles.title}>Official</Text>
          <Text style={styles.subtitle}>Require university approval</Text>
        </View>
      ) : groupType === "casual" ? (
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
