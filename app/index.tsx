import { StatusBar } from "expo-status-bar";
import { Fragment } from "react";
import { Text, View, TextInput, ViewStyle } from "react-native";

export default function Index() {
  const valuet = () => {};

  interface InputProps {
    value: string;
  }

  interface DisplayBoxProps {
    text: string;
    allowInput?: boolean;
    style?: ViewStyle;
  }

  const CustomUserInput: React.FC<InputProps> = ({ value }) => {
    return (
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
        <Text>{value}</Text>
        <TextInput
          style={{ height: 30, borderColor: "gray", borderWidth: 1, width: 40 }}
          keyboardType="numeric"
        />
      </View>
    );
  };

  const DisplayBox: React.FC<DisplayBoxProps> = ({ text, allowInput = true, style }) => {
    return (
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
        <Text>{text}</Text>
        <TextInput
          style={{ borderColor: "gray", borderWidth: 1, width: 40, height: 25, ...style }}
          keyboardType="numeric"
          readOnly={!allowInput}
          pointerEvents={allowInput ? "auto" : "none"}
        ></TextInput>
      </View>
    );
  };

  return (
    <Fragment>
      <Text
        style={{
          borderWidth: 1,
          borderColor: "grey",
          backgroundColor: "#ececec",
          height: 50,
          textAlignVertical: "center",
          paddingLeft: 10,
        }}
      >
        Tiapa Calc
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            marginTop: 10,
            width: 100,
            paddingLeft: 0,
          }}
        >
          <CustomUserInput value="£20" />
          <CustomUserInput value="£10" />
          <CustomUserInput value="£5" />
          <CustomUserInput value="£2" />
          <CustomUserInput value="£1" />
          <CustomUserInput value="50p" />
          <CustomUserInput value="20p" />
          <CustomUserInput value="10p" />
          <CustomUserInput value="5p" />
          <CustomUserInput value="2p" />
          <CustomUserInput value="1p" />

          <DisplayBox
            text="Total"
            allowInput={false}
            style={{ borderWidth: 1, borderColor: "black" }}
          />
          <DisplayBox text="Expected" />
          <DisplayBox text="Difference" allowInput={false} />
        </View>
      </View>
    </Fragment>
  );
}
