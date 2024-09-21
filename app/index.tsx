import { Fragment, useState } from "react";
import { Text, View } from "react-native";

import CustomUserInput from "./components/CustomUserInput";

export default function Index() {
  const [values, setValues] = useState({
    "£20": 0,
    "£10": 0,
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
    .toString();

  const displayDifference = (Number(displayTotalValue) - expectedValue).toString();

  const handleDifferenceBorder = () => {
    const temp = Number(displayDifference);
    if (temp > 0) {
      return "blue";
    } else if (temp < 0) {
      return "red";
    } else {
      return "green";
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
            width: 125,
            paddingLeft: 0,
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
            style={{ borderWidth: 1, borderColor: "black" }}
            value={displayTotalValue}
            validateUserInput={false}
          />
          <CustomUserInput
            label="Expected"
            onBlur={handleExpectedValue}
            validateUserInput={false}
          />
          <CustomUserInput
            label="Difference"
            allowInput={false}
            style={{ borderWidth: 1, borderColor: handleDifferenceBorder() }}
            value={displayDifference}
            validateUserInput={false}
          />
        </View>
      </View>
    </Fragment>
  );
}
