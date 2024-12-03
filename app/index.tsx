import { LinearGradient } from "expo-linear-gradient";
import UserInputList from "../components/user-inputs/UserInputList";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export default function Index() {
  return (
    <LinearGradient colors={Colors.defaultGradient} style={styles.container}>
      <UserInputList />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
