import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { CheckCircleSolid } from "iconoir-react-native";

const CompletedStep = ({
  idx,
  handleBack,
}: {
  idx: number;
  handleBack: () => void;
}) => {
  return (
    <View className={`flex  h-8 relative ${idx == 3 ? "" : " w-28"}`}>
      <TouchableOpacity
        onPress={handleBack}
        className=" bg-white w-8 h-8   flex justify-center items-center mb-2 border border-gray-400 rounded-full"
      >
        <CheckCircleSolid color={"#6744FF"} height={36} width={36} />
      </TouchableOpacity>

      {idx !== 3 && (
        <View
          style={{ height: 4, width: 90 }}
          className=" bg-primary-500  absolute top-1/2 -translate-y-1/2 left-9 -z-10"
        />
      )}
    </View>
  );
};

const UnCompleteStep = ({ idx }: { idx: number }) => {
  return (
    <View className={`flex  h-8 relative ${idx == 3 ? "" : " w-28"}`}>
      <View className=" bg-white w-8 h-8 bg-gray-200 rounded-full flex justify-center items-center mb-2 border border-neutral-200">
        <Text className="text-gray-500 ">{`0${idx + 1}`}</Text>
      </View>

      {idx !== 3 && (
        <View
          style={{ backgroundColor: "#E5E7EB", height: 4 }}
          className="w-28    absolute top-1/2 -translate-y-1/2 left-8 -z-10"
        />
      )}
    </View>
  );
};

const CurrentStep = ({
  idx,
  handleBack,
}: {
  idx: number;
  handleBack: () => void;
}) => {
  return (
    <View className={`flex  h-8 relative ${idx == 3 ? "" : " w-28"}`}>
      <TouchableOpacity
        onPress={handleBack}
        style={{ borderColor: "#6744FF" }}
        className="bg-white w-8 h-8 flex justify-center items-center mb-2 rounded-full border "
      >
        {/* <Text className="text-gray-500 font-bold  ">{`0${idx + 1}`}</Text> */}
        <View className="w-2 h-2 rounded-full bg-primary-500"></View>
      </TouchableOpacity>

      {idx !== 3 && (
        <View
          style={{ height: 4 }}
          className="w-28  bg-primary-500  absolute top-1/2 -translate-y-1/2 left-8 -z-10"
        />
      )}
    </View>
  );
};

const Step = ({
  idx,
  currentStep,
  subStep,
  setStep,
  setSubStep,
}: {
  idx: number;
  currentStep: number;
  subStep: number;
  setStep: (value: number) => void;
  setSubStep: (value: number) => void;
}) => {
  const isCurrentStep = idx === currentStep && subStep < 2;

  const handleBack = () => {
    return;

    setStep(idx);
    setSubStep(0);
  };

  if (idx < currentStep) {
    return <CompletedStep handleBack={handleBack} key={idx} idx={idx} />;
  } else if (isCurrentStep) {
    return <CurrentStep handleBack={handleBack} key={idx} idx={idx} />;
  } else {
    return <UnCompleteStep key={idx} idx={idx} />;
  }
};

const RegisterStepper = ({
  step,
  subStep,
  setStep,
  setSubStep,
}: {
  step: number;
  subStep: number;
  setStep: (value: number) => void;
  setSubStep: (value: number) => void;
}) => {
  return (
    <FlatList
      data={[0, 1, 2, 3]}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <Step
          idx={index}
          currentStep={step}
          subStep={subStep}
          setStep={setStep}
          setSubStep={setSubStep}
        />
      )}
      contentContainerStyle={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 24,
        justifyContent: "center",
        paddingHorizontal: 6,
        // paddingStart: 16,
      }}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default RegisterStepper;
