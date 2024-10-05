import { View, Pressable, Text, StyleSheet } from "react-native";
import CustomUserInput from "./CustomUserInput";
import { useUserInputStore } from "@/stores/UserInputContext";
import { writeItemToStorage } from "@/stores/PersistentStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const UserInputList: React.FC = () => {
  const userInputStore = useUserInputStore();
  const values = userInputStore.values;
  const updateValues = userInputStore.update;

  const handleValues = (target: string, value: string) => {
    const newValues = {
      ...values,
      [target]: value,
    };
    writeItemToStorage(newValues);
    updateValues(newValues);
  };

  const clearSetValues = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.log("oops");
    }
    userInputStore.clear();
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
      paddingTop: 10,
      backgroundColor: "#e7eaf6",
    },
    inputList: {
      flex: 1,
      marginLeft: 110,
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
      height: 30, // Consider using flex or dynamic sizing if necessary
      borderWidth: 1,
      borderRadius: 10,
      userSelect: "none",
      backgroundColor: "#D1D9DF",
    },
    clearButton: {
      justifyContent: "center",
      alignItems: "center",
      height: "100%", // Consider using dynamic sizing instead of fixed
      width: "100%",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputList}>
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
    </View>
  );
};

export default UserInputList;