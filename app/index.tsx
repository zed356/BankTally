import { Fragment, useState, useEffect } from "react";
import { Keyboard, Pressable, Text, TouchableWithoutFeedback, View } from "react-native";

import CustomUserInput from "./components/CustomUserInput";
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";

export interface ICurrencyObject {
  "£20": string;
  "£10": string;
  "£5": string;
  "£2": string;
  "£1": string;
  "50p": string;
  "20p": string;
  "10p": string;
  "5p": string;
  "2p": string;
  "1p": string;
  Expected: string;
  Difference: string;
  Total: string;
}

const defaultValues: ICurrencyObject = {
  "£20": "",
  "£10": "",
  "£5": "",
  "£2": "",
  "£1": "",
  "50p": "",
  "20p": "",
  "10p": "",
  "5p": "",
  "2p": "",
  "1p": "",
  Expected: "",
  Difference: "",
  Total: "",
};

export default function Index() {
  const [values, setValues] = useState<ICurrencyObject>(defaultValues);
  const { getItem, setItem } = useAsyncStorage("values");

  const readItemFromStorage = async () => {
    const item = await getItem();
    const res = item != null ? JSON.parse(item) : defaultValues;
    setValues(res);
  };

  const writeItemToStorage = async (values: ICurrencyObject) => {
    await setItem(JSON.stringify(values));
  };

  // loads old data if there is any upon app start
  useEffect(() => {
    readItemFromStorage();
  }, []);

  const handleValues = (target: string, value: string) => {
    const newValues = {
      ...values,
      [target]: value,
    };
    writeItemToStorage(newValues);
    setValues(newValues);
  };

  const clearSetValues = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.log("oops");
    }
    setValues(defaultValues);
  };

  const displayTotalValue = Object.entries(values).reduce((acc, cur) => {
    let temp = acc;
    if (cur[0] != "Expected" && cur[0] != "Difference" && cur[0] != "Total") {
      temp = acc + +cur[1];
    }
    return temp;
  }, 0);

  const displayDifference = (displayTotalValue - +values.Expected).toFixed(2);

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
      {/* hides keyboard if pressing empty elements */}
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
          <CustomUserInput label="£20" onBlur={handleValues} values={values} />
          <CustomUserInput label="£10" onBlur={handleValues} values={values} />
          <CustomUserInput label="£5" onBlur={handleValues} values={values} />
          <CustomUserInput label="£2" onBlur={handleValues} values={values} />
          <CustomUserInput label="£1" onBlur={handleValues} values={values} />
          <CustomUserInput label="50p" onBlur={handleValues} values={values} />
          <CustomUserInput label="20p" onBlur={handleValues} values={values} />
          <CustomUserInput label="10p" onBlur={handleValues} values={values} />
          <CustomUserInput label="5p" onBlur={handleValues} values={values} />
          <CustomUserInput label="2p" onBlur={handleValues} values={values} />
          <CustomUserInput label="1p" onBlur={handleValues} values={values} />
          <CustomUserInput
            label="Total"
            allowInput={false}
            style={{ borderWidth: 2, borderColor: "black" }}
            value={displayTotalValue.toString()}
            validateUserInput={false}
            values={values}
          />
          <CustomUserInput
            label="Expected"
            onBlur={handleValues}
            validateUserInput={false}
            style={{ borderWidth: 2 }}
            values={values}
          />
          <CustomUserInput
            label="Difference"
            allowInput={false}
            style={{ borderWidth: 1, borderColor: handleDifferenceBorder() }}
            value={displayDifference}
            validateUserInput={false}
            values={values}
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
            clearSetValues();
          }}
        >
          <Text>Clear</Text>
        </Pressable>
      </View>
      {/* </TouchableWithoutFeedback> */}
    </Fragment>
  );
}
