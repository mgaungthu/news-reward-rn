// LuckyWheelIcon.jsx
import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function LuckyWheelIcon({ size = 84, spinning = true }) {
  const rotate = useSharedValue(0);
  const pointerBounce = useSharedValue(0);

  useEffect(() => {
    if (spinning) {
      rotate.value = withRepeat(
        withTiming(360, { duration: 3000, easing: Easing.linear }),
        -1,
        false
      );
      pointerBounce.value = withRepeat(
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      rotate.value = withTiming(0);
      pointerBounce.value = withTiming(0);
    }
  }, [spinning]);

  const svgStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  const pointerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -2 * pointerBounce.value }],
  }));

  return (
    <View>
      <Animated.View
        style={[
          svgStyle,
          {
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: 6,
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 100 100">
          {/* 7 equal slices */}
          <Path d="M50 50 L50 0 A50 50 0 0 1 90 19 Z" fill="#F43F5E" />
          <Path d="M50 50 L90 19 A50 50 0 0 1 97 63 Z" fill="#F59E0B" />
          <Path d="M50 50 L97 63 A50 50 0 0 1 71 97 Z" fill="#10B981" />
          <Path d="M50 50 L71 97 A50 50 0 0 1 29 97 Z" fill="#3B82F6" />
          <Path d="M50 50 L29 97 A50 50 0 0 1 3 63 Z" fill="#8B5CF6" />
          <Path d="M50 50 L3 63 A50 50 0 0 1 10 19 Z" fill="#EC4899" />
          <Path d="M50 50 L10 19 A50 50 0 0 1 50 0 Z" fill="#FDE047" />

          {/* outer border */}
          <Circle cx="50" cy="50" r="48" fill="none" stroke="#ffffff" strokeWidth="3" />

          {/* inner border */}
          <Circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />

          {/* center glossy button */}
          <Circle cx="50" cy="50" r="11" fill="#ffffff" />
          <Path
            d="M39 48 Q50 40 61 48 Q50 46 39 48"
            fill="rgba(0,0,0,0.08)"
          />
        </Svg>
      </Animated.View>

      {/* pointer (positioned at top center) */}
      <Animated.View style={[{ position: "absolute", left: 0, top: -6, width: size, height: size }, pointerStyle]}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Path
            d="M50 18 L38 0 L62 0 Z"
            fill="#ffffff"
            stroke="#F43F5E"
            strokeWidth="2"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}