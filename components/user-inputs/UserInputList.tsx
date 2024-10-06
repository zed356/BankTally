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

const UserInputList: React.FC = () => {
  const [values, setValues] = useState(defaultValues);
  const [showErrorModal, setShowErrorModal] = useState(false);

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

  // styles

  const opacity = useSharedValue(1); // initial opacity

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  // make button slightly transparent on press
  const handlePressIn = () => {
    opacity.value = withTiming(0.5, { duration: 100 });
  };

  // reset opacity of button
  const handlePressOut = () => {
    setTimeout(() => {
      opacity.value = withTiming(1, { duration: 100 });
    }, 100);
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
      marginRight: 15,
      height: "95%",
    },
    buttonContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      margin: 10,
      marginRight: 20,
      maxWidth: 80,
      height: 30,
      borderWidth: 1,
      borderRadius: 10,
      userSelect: "none",
      backgroundColor: "#D1D9DF",
    },
    clearButton: {
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
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
      <Animated.View style={[styles.buttonContainer, animatedStyle]}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.clearButton}
          onPress={() => {
            clearSetValues();
          }}
        >
          <Text>Clear</Text>
        </Pressable>
      </Animated.View>
      <ErrorModal
        modalVisible={showErrorModal}
        closeErrorModal={() => {
          setShowErrorModal(false);
        }}
      />
    </View>
  );
};

export default UserInputList;
