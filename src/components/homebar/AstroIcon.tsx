import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";
import Svg, { Circle, G, Path } from "react-native-svg";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

export default function AstroIcon({ size = 84 }) {
  const outerRot = useSharedValue(0);
  const innerRot = useSharedValue(0);
  const starScale = useSharedValue(1);

  useEffect(() => {
    outerRot.value = withTiming(
      99999,
      {
        duration: 99999 * 20,
        easing: Easing.linear,
      }
    );
    innerRot.value = withTiming(
      -99999,
      {
        duration: 99999 * 30,
        easing: Easing.linear,
      }
    );
    // star twinkle
    starScale.value = withRepeat(
      withTiming(1.8, { duration: 750, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const outerAnimatedProps = useAnimatedProps(() => ({
    transform: [
      { translateX: 50 },
      { translateY: 50 },
      { rotate: `${outerRot.value}deg` },
      { translateX: -50 },
      { translateY: -50 },
    ]
  }));

  const innerAnimatedProps = useAnimatedProps(() => ({
    transform: [
      { translateX: 50 },
      { translateY: 50 },
      { rotate: `${innerRot.value}deg` },
      { translateX: -50 },
      { translateY: -50 },
    ]
  }));

  const starAnimatedProps = useAnimatedProps(() => ({
    transform: [
      { translateX: 50 },
      { translateY: 50 },
      { rotate: `${outerRot.value * 1.5}deg` },
      { scale: starScale.value },
      { translateX: -50 },
      { translateY: -50 },
    ]
  }));

  return (
    <View>
      <AnimatedSvg width={size} height={size} viewBox="0 0 100 100">
        {/* background circle */}
        <Circle cx="50" cy="50" r="45" fill="#2D0B45" />

        {/* outer orbit (animated) */}
        <AnimatedG animatedProps={outerAnimatedProps} origin="50,50">
          <Circle
            cx="50" cy="50" r="32"
            stroke="#A78BFA"
            strokeWidth="2"
            strokeDasharray="6 6"
            fill="none"
          />
        </AnimatedG>

        {/* inner orbit (animated opposite) */}
        <AnimatedG animatedProps={innerAnimatedProps} origin="50,50">
          <Circle
            cx="50" cy="50" r="22"
            stroke="#C084FC"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
          />
        </AnimatedG>

        {/* small planet (static) */}
        <Circle cx="78" cy="50" r="4" fill="#F472B6" />

        {/* moon (static) */}
        <Path d="M40 46 A9 9 0 1 0 40 64 A6 6 0 1 1 40 46 Z" fill="#FCD34D" />

        {/* star (twinkle) - we animate by wrapping in AnimatedPath */}
        <AnimatedG animatedProps={starAnimatedProps} origin="50,50">
          <Path
            d="M52 32 L54.2 36 L59 37 L55.2 40 L56 44 L52 42 L48 44 L48.8 40 L45 37 L49.8 36 Z"
            fill="#FFFFFF"
          />
        </AnimatedG>
      </AnimatedSvg>
    </View>
  );
}