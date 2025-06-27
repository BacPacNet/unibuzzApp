import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FormInput } from "@/components/atoms/FormInput";
import RadioInput from "@/components/atoms/RadioInput";
import TextAreaWithWordCount from "@/components/atoms/TextAreaWIthWordCount";
import SelectedChip from "@/components/molecules/CreateNewGroup/SelectedChip";
import {
  GROUP_ACCESS_OPTIONS,
  GROUP_TYPE_OPTIONS,
} from "../../../../screens/NewCommunityGroupScreen/constants";

interface FormFieldsProps {
  control: any;
  errors: any;
  createSelectedFilters: any;
  setCreateSelectedFilters: (filters: any) => void;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  control,
  errors,
  createSelectedFilters,
  setCreateSelectedFilters,
}) => (
  <>
    <View style={styles.section}>
      <Text style={styles.required}>Required Fields *</Text>
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
        <Text style={styles.inputLabels}>Group Type</Text>
        <Text style={styles.required}>*</Text>
      </View>
      <RadioInput
        name="communityGroupType"
        control={control}
        options={GROUP_TYPE_OPTIONS}
        required
      />
    </View>

    <View style={styles.section}>
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
    </View>
  </>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 12,
  },
  inputLabels: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  required: {
    color: "#EF4444",
    marginBottom: 16,
    fontSize: 12,
  },
  flexRowContainer: {
    flexDirection: "row",
    alignContent: "center",
    gap: 2,
  },
});
