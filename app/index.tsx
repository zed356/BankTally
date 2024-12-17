import { BluetoothPrinter } from "@/components/bluetooth-printer/BluetoothPrinter";
import CustomButton from "@/components/custom-elements/CustomButton";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import ErrorModal from "@/components/modals/ErrorModal";
import { Colors } from "@/constants/Colors";
import { defaultValues } from "@/constants/Values";
import { useConfirmationModalStore } from "@/stores/ConfirmationModalStore";
import { useUserInputStore } from "@/stores/UserInputStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import UserInputList from "../components/user-inputs/UserInputList";

export default function Index() {
  const { setUserInputValues } = useUserInputStore();
  const { showConfirmationModal, hideConfirmationModal } = useConfirmationModalStore();

  const handleClearUserInputValues = async () => {
    showConfirmationModal("Are you sure you want to clear all values?", async () => {
      try {
        await AsyncStorage.clear();
      } catch (e) {
        // TODO: handle error
        console.log("oops");
      }
      setUserInputValues(defaultValues);
      hideConfirmationModal();
    });
  };
  return (
    <LinearGradient colors={Colors.defaultGradient} style={styles.container}>
      <UserInputList />
      <View style={styles.buttonsContainer}>
        <CustomButton type="neutral" text="Clear" onPress={handleClearUserInputValues} />
        <BluetoothPrinter />
      </View>
      <ConfirmationModal />
      <ErrorModal />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  buttonsContainer: {
    flex: 0.7,
    justifyContent: "space-around",
    alignItems: "center",
  },
});
