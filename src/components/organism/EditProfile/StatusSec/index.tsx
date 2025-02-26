import { SelectInputWithSearch } from "@/components/atoms/SelectInputWithSearch";
import {
  currYear,
  degreeAndMajors,
  occupationAndDepartment,
  value,
} from "@/types/register";
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

type StatusOptionsProps = {
  userType: string;
  setUserType: (status: string) => void;
  control: any;
};

const StatusOptions: React.FC<StatusOptionsProps> = ({
  userType,
  setUserType,
  control,
}) => {
  return (
    <View style={styles.statusOptions}>
      <TouchableOpacity
        style={[styles.statusOption]}
        onPress={() => setUserType("student")}
      >
        <View
          style={[
            styles.radioOuter,
            userType === "student" && styles.radioOuterSelected,
          ]}
        >
          {userType === "student" && <View style={styles.radioInner} />}
        </View>

        <Text
          style={[
            styles.statusText,
            userType === "student" && styles.statusTextSelected,
          ]}
        >
          Student
        </Text>
      </TouchableOpacity>

      {userType === "student" && (
        <View style={styles.studentFields}>
          <SelectInputWithSearch
            label="Year"
            placeholder="If you are a student choose your current year"
            name="study_year"
            options={currYear}
            control={control}
            search={true}
            required
            rules={{ required: "Year is required!" }}
          />

          <SelectInputWithSearch
            label="Degree"
            placeholder="If you are a student choose your degree "
            options={Object.keys(degreeAndMajors)}
            name="degree"
            control={control}
            required
            rules={{ required: "Degree is required!" }}
          />

          <SelectInputWithSearch
            label="Major"
            placeholder="If you are a student choose your Major "
            options={value}
            name="major"
            control={control}
            search={true}
            required
            rules={{ required: "Major is required!" }}
          />
        </View>
      )}

      <TouchableOpacity
        style={[styles.statusOption]}
        onPress={() => setUserType("faculty")}
      >
        <View
          style={[
            styles.radioOuter,
            userType === "faculty" && styles.radioOuterSelected,
          ]}
        >
          {userType === "faculty" && <View style={styles.radioInner} />}
        </View>
        <Text
          style={[
            styles.statusText,
            userType === "faculty" && styles.statusTextSelected,
          ]}
        >
          Faculty
        </Text>
      </TouchableOpacity>

      {userType === "faculty" && (
        <View style={styles.studentFields}>
          <SelectInputWithSearch
            label="Occupation"
            placeholder="If you are a Faculty choose your current occupation"
            name="occupation"
            options={Object.keys(occupationAndDepartment)}
            control={control}
            search={true}
            required
            rules={{ required: "Occupation is required!" }}
          />

          <SelectInputWithSearch
            label="Affiliation"
            placeholder="If you are a student choose your Affiliation "
            options={value}
            name="affiliation"
            control={control}
            required
            rules={{ required: "Affiliation is required!" }}
          />
        </View>
      )}
      <TouchableOpacity
        style={[styles.statusOption]}
        onPress={() => setUserType("applicant")}
      >
        <View
          style={[
            styles.radioOuter,
            userType === "applicant" && styles.radioOuterSelected,
          ]}
        >
          {userType === "applicant" && <View style={styles.radioInner} />}
        </View>
        <Text
          style={[
            styles.statusText,
            userType === "applicant" && styles.statusTextSelected,
          ]}
        >
          Applicant
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default StatusOptions;

const styles = StyleSheet.create({
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
    paddingVertical: 16,
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: "#9685FF",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#9685FF",
  },
  statusText: {
    fontSize: 16,
    color: "#374151",
  },
  statusTextSelected: {
    color: "#9685FF",
    fontWeight: "500",
  },
  studentFields: {
    marginTop: 16,
  },
});
