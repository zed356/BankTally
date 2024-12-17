import { inputLabels } from "@/constants/Values";
import { ICurrencyObject } from "@/types/UserInputTypes";

// pad start / end to make it 7 characters long, then all values line up nicely on the receipt
const addWhiteSpacesToValue = (value: string) => {
  let printedValue = value;
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
  return printedValue;
};

export const PrinterMarkdownWriter = (values: ICurrencyObject, displayTotalValue: number) => {
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
      // skip empty values, values that are not numbers and 0
      if (value.length == 0 || isNaN(Number(value)) || value === "0") return;

      let denomination;
      let printedValue = addWhiteSpacesToValue(value);
      // skip the £ sign if it exists as printing library does not support it
      if (key[0] == "£") {
        denomination = key.slice(1);
      } else {
        denomination = key;
      }

      return (
        `[L]<font size='big'> ${denomination}</font>` +
        `[R]<font size='big'>${printedValue} </font>`
      );
    })
    .filter((value) => value != undefined);

  // add header
  tempPayload.unshift("[L]<font size='big'> Cash breakdown</font>\n");

  // add total
  tempPayload.push(
    "[L]<font size='big'>Total: </font>" +
      `[C]<font size='big'>${addWhiteSpacesToValue(displayTotalValue.toFixed(2))}</font>\n` +
      "\n" +
      " "
  );

  // join all elements with a newline
  const payload = tempPayload.join("\n" + "\n");

  return payload;
};
