import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

import { BannerAdComponent } from "@/components/BannerAdComponent";
import { Header } from "@/components/Header";
import SpinResultModal from "@/components/SpinResultModal";
import { useSpinWheelAds } from "@/hooks/useSpinWheelAds";
import Wheel from "../components/Wheel";

import { WheelSegment } from "../types";

export default function SpinHere() {
  const [spinning, setSpinning] = useState(false);
  const [target, setTarget] = useState<WheelSegment | null>(null);
  const [pressed, setPressed] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [rewardValue, setRewardValue] = useState("");
  const [canSpin, setCanSpin] = useState(false);
  const [showCooldownModal, setShowCooldownModal] = useState(false);
  const [cooldownMinutes, setCooldownMinutes] = useState(0);

  const navigation = useNavigation();
  const {
    showRewardedWithCooldown,
    showRewardedInterstitialWithCooldown,
    getRewardedRemainingMs,
  } = useSpinWheelAds();

  const segments: WheelSegment[] = [
    { id: 1, label: "Free", color: "#F87171", textColor: "#fff", weight: 20 },
    { id: 2, label: "1", color: "#60A5FA", textColor: "#fff", weight: 25 },
    { id: 3, label: "10", color: "#34D399", textColor: "#fff", weight: 2 },
    { id: 4, label: "20", color: "#A78BFA", textColor: "#fff", weight: 5 },
    { id: 5, label: "50", color: "#FBBF24", textColor: "#fff", weight: 0 },
    { id: 6, label: "100", color: "#EC4899", textColor: "#fff", weight: 0 },
    { id: 7, label: "200", color: "#6366F1", textColor: "#fff", weight: 0 },
  ];

  const pickWeightedRandom = (items: WheelSegment[]) => {
    const total = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * total;

    for (let item of items) {
      if (random < item.weight) return item;
      random -= item.weight;
    }
    return items[0];
  };

  const startSpin = () => {
    const selected = pickWeightedRandom(segments);
    // console.log(target,'start')
    setTarget(selected);
    setSpinning(true);
  };

  

  return (
    <LinearGradient
      // colors={["#20106B", "#110736"]}
      colors={["#ca8080ff", "#E53935"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1, paddingHorizontal: scale(16) }}
    >
      <StatusBar style="light" backgroundColor="#20106B" />

      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Try your luck!" />

        {/* Banner Image */}
        <Image
          source={{ uri: "https://picsum.photos/400/120" }}
          style={{
            width: "100%",
            height: 100,
            borderRadius: 10,
            marginBottom: 20,
          }}
        />

        <View style={styles.container}>
          <Wheel
            segments={segments}
            spinning={spinning}
            targetSegment={target}
            onSpinEnd={() => {
              setSpinning(false);
              setRewardValue(target?.label ?? "");
              setShowResult(true);
            }}
          />

          <SpinResultModal
            visible={showResult}
            reward={rewardValue}
            onClose={() => {
              setShowResult(false);
              navigation.goBack();
            }}
          />
          {/* Cooldown Modal */}
          <Modal
            visible={showCooldownModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowCooldownModal(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.6)",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 20,
              }}
            >
              <View
                style={{
                  backgroundColor: "#ffffff",
                  width: "80%",
                  paddingVertical: 25,
                  paddingHorizontal: 20,
                  borderRadius: 18,
                  alignItems: "center",
                  elevation: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "700",
                    color: "#E53935",
                    marginBottom: 12,
                  }}
                >
                  Please Wait
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    color: "#444",
                    textAlign: "center",
                    marginBottom: 25,
                  }}
                >
                  You can try spinning again in {cooldownMinutes} minute(s).
                </Text>

                <Pressable
                  onPress={() => setShowCooldownModal(false)}
                  style={{
                    backgroundColor: "#E53935",
                    paddingVertical: 10,
                    paddingHorizontal: 30,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                    OK
                  </Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Pressable
            disabled={spinning}
            onPress={async () => {
              if (!canSpin) {
                const res = await getRewardedRemainingMs();
                if (res) {
                  console.log("here");
                  const minutes = Math.ceil(res / 60000);
                  setCooldownMinutes(minutes);
                  setShowCooldownModal(true);
                  return false;
                }
                const res1 = await showRewardedWithCooldown();
                if (!res1) {
                  
                  const res2 = await showRewardedInterstitialWithCooldown();
                  if (!res2) return;
                }
                setCanSpin(true);
                return;
              } else {
                startSpin();
                setCanSpin(false);
              }
            }}
            onPressIn={() => !spinning && setPressed(true)}
            onPressOut={() => setPressed(false)}
            style={{ width: 300, marginTop: 40, opacity: spinning ? 0.5 : 1 }}
          >
            <LinearGradient
              colors={
                spinning
                  ? ["#f0e4e4ff", "#A1A1A1"]
                  : pressed
                  ? ["#FFC300", "#E0A200"]
                  : ["#FFDD00", "#FFB800"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btn}
            >
              <Text style={styles.btnText}>{"SPIN NOW"}</Text>
              <Text
                style={[
                  styles.btnText,
                  {
                    color:"#A1A1A1",
                    fontSize: moderateScale(8),
                    marginTop: 4,
                    opacity: 0.8,
                    position: "absolute",
                    top: -2,
                  },
                ]}
              >
                {canSpin ? "Ready!" : "Ad required"}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
        <BannerAdComponent />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    paddingVertical: verticalScale(60),
    alignItems: "center",
  },
  btn: {
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
