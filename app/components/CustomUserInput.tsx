import { useRef, useState } from "react";
import { View, Text, TextInput, ViewStyle, TextInputAndroidProps } from "react-native";
import UserInputValidator from "./UserInputValidator";

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
          borderColor:
            Number(val) != 0 && !UserInputValidator(label, validateUserInput, val) ? "red" : "gray",
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
