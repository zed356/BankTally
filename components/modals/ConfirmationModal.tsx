import { Pressable, StyleSheet, Text, View } from "react-native";
import BaseModal from "./BaseModal";
import CustomButton from "../custom-elements/CustomButton";

interface ConfirmationModalProps {
  modalVisible: boolean;
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  modalVisible,
  text,
  onConfirm,
  onCancel,
}) => {
  return (
    <BaseModal modalVisible={modalVisible}>
      <Text style={styles.text}>{text}</Text>
      <View style={styles.buttonContainer}>
        <CustomButton type="positive" text="Confirm" onPress={onConfirm} />
        <CustomButton type="negative" text="Cancel" onPress={onCancel} />
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
