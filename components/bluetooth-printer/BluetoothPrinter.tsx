import { inputLabels } from "@/constants/Values";
import { useErrorModalStore } from "@/stores/ErrorModalStore";
import { useUserInputStore } from "@/stores/UserInputStore";
import _ from "lodash";
import { Linking } from "react-native";
import BluetoothStateManager from "react-native-bluetooth-state-manager";
import CustomButton from "../custom-elements/CustomButton";
import { BluetoothPrinterHandler } from "../helper-functions/BluetoothPrinterHandler";
import { DisplayTotalValue } from "../helper-functions/DisplayTotalValue";
import UserInputValidator from "../helper-functions/UserInputValidator";

const BluetoothPrinter: React.FC = () => {
  const { userInputValues } = useUserInputStore();
  const { showErrorModal, closeErrorModal } = useErrorModalStore();
  const totaledUserInputValues = DisplayTotalValue(userInputValues);

  const handlePrinter = _.debounce(async () => {
    // keys under [0], values under [1]
    const valuesToArray = Object.entries(userInputValues);
    // filter out values that are not in the inputLabels array
    const valuesWithoutDifferenceTotalExpected = valuesToArray.filter((value) =>
      inputLabels.includes(value[0])
    );

    // final value validation check before printing
    // 1. check if any value is greater than 0
    // 2. check if all values are valid against their label
    if (
      !valuesWithoutDifferenceTotalExpected.some((value) => {
        return Number(value[1]) > 0;
      }) ||
      !valuesWithoutDifferenceTotalExpected.every((value) =>
        UserInputValidator(value[0], true, value[1])
      )
    ) {
      showErrorModal("Please enter valid values.", "Close", "negative", closeErrorModal);

      return;
    }

    try {
      await BluetoothPrinterHandler(userInputValues, totaledUserInputValues);
    } catch (e: unknown) {
      if (e instanceof Error) {
        showErrorModal(e.message, "OK", "negative", () => {
          errorHandler(e.message);
          closeErrorModal();
        });
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

  return <CustomButton type="neutral" text="Print" onPress={handlePrinter} />;
};

export { BluetoothPrinter };
