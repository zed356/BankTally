import { Fragment } from "react";
import { Text, View, TextInput, ViewStyle } from "react-native";

import CustomUserInput from "./components/CustomUserInput";

export default function Index() {
  const valuet = () => {};

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
            width: 110,
            paddingLeft: 0,
          }}
        >
          <CustomUserInput label="£20" />
          <CustomUserInput label="£10" />
          <CustomUserInput label="£5" />
          <CustomUserInput label="£2" />
          <CustomUserInput label="£1" />
          <CustomUserInput label="50p" />
          <CustomUserInput label="20p" />
          <CustomUserInput label="10p" />
          <CustomUserInput label="5p" />
          <CustomUserInput label="2p" />
          <CustomUserInput label="1p" />

          <CustomUserInput
            label="Total"
            allowInput={false}
            style={{ borderWidth: 1, borderColor: "black" }}
          />
          <CustomUserInput label="Expected" />
          <CustomUserInput label="Difference" allowInput={false} style={{ borderColor: "blue" }} />
        </View>
      </View>
    </Fragment>
  );
}
