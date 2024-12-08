import { Modal, StyleSheet, View } from "react-native";

interface BaseModalProps {
  modalVisible: boolean;
  children: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({ modalVisible, children }) => {
  return (
    <Modal visible={modalVisible} transparent={true}>
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
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
