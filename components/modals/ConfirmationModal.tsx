import { useConfirmationModalStore } from "@/stores/ConfirmationModalStore";
import { StyleSheet, Text, View } from "react-native";
import CustomButton from "../custom-elements/CustomButton";
import BaseModal from "./BaseModal";

const ConfirmationModal: React.FC = () => {
  const { isVisible, text, onConfirm, hideConfirmationModal } = useConfirmationModalStore();
  return (
    <BaseModal modalVisible={isVisible} onRequestClose={hideConfirmationModal}>
      <Text style={styles.text}>{text}</Text>
      <View style={styles.buttonContainer}>
        <CustomButton type="positive" text="Confirm" onPress={onConfirm} />
        <CustomButton type="negative" text="Cancel" onPress={hideConfirmationModal} />
      </View>
    </BaseModal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  text: {
    alignSelf: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
