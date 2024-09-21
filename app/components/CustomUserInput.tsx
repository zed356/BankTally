import { useRef, useState } from "react";
import { View, Text, TextInput, ViewStyle, TextInputAndroidProps } from "react-native";

interface InputProps {
  label: string;
  value?: string;
  allowInput?: boolean;
  style?: ViewStyle;
  onBlur?: (target: string, value: string) => void;
  maxLength?: number;
  validateUserInput?: boolean;
}

const CustomUserInput: React.FC<InputProps> = ({
  label,
  allowInput = true,
  style,
  value,
  onBlur = () => {},
  maxLength = 7,
  validateUserInput = true,
}) => {
  const [focused, setFocused] = useState(false);

  const [val, setVal] = useState("0");

  const handleVal = (newVal: string) => {
    setVal(newVal);
  };

  const handleFocused = () => {
    setFocused(!focused);
  };

  const calcMaxInputLength = (): number => {
    const targetIndex = val.indexOf(".");
    const temp = val.slice(0, targetIndex);

    // +3 because: 1 for the '.' char and 2 for 2 digits after the decimal point
    return Number(temp.length + 3);
  };

  const validateInput = (): boolean => {
    if (!validateUserInput) true;

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

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text>{label}</Text>
      <TextInput
        style={{
          height: 30,
          borderColor: Number(val) != 0 && !validateInput() ? "red" : "gray",
          borderWidth: 1,
          width: 60,
          paddingLeft: 3,
          pointerEvents: allowInput ? "auto" : "none",
          color: "black",
          ...style,
        }}
        placeholderTextColor={focused ? "transparent" : "black"}
        onFocus={handleFocused}
        onBlur={() => {
          handleFocused();
          onBlur(label, val);
        }}
        inputMode="numeric"
        readOnly={!allowInput}
        placeholder="0"
        onChangeText={handleVal}
        value={value}
        maxLength={validateUserInput ? calcMaxInputLength() : maxLength}
      />
    </View>
  );
};

export default CustomUserInput;
