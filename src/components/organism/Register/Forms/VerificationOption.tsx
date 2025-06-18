import ReusableButton from "@/components/atoms/ReusableButton";
import Title from "@/components/atoms/Title";
import { getRegisterData, storeRegisterData } from "@/storage/register";
import { ArrowLeft, Mail, MailSolid } from "iconoir-react-native";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const VerificationOption = ({
  setStep,
  setSubStep,
  handlePrev,
}: {
  setStep: (value: number) => void;
  setSubStep: (value: number) => void;
  handlePrev: () => void;
}) => {
  const handleNext = async () => {
    const data = await getRegisterData();
    storeRegisterData({ ...data, step: 4, subStep: 0 });
    setStep(3);
    setSubStep(0);
  };

  return (
    <View style={styles.main}>
      <View className="flex w-full justify-center items-center  bg-white">
        <View style={styles.titlemargin} className=" w-full">
          <Title className="text-start">Create Account</Title>
        </View>

        <View style={styles.mainContainer} className="w-full">
          <TouchableOpacity
            onPress={() => handleNext()}
            className="flex flex-col gap-4"
          >
            <View style={styles.cardContainer} className="flex flex-col gap-2">
              <View style={styles.iconContainer}>
                <MailSolid
                  width={20}
                  height={20}
                  color="white"
                  fill={"#6744FF"}
                />
              </View>

              <Text style={styles.cardTitle}>Verify by Email</Text>
              <Text style={styles.cardDescription}>unibuzz@email.com</Text>
            </View>
          </TouchableOpacity>
          <Text className=" text-sm text-neutral-500">
            User verification ensures a safe and trusted community by preventing
            impersonation and unauthorized access.
          </Text>
        </View>
      </View>
      <ReusableButton
        onPress={handlePrev}
        buttonContent={
          <View className="flex flex-row items-center justify-center gap-2">
            <ArrowLeft width={20} height={20} color="#6744FF" />
            <Text className="text-primary-500"> Review Account</Text>
          </View>
        }
        variant="shade"
        height="large"
      />
    </View>
  );
};

export default VerificationOption;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  titlemargin: {
    marginBottom: 32,
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginTop: 48,
  },

  cardContainer: {
    backgroundColor: "#F3F2FF",
    padding: 32,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  iconContainer: {
    backgroundColor: "#6744FF",
    padding: 4,
    borderRadius: 100,
    width: 33,
    height: 33,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3A3B3C",
    lineHeight: 28,
  },
  cardDescription: {
    fontSize: 16,
    color: "#3A3B3C",
    lineHeight: 24,
  },
});
