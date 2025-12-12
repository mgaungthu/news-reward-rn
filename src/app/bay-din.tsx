import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Svg, { Circle, Defs, Path, Rect, Stop, LinearGradient as SvgLinearGradient, Text as SvgText } from "react-native-svg";

import { BannerAdComponent } from "@/components/BannerAdComponent";
import { CustomModal } from "@/components/CustomModal";
import { Header } from "@/components/Header";

const zodiacList = [
  { id: 1, name: "General Luck", emoji: "✨" },
  { id: 2, name: "Career", emoji: "💼" },
  { id: 3, name: "Love", emoji: "❤️" },
  { id: 4, name: "Health", emoji: "💊" },
  { id: 5, name: "Money", emoji: "💰" },
  { id: 6, name: "Fortune", emoji: "🔮" },
];

function renderIcon(id: number) {
  switch (id) {
    case 1: // General Luck (3D Star)
      return (
        <Svg width={56} height={56} viewBox="0 0 64 64">
          <Defs>
            <SvgLinearGradient id="gradStar" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FFF59D" />
              <Stop offset="100%" stopColor="#FBC02D" />
            </SvgLinearGradient>
            <SvgLinearGradient id="starShadow" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#00000033" />
              <Stop offset="100%" stopColor="#00000000" />
            </SvgLinearGradient>
          </Defs>
          <Path
            d="M32 4l8 18h20l-16 12 6 18-18-10-18 10 6-18L4 22h20z"
            fill="url(#gradStar)"
          />
          <Path
            d="M32 4l8 18h20l-16 12z"
            fill="url(#starShadow)"
          />
        </Svg>
      );

    case 2: // Career (3D Briefcase)
      return (
        <Svg width={56} height={56} viewBox="0 0 64 64">
          <Defs>
            <SvgLinearGradient id="gradCase" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#64B5F6" />
              <Stop offset="100%" stopColor="#1E88E5" />
            </SvgLinearGradient>
          </Defs>
          <Rect
            x="10"
            y="20"
            width="44"
            height="30"
            rx="6"
            fill="url(#gradCase)"
          />
          <Rect x="24" y="12" width="16" height="8" rx="2" fill="#1565C0" />
          <Circle cx="32" cy="35" r="4" fill="#fff" />
        </Svg>
      );

    case 3: // Love (3D Heart Glossy)
      return (
        <Svg width={56} height={56} viewBox="0 0 64 64">
          <Defs>
            <SvgLinearGradient id="gradHeart" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FF8FA3" />
              <Stop offset="100%" stopColor="#E91E63" />
            </SvgLinearGradient>
            <SvgLinearGradient id="heartGloss" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#ffffff99" />
              <Stop offset="80%" stopColor="#ffffff00" />
            </SvgLinearGradient>
          </Defs>

          <Path
            d="M32 56s-22-14-22-30c0-10 8-16 16-16 4 0 8 2 10 6 2-4 6-6 10-6 8 0 16 6 16 16 0 16-22 30-22 30z"
            fill="url(#gradHeart)"
          />
          <Path
            d="M22 18c6-4 20-2 24 4"
            stroke="url(#heartGloss)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 4: // Health (3D Shield + Cross)
      return (
        <Svg width={56} height={56} viewBox="0 0 64 64">
          <Defs>
            <SvgLinearGradient id="gradShield" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#A5D6A7" />
              <Stop offset="100%" stopColor="#43A047" />
            </SvgLinearGradient>
          </Defs>

          <Path
            d="M32 4L44 10v12c0 14-12 26-12 26S20 36 20 22V10z"
            fill="url(#gradShield)"
          />
          <Rect x="28" y="18" width="8" height="20" rx="2" fill="#fff" />
          <Rect x="22" y="26" width="20" height="8" rx="2" fill="#fff" />
        </Svg>
      );

    case 5: // Money (3D Coin)
      return (
        <Svg width={56} height={56} viewBox="0 0 64 64">
          <Defs>
            <SvgLinearGradient id="goldCoin" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FFF176" />
              <Stop offset="100%" stopColor="#FBC02D" />
            </SvgLinearGradient>
            <SvgLinearGradient id="coinShadow" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#00000022" />
              <Stop offset="100%" stopColor="#00000000" />
            </SvgLinearGradient>
          </Defs>

          <Circle cx="32" cy="32" r="20" fill="url(#goldCoin)" />
          <Circle cx="32" cy="32" r="20" fill="url(#coinShadow)" />
          <SvgText
            x="32"
            y="38"
            fontSize="20"
            fontWeight="700"
            fill="#fff"
            textAnchor="middle"
          >
            $
          </SvgText>
        </Svg>
      );

    case 6: // Fortune (Crystal Ball 3D)
      return (
        <Svg width={56} height={56} viewBox="0 0 64 64">
          <Defs>
            <SvgLinearGradient id="gradBall" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#CE93D8" />
              <Stop offset="100%" stopColor="#8E24AA" />
            </SvgLinearGradient>
            <SvgLinearGradient id="ballGloss" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#ffffffaa" />
              <Stop offset="70%" stopColor="#ffffff00" />
            </SvgLinearGradient>
          </Defs>

          <Circle cx="32" cy="28" r="18" fill="url(#gradBall)" />
          <Circle cx="26" cy="20" r="6" fill="url(#ballGloss)" />
          <Rect x="20" y="44" width="24" height="8" rx="3" fill="#4A148C" />
        </Svg>
      );

    default:
      return null;
  }
}

const results = [
  "You will accomplish your tasks successfully today.",
  "Good fortune will come to you this morning.",
  "A friend will support you today.",
  "You will receive a small amount of money soon.",
  "You will have a peaceful and calm day.",
  "Good luck is on your side today.",
  "You may receive an unexpected gift.",
];

export default function BayDinScreen() {
  const [modalText, setModalText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const getRandomResult = () => {
    const pick = results[Math.floor(Math.random() * results.length)];
    setModalText(pick);
    setModalVisible(true);
  };

  return (
    <LinearGradient
      colors={["#ca8080", "#E53935"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Header title="Bay Din" />
          <Text style={styles.title}>Today’s Fortune</Text>
          <Text style={styles.subtitle}>
            Choose a category to reveal your fortune ✨
          </Text>

          <View style={styles.grid}>
            {zodiacList.map((item) => (
              <Pressable
                key={item.id}
                onPress={getRandomResult}
                style={styles.card}
              >
                <View style={{ marginBottom: verticalScale(8) }}>
                  {renderIcon(item.id)}
                </View>
                <Text style={styles.cardText}>{item.name}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <CustomModal
          visible={modalVisible}
          message={modalText}
          type="info"
          onClose={() => setModalVisible(false)}
        />

        <BannerAdComponent/>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: scale(16),
    paddingBottom: scale(40),
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: "700",
    color: "#fff",
    marginBottom: verticalScale(6),
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: "#FFE4E4",
    marginBottom: verticalScale(20),
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    height: verticalScale(110),
    backgroundColor: "#ffffff33",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(14),
    borderWidth: 1,
    borderColor: "#ffffff55",
  },
  cardText: {
    fontSize: moderateScale(15),
    color: "#fff",
    marginTop: verticalScale(8),
    fontWeight: "600",
  },
});
