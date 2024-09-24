import { Fragment, useState } from "react";
import { Keyboard, Pressable, Text, TouchableWithoutFeedback, View } from "react-native";

import CustomUserInput from "./components/CustomUserInput";

export default function Index() {
  const [values, setValues] = useState({
    "": 0,
  });

  const [expectedValue, setExpectedValue] = useState(0);

  const handleExpectedValue = (label: string, val: string) => {
    setExpectedValue(Number(val));
  };

  const handleValues = (target: string, value: string) => {
    const newValues = {
      ...values,
      [target]: Number(value),
    };

    setValues(newValues);
  };

  const displayTotalValue = Object.values(values)
    .reduce((acc, cur) => acc + cur)
    .toFixed(2);

  const displayDifference = (Number(displayTotalValue) - expectedValue).toFixed(2);

  const handleDifferenceBorder = () => {
    const temp = Number(displayDifference);
    if (temp > 0) {
      return "green";
    } else if (temp < 0) {
      return "red";
    } else {
      return "gray";
    }
  };

  return (
    <Fragment>
      <Text
        style={{
          borderWidth: 1,
          borderColor: "grey",
          backgroundColor: "#ececec",
          height: 50,
          verticalAlign: "middle",
          paddingLeft: 10,
        }}
      >
        Tiapa Calc
      </Text>
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 1,
            marginLeft: 110,
            marginRight: 15,
          }}
        >
          <CustomUserInput label="£20" onBlur={handleValues} />
          <CustomUserInput label="£10" onBlur={handleValues} />
          <CustomUserInput label="£5" onBlur={handleValues} />
          <CustomUserInput label="£2" onBlur={handleValues} />
          <CustomUserInput label="£1" onBlur={handleValues} />
          <CustomUserInput label="50p" onBlur={handleValues} />
          <CustomUserInput label="20p" onBlur={handleValues} />
          <CustomUserInput label="10p" onBlur={handleValues} />
          <CustomUserInput label="5p" onBlur={handleValues} />
          <CustomUserInput label="2p" onBlur={handleValues} />
          <CustomUserInput label="1p" onBlur={handleValues} />
          <CustomUserInput
            label="Total"
            allowInput={false}
            style={{ borderWidth: 2, borderColor: "black" }}
            value={displayTotalValue}
            validateUserInput={false}
          />
          <CustomUserInput
            label="Expected"
            onBlur={handleExpectedValue}
            validateUserInput={false}
            style={{ borderWidth: 2 }}
          />
          <CustomUserInput
            label="Difference"
            allowInput={false}
            style={{ borderWidth: 1, borderColor: handleDifferenceBorder() }}
            value={displayDifference}
            validateUserInput={false}
          />
        </View>
        <Pressable
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            margin: 10,
            marginRight: 20,
            maxWidth: 80,
            height: 30,
            borderWidth: 1,
            borderRadius: 10,
          }}
          onPress={() => {
            console.log("sup");
          }}
        >
          <Text>Clear</Text>
        </Pressable>
      </View>
      {/* </TouchableWithoutFeedback> */}
    </Fragment>
  );
}
