import { ICurrencyObject } from "@/types/UserInputTypes";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";
import UserInputValidator from "../helper-functions/UserInputValidator";

interface InputProps {
  label: string;
  value?: string;
  allowInput?: boolean;
  style?: ViewStyle;
  onBlur?: (target: keyof ICurrencyObject, value: string) => void;
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
  const [focused, setFocused] = useState(false); // makes placeholder transparent when user selects input field

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

  const isUserInputValid = (): boolean => {
    const isValid =
      Number(val) !== 0 && !UserInputValidator(label, validateUserInput, val) ? false : true;

    return isValid;
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
      borderColor:
        (!isUserInputValid() && "red") || (isUserInputValid() && val && "green") || "gray",
      backgroundColor:
        (!isUserInputValid() && "#FF000033") ||
        (isUserInputValid() && val && "#98FB98") ||
        "#f1f1f1",
      borderWidth: 1,
      borderRadius: 5,
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
          onBlur(label as keyof ICurrencyObject, val);
        }}
        inputMode="numeric"
        readOnly={!allowInput}
        placeholder="0"
        onChangeText={(value) => {
          onBlur(label as keyof ICurrencyObject, value);
        }}
        value={value || val}
        maxLength={validateUserInput ? calcMaxInputLength() : maxLength}
      />
    </View>
  );
};

export default CustomUserInput;
