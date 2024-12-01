import { inputLabels } from "@/constants/Values";
import { ICurrencyObject } from "@/types/UserInputTypes";
import ThermalPrinterModule from "react-native-thermal-printer";
import BluetoothStateManager from "react-native-bluetooth-state-manager";
import { request, PERMISSIONS, check } from "react-native-permissions";

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

  // filter out values that are empty and apply markdown to the rest +
  // skip Difference - Total - Expected as it is not needed here.
  const tempPayload = valuesWithoutDifferenceTotalExpected
    .map(([key, value]: [key: string, value: string]) => {
      // skip empty values
      if (value.length == 0) return;

      let denomination;
      let printedValue = value;
      // skip the £ sign if it exists as printing library does not support it
      if (key[0] == "£") {
        denomination = key.slice(1);
      } else {
        denomination = key;
      }

      if (value.includes(".")) {
        const decimalPart = value.split(".")[1];

        // if 0, means it's just a decimal point with nothing after it
        // remove it completely and add 3 spaces at the end
        if (decimalPart.length == 0) {
          printedValue = value.split(".")[0];
          printedValue = printedValue.padEnd(printedValue.length + 3, " ");
        }

        // if only 1 digit after decimal, add 1 space. else it's 2 digits and no space needed
        if (decimalPart.length == 1) {
          printedValue = printedValue.padEnd(printedValue.length + 1, " ");
        }
        // pad front to make full length 7
        printedValue = printedValue.padStart(7, " ");
      } else {
        // if no decimal point, always 3 spaces needed at the end
        printedValue = printedValue.padEnd(printedValue.length + 3, " ");
        // pad front to make full length 7
        printedValue = printedValue.padStart(7, " ");
      }

      return (
        "[L]<font size='big'>[ ]</font>" +
        `[L]<font size='big'>${denomination}</font>` +
        `[R]<font size='big'>${printedValue} </font>`
      );
    })
    .filter((value) => value != undefined);

  // add header
  tempPayload.unshift("[L]<font size='big'> Cash breakdown</font>\n");

  // add total
  tempPayload.push(
    "[L]<font size='big'>Total: </font>" +
      `[R][R]<font size='big'>${displayTotalValue.toFixed(2)}</font>\n` +
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
