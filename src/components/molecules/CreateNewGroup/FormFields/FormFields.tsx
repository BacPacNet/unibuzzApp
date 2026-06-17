import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FormInput } from "@/components/atoms/FormInput";
import RadioInput from "@/components/atoms/RadioInput";
import TextAreaWithWordCount from "@/components/atoms/TextAreaWIthWordCount";
import CustomSwitch from "@/components/atoms/CustomSwitch";
import {
  GROUP_ACCESS_OPTIONS,
  GROUP_LABEL_OPTIONS,
  GROUP_TYPE_OPTIONS,
} from "../../../../screens/NewCommunityGroupScreen/constants";
import { WarningCircleSolid } from "iconoir-react-native";
import { FONTS } from "@/constants/fonts";
import {
  CommunityGroupAccess,
  CommunityGroupTypeEnum,
} from "@/types/CommunityGroup";

interface FormFieldsProps {
  control: any;
  errors: any;
  createSelectedFilters: any;
  setCreateSelectedFilters: (filters: any) => void;
  isPending?: boolean;
  groupType?: string;
  isNewGroup?: boolean;
  fieldRefs?: any;
  communityGroupAccess?: string;
  isRequestRequiredToJoinGroup?: boolean;
  onRequestRequiredChange?: (value: boolean) => void;
  readOnlyGroupAccess?: boolean;
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
  communityGroupAccess,
  isRequestRequiredToJoinGroup = false,
  onRequestRequiredChange,
  readOnlyGroupAccess = false,
}) => {
  const groupTypeOptions = useMemo(
    () =>
      GROUP_TYPE_OPTIONS.map((option) => ({
        ...option,
        disabled:
          communityGroupAccess === CommunityGroupAccess.Hidden &&
          option.value === CommunityGroupTypeEnum.OFFICIAL,
      })),
    [communityGroupAccess]
  );

  return (
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
      </View>

      <View style={styles.section}>
        <View style={styles.flexRowContainer}>
          <Text style={styles.inputLabels}>Group Access</Text>
          {!readOnlyGroupAccess && <Text style={styles.required}>*</Text>}
        </View>
        {readOnlyGroupAccess ? (
          <View style={styles.container}>
            {communityGroupAccess === CommunityGroupAccess.OpenCampus && (
              <>
                <Text style={styles.title}>Open Campus</Text>
                <Text style={styles.subtitle}>
                  Open to university members and external users.
                </Text>
              </>
            )}
            {communityGroupAccess === CommunityGroupAccess.UniversityWide && (
              <>
                <Text style={styles.title}>University-wide</Text>
                <Text style={styles.subtitle}>
                  Students and faculty can join
                </Text>
              </>
            )}
            {communityGroupAccess === CommunityGroupAccess.Hidden && (
              <>
                <Text style={styles.title}>Hidden</Text>
                <Text style={styles.subtitle}>
                  Group is invite-only and hidden from search
                </Text>
              </>
            )}
          </View>
        ) : (
          <RadioInput
            ref={fieldRefs?.communityGroupAccess}
            name="communityGroupAccess"
            control={control}
            options={GROUP_ACCESS_OPTIONS}
            required
          />
        )}
        {communityGroupAccess !== CommunityGroupAccess.Hidden && (
          <View style={styles.switchContainer}>
            <CustomSwitch
              value={isRequestRequiredToJoinGroup}
              onValueChange={onRequestRequiredChange ?? (() => {})}
              disabled={communityGroupAccess === CommunityGroupAccess.Hidden}
              size="small"
            />
            <Text style={styles.switchLabel}>
              Require users to request access before joining.
            </Text>
          </View>
        )}
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
            options={groupTypeOptions}
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
    </>
  );
};

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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  switchLabel: {
    flex: 1,
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: FONTS.inter.regular,
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
