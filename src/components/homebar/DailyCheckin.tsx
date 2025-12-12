import React, { useEffect } from "react";
import Animated, {
    Easing,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path, Rect } from "react-native-svg";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function DailyCheckInIcon({ size = 72 }) {
  const scale = useSharedValue(1);
  const badgeScale = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // stronger breathing + rotation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    rotate.value = withRepeat(
      withSequence(
        withTiming(4, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(-4, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // badge pop
    badgeScale.value = withDelay(
      800,
      withSequence(
        withTiming(1.25, { duration: 300 }),
        withTiming(1, { duration: 200 })
      )
    );
  }, []);

  const aStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const badgeAnimatedProps = useAnimatedProps(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  return (

      <Animated.View style={aStyle}>
        <AnimatedSvg width={size} height={size} viewBox="0 0 100 100">
          {/* Background circle */}
          <Circle cx="50" cy="50" r="45" fill="#10B981" />

          {/* Calendar body */}
          <Rect x="28" y="34" width="44" height="38" rx="6" fill="white" />

          {/* top bar */}
          <Rect x="28" y="28" width="44" height="8" rx="4" fill="#059669" />

          {/* left ring */}
          <Circle cx="36" cy="30" r="3.5" fill="white" />
          <Circle cx="64" cy="30" r="3.5" fill="white" />

          {/* check mark */}
          <Path
            d="M40 56 L48 64 L63 49"
            stroke="#10B981"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* badge (animated) */}
          <AnimatedCircle
            cx="75"
            cy="25"
            r="10"
            fill="#EF4444"
            animatedProps={badgeAnimatedProps}
          />
          <Path
            d="M71 22 L74 26 L79 19"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </AnimatedSvg>
      </Animated.View>
   
  );
}