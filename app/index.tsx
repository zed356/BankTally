import { Fragment } from "react";
import { Text, View, TextInput } from "react-native";

export default function Index() {
  const valuet = () => {};

  interface Props {
    value: string;
  }

  const CustomUserInput: React.FC<Props> = ({ value }) => {
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

  return (
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
          padding: 0,
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

        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ paddingRight: 5 }}>Total</Text>
          <Text style={{ borderColor: "black", borderWidth: 1, width: 40, height: 25 }}></Text>
        </View>

        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
          <Text>Expected</Text>
          <TextInput
            style={{ borderColor: "gray", borderWidth: 1, width: 40, height: 25 }}
            keyboardType="numeric"
          ></TextInput>
        </View>

        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
          <Text>Difference</Text>
          <TextInput
            style={{ borderColor: "gray", borderWidth: 1, width: 40, height: 25 }}
            keyboardType="numeric"
          ></TextInput>
        </View>
      </View>
    </View>
  );
}
