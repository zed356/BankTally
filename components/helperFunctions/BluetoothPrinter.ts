import { inputLabels } from "@/constants/Values";
import { ICurrencyObject } from "@/types/UserInputTypes";
import ThermalPrinterModule from "react-native-thermal-printer";

export const BluetoothPrinter = async (values: ICurrencyObject, displayTotalValue: number) => {
  // initialize printer connection; first run will ask for permission
  await ThermalPrinterModule.getBluetoothDeviceList();

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
    throw e;
  }
};
