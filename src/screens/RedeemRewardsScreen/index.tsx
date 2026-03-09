import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useForm } from "react-hook-form";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "@/types/navigation";
import { SafeScreen } from "@/components/template";
import BackHeader from "@/components/atoms/BackHeader";
import { usePostUserRequestRewards } from "@/services/user";
import RedeemSuccessModal from "@/components/molecules/Rewards/redeemSuccessModal";
import RedeemRewardsModal from "@/components/molecules/Rewards/redeemRewardsModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type FormValues = {
  email: string;
};

const RedeemRewardsScreen = () => {
  const { navigate } = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "RedeemRewards">>();
  const queryClient = useQueryClient();
  const amount = route.params?.amount ?? 0;
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { mutate: postUserRequestRewards, isPending } =
    usePostUserRequestRewards();

  const onSubmit = (data: FormValues) => {
    postUserRequestRewards(
      { awsEmail: data.email },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getUserRewards"] });
          queryClient.invalidateQueries({
            queryKey: ["getUserEligibleForRewards"],
          });
          setShowSuccess(true);
        },
      }
    );
  };

  const handleCloseSuccess = () => {
    
      navigate("Rewards" as never);
      setShowSuccess(false);
 
   
  };

  return (
    <SafeScreen allowTopPadding={false}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          enableOnAndroid
          extraScrollHeight={20}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          <BackHeader label="Rewards" onPress={handleCloseSuccess} />

          {showSuccess ? (
            <RedeemSuccessModal  />
          ) : (
            <RedeemRewardsModal
              amount={amount}
              control={control}
              errors={errors}
              onSubmit={handleSubmit(onSubmit)}
              isPending={isPending}
            />
          )}
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </SafeScreen>
  );
};

export default RedeemRewardsScreen;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 32,
  },
});
