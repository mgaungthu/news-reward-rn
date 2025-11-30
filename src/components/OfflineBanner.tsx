import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";

export default function OfflineBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const slideAnim = new Animated.Value(-60);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = !state.isConnected || !state.isInternetReachable;

      if (offline) {
        setIsVisible(true);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(slideAnim, {
          toValue: -60,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setIsVisible(false));
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View
        style={{
          backgroundColor: "#E53935",
          paddingVertical: 10,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ color: "white", fontWeight: "600", textAlign: "center" }}>
          You're offline — check your internet connection
        </Text>
      </View>
    </Animated.View>
  );
}