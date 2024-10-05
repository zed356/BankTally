import { useState } from "react";
import { View, Text, TextInput, ViewStyle, StyleSheet } from "react-native";

import UserInputValidator from "../helper/UserInputValidator";
import { ICurrencyObject } from "@/types/UserInputTypes";

interface InputProps {
  label: string;
  value?: string;
  allowInput?: boolean;
  style?: ViewStyle;
  onBlur?: (target: string, value: string) => void;
  maxLength?: number;
  validateUserInput?: boolean;
  values: ICurrencyObject;
}

const CustomUserInput: React.FC<InputProps> = ({
  label,
  allowInput = true,
  style,
  value,
  onBlur = () => {},
  maxLength = 7,
  validateUserInput = true,
  values,
}) => {
  const [focused, setFocused] = useState(false);

  let val = values[label as keyof ICurrencyObject].toString();

  const handleFocused = () => {
    setFocused(!focused);
  };

  const calcMaxInputLength = (): number => {
    const targetIndex = val.indexOf(".");
    const temp = val.slice(0, targetIndex);

    // +3 because: 1 for the '.' char and 2 for 2 digits after the decimal point
    return Number(temp.length + 3);
  };

  // styles

  const getBorderColor = () => {
    return Number(val) !== 0 && !UserInputValidator(label, validateUserInput, val) ? "red" : "gray";
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    userInput: {
      height: 30,
      borderColor: getBorderColor(),
      borderWidth: 1,
      width: 60,
      paddingLeft: 3,
      pointerEvents: allowInput ? "auto" : "none",
      color: "black",
      ...style,
    },
  });

  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <TextInput
        style={styles.userInput}
        placeholderTextColor={focused ? "transparent" : "black"}
        onFocus={handleFocused}
        onBlur={() => {
          handleFocused();
          onBlur(label, val);
        }}
        inputMode="numeric"
        readOnly={!allowInput}
        placeholder="0"
        onChangeText={(value) => {
          onBlur(label, value);
        }}
        value={value || val}
        maxLength={validateUserInput ? calcMaxInputLength() : maxLength}
      />
    </View>
  );
};

export default CustomUserInput;