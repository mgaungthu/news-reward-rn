import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import LottieView from "lottie-react-native";

interface SpinResultModalProps {
  visible: boolean;
  onClose: () => void;
  reward: string | number;
}

export default function SpinResultModal({
  visible,
  onClose,
  reward,
}: SpinResultModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Animated.View 
        entering={FadeIn.duration(300)} 
        exiting={FadeOut.duration(300)} 
        style={styles.overlay}
      >
        {/* Fireworks animation */}
        <LottieView
          source={require("../../assets/firework.json")}
          autoPlay
          loop={false}
          style={{ width: 250, height: 250, position: "absolute", top: 80 }}
        />

        <View style={styles.modalBox}>
          <Text style={styles.title}>Congratulations!</Text>
          <Text style={styles.rewardText}>{reward} Points</Text>

          <Pressable style={styles.btn} onPress={onClose}>
            <Text style={styles.btnText}>OK</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalBox: {
    width: "100%",
    paddingVertical: 28,
    paddingHorizontal: 22,
    borderRadius: 20,
    backgroundColor: "#de1b1bff",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(250, 204, 21, 0.4)",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
    color: "#FACC15",
    textAlign: "center",
  },
  rewardText: {
    fontSize: 34,
    fontWeight: "900",
    color: "#FFFFFF",
    marginVertical: 16,
    textAlign: "center",
  },
  btn: {
    marginTop: 4,
    backgroundColor: "#FACC15",
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 999,
    minWidth: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#1F2937",
    fontSize: 16,
    fontWeight: "700",
  },
});