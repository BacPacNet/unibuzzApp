import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { Check, CheckSquareSolid, NavArrowDown } from "iconoir-react-native";
import DummyButton from "@/components/atoms/DummyButton";
import { Toast } from "react-native-toast-notifications";
import { FONTS } from "@/constants/fonts";

type Props = {
  selectedType: "student" | "faculty" | null;
  setSelectedType: (type: "student" | "faculty" | null) => void;
  disabled: boolean;
  studentFields: {
    chips: { key: string; value: string[]; onRemove: (val: string) => void }[];
    buttons: { text: string; onPress: () => void; label: string }[];
  };
  facultyFields: {
    chips: { key: string; value: string[]; onRemove: (val: string) => void }[];
    buttons: { text: string; onPress: () => void; label: string }[];
  };
};

const RoleSelectorWithFields: React.FC<Props> = ({
  selectedType,
  setSelectedType,
  studentFields,
  facultyFields,
  disabled,
}) => {
  const handlePress = (type: "student" | "faculty" | null) => {
    if (disabled) {
      Toast.hideAll();
      return Toast.show("Select a university first", {
        type: "warning",
        placement: "top",
      });
    }
    setSelectedType(selectedType === type ? null : type);
  };

  const renderCheckbox = (label: string, type: "student" | "faculty") => (
    <TouchableOpacity
      //   disabled={disabled}
      style={styles.checkboxRow}
      //   onPress={() =>  setSelectedType(selectedType === type ? null : type)}
      onPress={() => handlePress(type)}
    >
      <View
        style={[
          styles.checkbox,
          selectedType === type && styles.checkboxSelected,
        ]}
      >
        {selectedType === type && (
          <Check width={12} height={12} color={"white"} strokeWidth={4} />
        )}
      </View>
      <Text
        style={[
          styles.checkboxLabel,
          selectedType === type && styles.checkboxLabelActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderFields = (
    label: string,
    chips: Props["studentFields"]["chips"],
    buttons: Props["studentFields"]["buttons"]
  ) => (
    <View style={styles.fieldSection}>
      {chips.length > 0 && chips.some((chip) => chip.value.length > 0) ? (
        <View style={styles.chipContainer}>
          {chips.flatMap((chip, chipIdx) =>
            chip.value.map((val, valIdx) => {
              const isFirstChip = chipIdx === 0 && valIdx === 0;

              return (
                <View
                  key={`${chip.key}-${valIdx}`}
                  style={[
                    styles.chip,
                    isFirstChip ? styles.chipDefault : styles.chipPrimary,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isFirstChip
                        ? styles.chipDefaultText
                        : styles.chipPrimaryText,
                    ]}
                  >
                    {val}
                  </Text>
                  <TouchableOpacity onPress={() => chip.onRemove(val)}>
                    <Text
                      style={[
                        styles.closeText,
                        isFirstChip
                          ? styles.chipDefaultText
                          : styles.chipPrimaryText,
                      ]}
                    >
                      {"  "}×
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      ) : null}

      {buttons.map((btn, i) => (
        <View key={i}>
          <DummyButton
            label={btn.label}
            text={btn.text}
            onPress={btn.onPress}
            toShowCross={false}
            icon={<NavArrowDown width={20} height={20} />}
          />
        </View>
      ))}
    </View>
  );

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {renderCheckbox("Student", "student")}
      {selectedType === "student" &&
        renderFields("Student", studentFields.chips, studentFields.buttons)}
      {renderCheckbox("Faculty", "faculty")}

      {selectedType === "faculty" &&
        renderFields("Faculty", facultyFields.chips, facultyFields.buttons)}
    </View>
  );
};

export default RoleSelectorWithFields;

const styles = StyleSheet.create({
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    // marginVertical: 8,

    paddingVertical: 12,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  checkboxSelected: {
    backgroundColor: "#6C5CE7",
    // borderColor: "#6C5CE7",
    borderWidth: 0,
    borderRadius: 4,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#3A3B3C",
    fontFamily: FONTS.inter.semiBold,
  },
  checkboxLabelActive: {
    fontSize: 14,
    color: "#3A3B3C",
    fontFamily: FONTS.inter.semiBold,
  },
  fieldSection: {
    display: "flex",
    flexDirection: "column",
    gap: 32,
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    height: 28,
  },

  chipDefault: {
    borderWidth: 1,
    borderColor: "#6744FF",
    backgroundColor: "white",
  },

  chipPrimary: {
    backgroundColor: "#6744FF",
  },

  chipText: {
    fontSize: 14,
  },

  chipDefaultText: {
    color: "#6744FF",
  },

  chipPrimaryText: {
    color: "white",
  },

  closeText: {
    fontSize: 14,
    marginLeft: 4,
  },
  btnLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3A3B3C",
  },
});
