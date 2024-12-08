/**
 * Validates user input based on the label and validation flag.
 *
 * @param label - The label of the input field (e.g., "£10" or "20p").
 * @param validateUserInput - A boolean indicating whether the input should be validated.
 * @param val - The value entered by the user, which is a string.
 * @returns boolean - Returns `true` if the input is valid based on the rules, otherwise `false`.
 */
const UserInputValidator = (label: string, validateUserInput: boolean, val: string): boolean => {
  // If validation is not required, return true (no validation needed)
  if (!validateUserInput) return true;

  // Case where the label starts with the '£' symbol (i.e., it's a currency amount)
  if (label[0] == "£") {
    // Check if the value entered is divisible by the number following the '£' symbol
    return validateUserInput && Number(val) % Number(label.slice(1)) == 0;
  }
  // Case where the label ends with the 'p' symbol (pence value)
  else if (label[label.length - 1] == "p") {
    // Find the position of the decimal point in the user input (if any)
    const decimalIndex = val.indexOf(".");
    let numAfterDecimal = val.slice(decimalIndex + 1); // Get the part of the input after the decimal point
    const labelToNumber = +label.slice(0, -1); // Convert the label (minus the 'p') to a number

    // If there's no decimal point or if there's only one digit after the decimal point, the input is valid
    if (decimalIndex == -1 || val.slice(decimalIndex).length == 1) {
      return true;
    }

    // Ensure there are exactly two digits after the decimal point for validation
    if (numAfterDecimal.length == 1) numAfterDecimal += "0"; // Add a trailing zero if needed

    // Check if the digits after the decimal point are divisible by the value in the label (e.g., "20p")
    return +numAfterDecimal % labelToNumber == 0;
  }

  // If none of the above conditions are met, return false (invalid input)
  return false;
};

export default UserInputValidator;
