import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";
import { WheelSegment } from "../types";

interface WheelProps {
  segments: WheelSegment[];
  spinning: boolean;
  targetSegment: WheelSegment | null;
  onSpinEnd: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export default function Wheel({
  segments,
  spinning,
  targetSegment,
  onSpinEnd,
}: WheelProps) {
  const rotation = useSharedValue(0);

  // SVG Geometry
  const radius = 50;
  const center = 50;
  const sliceAngle = 360 / segments.length;

  const getPoint = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent) * radius;
    const y = Math.sin(2 * Math.PI * percent) * radius;
    return [x, y];
  };

  useEffect(() => {
    if (spinning && targetSegment) {
      const winnerIndex = segments.findIndex((s) => s.id === targetSegment.id);

      console.log(targetSegment);

      const segmentCenterAngle = winnerIndex * sliceAngle + sliceAngle / 2;

      const baseSpin = rotation.value + 360 * 8; // ensures long spin every time
      const targetRotation = baseSpin + (360 - segmentCenterAngle) - 90;

      console.log(baseSpin)

      rotation.value = withTiming(
        targetRotation,
        {
          duration: 8000,
          easing: Easing.bezier(0.2, 0.8, 0.2, 1),
        }
      );

      // SAFELY call JS after animation duration (Prevents Reanimated crash)
      setTimeout(() => {
        onSpinEnd();
        rotation.value = targetRotation % 360;
      }, 8000);
    }
  }, [spinning, targetSegment]);

  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      {/* Pointer */}
      <View style={styles.pointerContainer}>
        <Svg
          width={70}
          height={40}
          viewBox="0 0 30 40"
          style={{ transform: [{ rotate: "180deg" }] }}
        >
          <Path
            d="M15 0 L28 28 L2 28 Z"
            fill="#FFC900"
            stroke="#FFC900"
            strokeWidth="2"
          />
        </Svg>
      </View>
      {/* Wheel */}
      <AnimatedView style={[styles.wheel, wheelStyle]}>
        <Svg viewBox="0 0 100 100" width="100%" height="100%">
          {/* Outer Border */}
          <Path
            d="M50 2 A48 48 0 1 1 49.9 2"
            stroke="#2E2E8A"
            strokeWidth="5"
            fill="#2E2E8A"
          />

          {/* Wheel Slices */}
          {segments.map((seg, index) => {
            const startAngle = index * sliceAngle;
            const endAngle = (index + 1) * sliceAngle;

            const [sx, sy] = getPoint(startAngle / 360);
            const [ex, ey] = getPoint(endAngle / 360);

            const largeArcFlag = sliceAngle > 180 ? 1 : 0;

            const pathData = `
              M 50 50
              L ${50 + sx} ${50 + sy}
              A 48 48 0 ${largeArcFlag} 1 ${50 + ex} ${50 + ey}
              Z
            `;

            const fillColor = seg.color;

            const midAngle = startAngle + sliceAngle / 2;
            const textRadius = 30;

            const textX =
              50 + Math.cos((midAngle * Math.PI) / 180) * textRadius;
            const textY =
              50 + Math.sin((midAngle * Math.PI) / 180) * textRadius;

            return (
              <G key={seg.id}>
                <Path
                  d={pathData}
                  fill={fillColor}
                  stroke="#19204A"
                  strokeWidth="0.5"
                />
                <SvgText
                  x={textX}
                  y={textY}
                  fill="#FFFFFF"
                  fontSize="5"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {seg.label}
                </SvgText>
              </G>
            );
          })}

          {/* Center Hub */}
          <Path
            d="M50 44 A6 6 0 1 1 49.9 44"
            fill="#1F1F1F"
            stroke="#FFC900"
            strokeWidth="1.5"
          />
        </Svg>
      </AnimatedView>

      {/* Center Button */}
      <View style={styles.centerCap}>
        <Pressable style={styles.centerButton}>
          <View />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 320,
    alignItems: "center",
    justifyContent: "center",
  },
  pointerContainer: {
    position: "absolute",
    top: -18,
    zIndex: 10,
    alignItems: "center",
  },
  wheel: {
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 3,
    borderColor: "#800080",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  centerCap: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 16,
    backgroundColor: "#FFC900",
    borderWidth: 3,
    borderColor: "#1e293b",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  centerButton: {
    width: 16,
    height: 16,
    borderRadius: 16,
  },
});
