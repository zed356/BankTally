import { inputLabels } from "@/constants/Values";
import { ICurrencyObject } from "@/types/UserInputTypes";
import ThermalPrinterModule from "react-native-thermal-printer";
import BluetoothStateManager from "react-native-bluetooth-state-manager";
import { request, PERMISSIONS, check } from "react-native-permissions";
import { Linking } from "react-native";

export const BluetoothPrinter = async (values: ICurrencyObject, displayTotalValue: number) => {
  // check if 'find nearby devices' is allowed
  const bluetoothPermission = await check(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);

  if (bluetoothPermission !== "granted") {
    try {
      // if permission is denied, ask for permission
      if (bluetoothPermission === "denied") {
        const res = await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);

        // if user denies permission, return. not returning here will run the bottom try-catch and cause
        // a second request for permission. better let the user press print again and thus prompt the request
        if (res === "denied") {
          return;
        }

        // if user denies permission twice, it becomes 'blocked'. to unblock, ask to go to settings
        // and enable 'find nearby devices'
        if (res === "blocked") {
          throw new Error("Please enable 'Bluetooth/Find nearby devices' permissions in settings.");
        }
      }
    } catch (e: unknown) {
      throw e;
    }
  }

  // check if bluetooth is enabled
  try {
    const isBluetoothEnabled = await BluetoothStateManager.getState();
    if (isBluetoothEnabled === "PoweredOff") {
      throw new Error("Bluetooth Device Not Found");
    }
  } catch (e: unknown) {
    throw e;
  }

  // keys under [0], values under [1]
  const valuesToArray = Object.entries(values);

  // filter out values that are not in the inputLabels array
  const valuesWithoutDifferenceTotalExpected = valuesToArray.filter((value) =>
    inputLabels.includes(value[0])
  );

  // filter out values that are empty and apply markdown to the rest
  const tempPayload = valuesWithoutDifferenceTotalExpected
    .map((value) => {
      // skip empty values
      if (value[1].length > 0) {
        let denomination;
        // skip the £ sign if it exists as printing library does not support it
        if (value[0][0] == "£") {
          denomination = value[0].slice(1);
        } else {
          denomination = value[0];
        }
        return (
          "[L]<font size='big'>[ ]</font>" +
          `[C]<font size='big'>${denomination}</font>` +
          `[R][R]<font size='big'>${value[1]}</font>`
        );
      }
    })
    .filter((value) => value != undefined);

  // add header
  tempPayload.unshift("[L]<font size='big'> Cash breakdown</font>\n");

  // add total
  tempPayload.push(
    "[C]<font size='big'> Total:</font>" +
      `[R]<font size='big'>  ${displayTotalValue.toFixed(2)}</font>\n` +
      "\n" +
      "\n" +
      "\n" +
      `.`
  );

  // join all elements with a newline
  const payload = tempPayload.join("\n" + "\n");

  try {
    await ThermalPrinterModule.printBluetooth({
      payload: payload,
      printerNbrCharactersPerLine: 30,
    });
  } catch (e) {
    throw new Error("Printer not found. Please re-pair the printer.");
  }
};
