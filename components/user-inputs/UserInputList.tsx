import { defaultValues, inputLabels } from "@/constants/Values";
import {
  getUserInputValuesFromStorage,
  writeUserInputValuesToStorage,
} from "@/stores/PersistentStorage";
import { ICurrencyObject } from "@/types/UserInputTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";
import { useEffect, useState } from "react";
import { Linking, StyleSheet, View } from "react-native";
import BluetoothStateManager from "react-native-bluetooth-state-manager";
import CustomButton from "../custom-elements/CustomButton";
import { BluetoothPrinter } from "../helperFunctions/BluetoothPrinter";
import { DisplayTotalValue } from "../helperFunctions/DisplayTotalValue";
import ConfirmationModal from "../modals/ConfirmationModal";
import ErrorModal from "../modals/ErrorModal";
import CustomUserInput from "./CustomUserInput";

const UserInputList: React.FC = () => {
  const [values, setValues] = useState(defaultValues);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");

  // loads old data if there is any upon app start
  useEffect(() => {
    (async () => {
      try {
        setValues(await getUserInputValuesFromStorage());
      } catch (error) {
        setErrorModalMessage("Failed to load data from storage.");
        setShowErrorModal(true);
      }
    })();
  }, []);

  const displayTotalValue = DisplayTotalValue(values);

  // convert to ints before calculations to avoid floating point errors
  const displayDifference = ((displayTotalValue * 100 - +values.Expected * 100) / 100).toFixed(2);

  const handleValues = (target: keyof ICurrencyObject, value: string) => {
    const newValues = {
      ...values,
      [target]: value,
    };
    writeUserInputValuesToStorage(newValues);
    setValues(newValues);
  };

  const clearValues = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.log("oops");
    }
    setValues(defaultValues);
    setShowConfirmationModal(false);
  };

  const handleClearValues = () => {
    setShowConfirmationModal(true);
  };

  const handleDifferenceBorder = () => {
    const temp = Number(displayDifference);
    if (temp > 0) {
      return "green";
    } else if (temp < 0) {
      return "red";
    } else {
      return "gray";
    }
  };

  const handlePrinter = _.debounce(async () => {
    try {
      await BluetoothPrinter(values, displayTotalValue);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrorModalMessage(e.message);
        setShowErrorModal(true);
      } else {
        console.log("Unexpected error:\n", e);
      }
    }
  }, 1000);

  const errorHandler = (message: string) => {
    switch (message) {
      case "Bluetooth Device Not Found":
        BluetoothStateManager.openSettings();
        break;
      case "Please enable 'Bluetooth/Find nearby devices' permissions in settings.":
        Linking.openSettings();
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputList}>
        {inputLabels.map((label, index) => (
          <CustomUserInput key={index} label={label} onBlur={handleValues} values={values} />
        ))}
        <CustomUserInput
          label="Total"
          allowInput={false}
          style={{ borderWidth: 1, borderColor: "black" }}
          value={displayTotalValue.toFixed(2)}
          validateUserInput={false}
          values={values}
        />
        <CustomUserInput
          label="Expected"
          onBlur={handleValues}
          validateUserInput={false}
          style={{ borderWidth: 2 }}
          values={values}
        />
        <CustomUserInput
          label="Difference"
          allowInput={false}
          style={{ borderWidth: 1, borderColor: handleDifferenceBorder() }}
          value={displayDifference}
          validateUserInput={false}
          values={values}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <CustomButton type="neutral" text="Clear" onPress={handleClearValues} />
        <CustomButton type="neutral" text="Print" onPress={handlePrinter} />
      </View>
      <ErrorModal
        modalVisible={showErrorModal}
        errorMessage={errorModalMessage}
        closeErrorModal={() => {
          errorHandler(errorModalMessage);
          setShowErrorModal(false);
        }}
      />
      <ConfirmationModal
        modalVisible={showConfirmationModal}
        text="Are you sure you want to clear all values?"
        onConfirm={clearValues}
        onCancel={() => setShowConfirmationModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 35,
  },
  inputList: {
    flex: 1,
    marginLeft: 105,
    marginRight: 0,
    height: "95%",
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },

  button: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 30,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 10,
    userSelect: "none",
    backgroundColor: "#D1D9DF",
  },
});

export default UserInputList;
