import { inputLabels } from "@/constants/Values";
import { useErrorModalStore } from "@/stores/ErrorModalStore";
import {
  getUserInputValuesFromStorage,
  writeUserInputValuesToStorage,
} from "@/stores/PersistentStorage";
import { useUserInputStore } from "@/stores/UserInputStore";
import { ICurrencyObject } from "@/types/UserInputTypes";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { DisplayTotalValue } from "../helper-functions/DisplayTotalValue";
import CustomUserInput from "./CustomUserInput";

const UserInputList: React.FC = () => {
  const { userInputValues, setUserInputValues } = useUserInputStore();
  const { showErrorModal, closeErrorModal } = useErrorModalStore();

  // loads old data if there is any upon app start
  useEffect(() => {
    (async () => {
      try {
        setUserInputValues(await getUserInputValuesFromStorage());
      } catch (error) {
        showErrorModal("Failed to load data from storage.", "OK", closeErrorModal);
      }
    })();
  }, []);

  const displayTotalValue = DisplayTotalValue(userInputValues);

  // convert to ints before calculations to avoid floating point precision errors
  const displayDifference = (
    (displayTotalValue * 100 - +userInputValues.Expected * 100) /
    100
  ).toFixed(2);

  const handleUserInputValues = (target: keyof ICurrencyObject, value: string) => {
    const newValues = {
      ...userInputValues,
      [target]: value,
    };
    writeUserInputValuesToStorage(newValues);
    setUserInputValues(newValues);
  };

  const handleDifferenceBorder = () => {
    const temp = Number(displayDifference);
    if (userInputValues.Expected.length === 0) {
      return "#e1e1e1";
    }
    if (temp > 0) {
      return "#98FB98";
    } else if (temp < 0) {
      return "#FF000033";
    }
  };

  return (
    <View style={styles.inputList}>
      {inputLabels.map((label, index) => (
        <CustomUserInput
          key={index}
          label={label}
          onBlur={handleUserInputValues}
          values={userInputValues}
        />
      ))}
      <CustomUserInput
        label="Total"
        allowInput={false}
        style={{ borderWidth: 1, borderColor: "black", backgroundColor: "#e1e1e1" }}
        value={displayTotalValue.toFixed(2)}
        validateUserInput={false}
        values={userInputValues}
      />
      <CustomUserInput
        label="Expected"
        onBlur={handleUserInputValues}
        validateUserInput={false}
        style={{ borderWidth: 1, backgroundColor: "#f1f1f1" }}
        values={userInputValues}
      />
      <CustomUserInput
        label="Difference"
        allowInput={false}
        style={{
          borderWidth: 1.5,
          borderColor: "#a1a1a1",
          backgroundColor: handleDifferenceBorder(),
        }}
        value={userInputValues.Expected.length > 0 ? displayDifference : ""}
        validateUserInput={false}
        values={userInputValues}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputList: {
    flex: 0.7,
    marginLeft: 50,
    paddingTop: 35,
    height: "95%",
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
});

export default UserInputList;
