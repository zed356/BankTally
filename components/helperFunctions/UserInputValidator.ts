const UserInputValidator = (label: string, validateUserInput: boolean, val: string): boolean => {
  if (!validateUserInput) return true;

  if (label[0] == "£") {
    return validateUserInput && Number(val) % Number(label.slice(1)) == 0;
  } else if (label[label.length - 1] == "p") {
    const decimalIndex = val.indexOf(".");
    let numAfterDecimal = val.slice(decimalIndex + 1);
    const labelToNumber = +label.slice(0, -1);

    if (decimalIndex == -1 || val.slice(decimalIndex).length == 1) {
      return true;
    }

    if (+numAfterDecimal == 0) {
      return true;
    }

    if (numAfterDecimal.length == 1) {
      numAfterDecimal += 0;
      return +numAfterDecimal % labelToNumber == 0;
    } else if (labelToNumber < 10) {
      return +numAfterDecimal[1] % labelToNumber == 0;
    }
  }
  return false;
};

export default UserInputValidator;
