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

  const validateInput = (): boolean =>
    validateUserInput && Number(val) % Number(label.slice(1)) == 0;

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
          paddingLeft: 2,
          pointerEvents: allowInput ? "auto" : "none",
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
        maxLength={maxLength}
      />
    </View>
  );
};

export default CustomUserInput;
