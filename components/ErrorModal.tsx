import { Modal, StyleSheet, View, Pressable, Text } from "react-native";

interface ModalProps {
  modalVisible: boolean;
  errorMessage: string;
  closeErrorModal: () => void;
}

const ErrorModal: React.FC<ModalProps> = ({ modalVisible, errorMessage, closeErrorModal }) => {
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: "#fff", // Use a consistent background color
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      userSelect: "none",
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: "#F194FF", // Consider extracting to a constants file
    },
    buttonClose: {
      backgroundColor: "red",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
    },
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        closeErrorModal();
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{errorMessage}</Text>
          <Pressable style={[styles.button, styles.buttonClose]} onPress={() => closeErrorModal()}>
            <Text style={styles.textStyle}>Okay</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ErrorModal;
