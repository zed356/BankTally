import { View, Text, TextInput, ViewStyle } from "react-native";

interface InputProps {
  label: string;
  allowInput?: boolean;
  style?: ViewStyle;
}

const CustomUserInput: React.FC<InputProps> = ({ label, allowInput = true, style }) => {
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
        style={{ height: 30, borderColor: "gray", borderWidth: 1, width: 40, ...style }}
        keyboardType="numeric"
        readOnly={!allowInput}
        pointerEvents={allowInput ? "auto" : "none"}
      />
    </View>
  );
};

export default CustomUserInput;
