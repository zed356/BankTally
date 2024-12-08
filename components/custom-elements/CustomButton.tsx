import { DEFAULT_BORDER_RADIUS } from "@/constants/Values";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface CustomButtonProps {
  type: "positive" | "negative" | "neutral";
  text: string;
  onPress: () => void;
  isDisabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ type, text, onPress, isDisabled = false }) => {
  const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  const handlePressIn = () => {
    cancelAnimation(opacity);
    opacity.value = withTiming(0.5);
  };

  const handlePressOut = () => {
    cancelAnimation(opacity);
    opacity.value = withTiming(1);
  };

  const textColor = useMemo(() => {
    switch (type) {
      case "positive":
        return "#ffffff";
      case "negative":
        return "#ffffff";
      case "neutral":
        return "#000000";
    }
  }, [type]);

  const gradientColors = useMemo(() => {
    switch (type) {
      case "positive":
        return ["#34c759", "#28a745"];
      case "negative":
        return ["#ff3b30", "#dc3545"];
      case "neutral":
        return ["#ffcd38", "#ffc107"];
    }
  }, [type]);

  const styles = StyleSheet.create({
    button: {
      paddingHorizontal: 20,
      paddingVertical: 5,
      borderRadius: DEFAULT_BORDER_RADIUS,
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    text: {
      color: textColor,
    },
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
    >
      <AnimatedLinearGradient colors={gradientColors} style={[styles.button, animatedStyle]}>
        <Text style={styles.text}>{text}</Text>
      </AnimatedLinearGradient>
    </Pressable>
  );
};

export default CustomButton;
