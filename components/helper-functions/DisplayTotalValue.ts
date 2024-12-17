import { ICurrencyObject } from "@/types/UserInputTypes";

export const DisplayTotalValue = (values: ICurrencyObject) => {
  return (
    Object.entries(values)
      .filter(([key]) => !["Expected", "Difference", "Total"].includes(key))
      .reduce((acc, [key, value]) => {
        // validate and process numeric input
        const numericValue = isNaN(+value) ? 0 : +value;
        // multiply values by 100 to deal with ints and avoid floating point errors
        return acc + numericValue * 100;
        // divide by 100 to get the correct value with decimal points. Text below will handle the toFixed(2) conversion
      }, 0) / 100
  );
};
