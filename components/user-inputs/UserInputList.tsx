import { useEffect, useState } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { writeUserInputValuesToStorage } from "@/stores/PersistentStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { ICurrencyObject } from "@/types/UserInputTypes";
import { getUserInputValuesFromStorage } from "@/stores/PersistentStorage";
import CustomUserInput from "./CustomUserInput";
import { defaultValues } from "@/constants/DefaultUserInputValues";
import ErrorModal from "../ErrorModal";
import ThermalPrinterModule from "react-native-thermal-printer";

const UserInputList: React.FC = () => {
  const [values, setValues] = useState(defaultValues);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const displayTotalValue = Object.entries(values).reduce((acc, cur) => {
    let temp = acc;
    if (cur[0] != "Expected" && cur[0] != "Difference" && cur[0] != "Total") {
      if (cur[1] == ".") {
        temp = acc;
      } else {
        temp = acc + +cur[1];
      }
    }
    return temp;
  }, 0);
  const displayDifference = (displayTotalValue - +values.Expected).toFixed(2);

  const printerPayload =
    "[L]<font size='big'>   Cash breakdown</font>\n" +
    "\n" +
    "[L][L][L]<font size='big'>[ ]</font>" +
    "[C][C][C][C][C][C]<font size='big'>20</font>" +
    "[R][R][R][R][R][R]<font size='big'>200</font>";

  const clearButtonOpacity = useSharedValue(1); // initial opacity
  const printButtonOpacity = useSharedValue(1); // initial opacity

  const clearButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: clearButtonOpacity.value,
    };
  });

  const printButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: printButtonOpacity.value,
    };
  });

  // loads old data if there is any upon app start
  useEffect(() => {
    (async () => {
      try {
        setValues(await getUserInputValuesFromStorage());
      } catch (error) {
        setShowErrorModal(true);
      }
    })();
  }, []);

  const handlePrint = async () => {
    // initialize printer connection; first run will ask for permission
    ThermalPrinterModule.getBluetoothDeviceList();

    // keys under [0], values under [1]
    const valuesToArray = Object.entries(values);

    // filter out values that are not in the inputLabels array
    const valuesWithoutDifferenceTotalExpected = valuesToArray.filter((value) =>
      inputLabels.includes(value[0])
    );

    // filter out values that are empty and apply markdown to the rest
    const tempPayload = valuesWithoutDifferenceTotalExpected
      .map((value) => {
        if (value[1].length > 0) {
          let denomination;
          if (value[0][0] == "£") {
            denomination = value[0].slice(1);
          } else {
            denomination = value[0];
          }
          return (
            "[L]<font size='big'>[ ]</font>" +
            `[C]<font size='big'>${denomination}</font>` +
            `[R][R]<font size='big'>${value[1]}</font>`
          );
        }
      })
      .filter((value) => value != undefined);

    // add title
    tempPayload.unshift("[L]<font size='big'> Cash breakdown</font>\n");

    // add total
    tempPayload.push(
      "[C]<font size='big'> Total:</font>" +
        `[R]<font size='big'>  ${displayTotalValue.toString()}</font>\n` +
        "\n" +
        "\n" +
        "\n" +
        `.`
    );

    // join all elements with a newline
    const payload = tempPayload.join("\n" + "\n");

    try {
      await ThermalPrinterModule.printBluetooth({
        payload: payload,
        printerNbrCharactersPerLine: 30,
      });
    } catch (e) {
      console.log("error printing");
    }
  };

  const handleValues = (target: keyof ICurrencyObject, value: string) => {
    const newValues = {
      ...values,
      [target]: value,
    };
    writeUserInputValuesToStorage(newValues);
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      paddingTop: 35,
      backgroundColor: "#e7eaf6",
    },
    inputList: {
      flex: 1,
      marginLeft: 105,
      marginRight: 0,
      height: "95%",
    },
    buttonsContainer: {
      flex: 1,
      justifyContent: "space-around",
      alignItems: "center",
      width: "100%",
    },

    button: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: 30,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderRadius: 10,
      userSelect: "none",
      backgroundColor: "#D1D9DF",
    },
  });

  const inputLabels = ["£20", "£10", "£5", "£2", "£1", "50p", "20p", "10p", "5p", "2p", "1p"];

  return (
    <View style={styles.container}>
      <View style={styles.inputList}>
        {inputLabels.map((label, index) => (
          <CustomUserInput key={index} label={label} onBlur={handleValues} values={values} />
        ))}
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
      <View style={styles.buttonsContainer}>
        <Animated.View style={[clearButtonAnimatedStyle]}>
          <Pressable
            onPressIn={() => (clearButtonOpacity.value = withTiming(0.5, { duration: 100 }))}
            onPressOut={() => (clearButtonOpacity.value = withTiming(1, { duration: 100 }))}
            style={styles.button}
            onPress={() => {
              clearSetValues();
            }}
          >
            <Text>Clear</Text>
          </Pressable>
        </Animated.View>
        <Animated.View style={[printButtonAnimatedStyle]}>
          <Pressable
            style={styles.button}
            onPressIn={() => (printButtonOpacity.value = withTiming(0.5, { duration: 100 }))}
            onPressOut={() => (printButtonOpacity.value = withTiming(1, { duration: 100 }))}
            onPress={handlePrint}
          >
            <Text>Print</Text>
          </Pressable>
        </Animated.View>
      </View>
      <ErrorModal
        modalVisible={showErrorModal}
        errorMessage={`Failed to load data from storage.\nAll fields reset.`}
        closeErrorModal={() => {
          setShowErrorModal(false);
        }}
      />
    </View>
  );
};

export default UserInputList;
