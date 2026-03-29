import React, { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SafeScreen } from "@/components/template";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Keyboard, RefreshControl, StyleSheet, TouchableWithoutFeedback } from "react-native";
import RewardsDetailsCard from "@/components/organism/RewardsDetailsCard";


const RewardsScreen = () => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["getUserRewards"] });
    setRefreshing(false);
  }, [queryClient]);

  return (
    <SafeScreen allowTopPadding={false}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      <RewardsDetailsCard />
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
    </SafeScreen>
  );
};

export default RewardsScreen;


const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      backgroundColor: "#fff",
  
    },
});