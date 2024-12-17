import { useErrorModalStore } from "@/stores/ErrorModalStore";
import { StyleSheet, Text } from "react-native";
import CustomButton from "../custom-elements/CustomButton";
import BaseModal from "./BaseModal";

const ErrorModal: React.FC = () => {
  const { isVisible, message, closeErrorModal, actionButtonName, onActionButtonPress } =
    useErrorModalStore();
  return (
    <BaseModal modalVisible={isVisible} onRequestClose={closeErrorModal}>
      <Text style={styles.modalText}>{message}</Text>
      <CustomButton type="negative" text={actionButtonName} onPress={onActionButtonPress} />
    </BaseModal>
  );
};

export default ErrorModal;

const styles = StyleSheet.create({
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
