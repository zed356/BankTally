import { View, Pressable, Text, StyleSheet } from "react-native";
import CustomUserInput from "./CustomUserInput";
import { useUserInputStore } from "@/stores/UserInputContext";
import { writeItemToStorage } from "@/stores/PersistentStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    clearButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      margin: 10,
      marginRight: 20,
      maxWidth: 80,
      height: 30,
      borderWidth: 1,
      borderRadius: 10,
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
      <Pressable
        style={styles.clearButton}
        onPress={() => {
          clearSetValues();
        }}
      >
        <Text
          style={{
            userSelect: "none",
            height: "75%", // temp solution, cant figure out how to vertically align text...
          }}
        >
          Clear
        </Text>
      </Pressable>
    </View>
  );
};

export default UserInputList;
