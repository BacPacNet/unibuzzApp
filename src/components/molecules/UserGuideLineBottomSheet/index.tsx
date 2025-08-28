import ReusableButton from "@/components/atoms/ReusableButton";
import { FONTS } from "@/constants/fonts";
import { useNewUserTrue } from "@/services/user";
import { CheckSquareSolid } from "iconoir-react-native";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const UserGuideLineBottomSheet = ({ onClose }: { onClose: () => void }) => {
  const [isSelected, setIsSelected] = useState(false);
  const { mutateAsync: newUserTrue, isPending: newUserTrueLoading } =
    useNewUserTrue();
  const handleAgree = async () => {
    await newUserTrue();
    onClose();
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Guidelines</Text>

      <Text style={[styles.text]}>
        Please be professional while using this application. This community is
        regulated by the university.
      </Text>
      <Text style={[styles.text]}>
        Do not engage in abuse, bullying, or any behavior that may violate
        community guidelines or harm the university’s image.
      </Text>

      <View className="flex flex-row items-center gap-2 my-4">
        <View className="flex justify-center items-center">
          <TouchableOpacity
            onPress={() => setIsSelected(!isSelected)}
            style={styles.checkboxBox}
          >
            {isSelected && (
              <CheckSquareSolid width={20} height={20} color="#6744FF" />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.checkText}>
          I have read and understood the above.
        </Text>
      </View>
      <View className="flex justify-center items-center">
        <ReusableButton
          variant="primary"
          buttonText="I Agree"
          onPress={handleAgree}
          isLoading={newUserTrueLoading}
          size={"w-1/2"}
        />
      </View>
    </View>
  );
};

export default UserGuideLineBottomSheet;
const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontFamily: FONTS.poppins.bold,
    fontSize: 18,
    textAlign: "center",
    color: "#374151",
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: "#374151",
    fontFamily: FONTS.inter.regular,
  },

  checkText: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    color: "#404040",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  checkedBox: {
    width: 10,
    height: 10,
    backgroundColor: "#0066CC",
  },

  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
});
