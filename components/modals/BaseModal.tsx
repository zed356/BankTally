import { DEFAULT_BORDER_RADIUS } from "@/constants/Values";
import { Modal, StyleSheet, View } from "react-native";

interface BaseModalProps {
  modalVisible: boolean;
  children: React.ReactNode;
  onRequestClose: () => void;
}

const BaseModal: React.FC<BaseModalProps> = ({ children, modalVisible, onRequestClose }) => {
  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.container}>
        <View style={styles.modalView}>{children}</View>
      </View>
    </Modal>
  );
};

export default BaseModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "80%",
    backgroundColor: "#ddf3f1",
    padding: 20,
    borderRadius: DEFAULT_BORDER_RADIUS,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
