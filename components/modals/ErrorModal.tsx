import { DEFAULT_BORDER_RADIUS } from "@/constants/Values";
import { Modal, StyleSheet, View, Pressable, Text } from "react-native";
import CustomButton from "../custom-elements/CustomButton";
import BaseModal from "./BaseModal";

interface ModalProps {
  modalVisible: boolean;
  errorMessage: string;
  closeErrorModal: () => void;
}

const ErrorModal: React.FC<ModalProps> = ({ modalVisible, errorMessage, closeErrorModal }) => {
  return (
    <BaseModal modalVisible={modalVisible} onRequestClose={closeErrorModal}>
      <Text style={styles.modalText}>{errorMessage}</Text>
      <CustomButton type="negative" text="Okay" onPress={closeErrorModal} />
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
