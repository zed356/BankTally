import { ICurrencyObject } from "@/types/UserInputTypes";
import BluetoothStateManager from "react-native-bluetooth-state-manager";
import { PERMISSIONS, check, request } from "react-native-permissions";
import ThermalPrinterModule from "react-native-thermal-printer";
import { PrinterMarkdownWriter } from "./PrinterMarkdownWriter";

export const BluetoothPrinterHandler = async (
  values: ICurrencyObject,
  displayTotalValue: number
) => {
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
  //----------------- TEMP FIX ----------------
  // missing bluetooth requests, such as SCAN.
  // this function call might sort all permissions.
  await ThermalPrinterModule.getBluetoothDeviceList();
  const payload = PrinterMarkdownWriter(values, displayTotalValue);
  try {
    await ThermalPrinterModule.printBluetooth({
      payload: payload,
      printerNbrCharactersPerLine: 30,
    });
  } catch (e) {
    throw new Error("Printer not found. Please re-pair the printer.");
  }
};
