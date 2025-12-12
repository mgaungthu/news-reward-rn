import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { HeaderBar } from "@/components/HeaderBar";
import { colors } from "@/theme";
import { moderateScale, verticalScale } from "@/utils/scale";
import AstroIconAnimated from "./homebar/AstroIcon";
import DailyCheckInIcon from "./homebar/DailyCheckin";
import LuckyWheelIcon from "./homebar/SpinWheel";

interface Props {
  colors: any;
  banner_image: string;
}

export default function HomeListHeader({ colors, banner_image }: Props) {
  const router = useRouter();

  return (
    <>
      {/* Header */}
      <HeaderBar title="Lotaya Dinga" subtitle="Stay updated & earn rewards!" />

      {/* Banner */}
      <View style={styles.banner}>
        <Image source={{ uri: banner_image }} style={styles.bannerImage} />
      </View>

      {/* Feature Row */}
      <View style={styles.row}>
        {/* Spin Wheel */}
        <Pressable
          onPress={() => router.push('/daily-check-in')}
          style={[styles.block, { backgroundColor: colors.card }]}
        >
          <View style={styles.circle}>
            <DailyCheckInIcon size={60}/>
          </View>
          <Text style={[styles.title]}>Daily Check-in</Text>
        </Pressable>

        {/* Daily Check-in */}
        <Pressable
          onPress={() => router.push("/spin-here")}
          style={[styles.block, { backgroundColor: colors.card }]}
        >
          <View style={styles.circle}>
            <LuckyWheelIcon size={60}/>
          </View>

          <Text style={[styles.title]}>Spin Wheel</Text>
        </Pressable>

        {/* Bay Din */}
        <Pressable
          onPress={() => router.push("/bay-din")}
          style={[styles.block, { backgroundColor: colors.card }]}
        >
          <View style={styles.circle}>
            <AstroIconAnimated size={60}/>
          </View>
          <Text style={[styles.title]}> Bay Din</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 10,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: verticalScale(160),
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  block: {
    width: "32%",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    flex: 1,
  },
  title: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: moderateScale(12),
  },
  desc: {
    marginTop: 4,
    fontSize: 12,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 100,
    // backgroundColor:"#f6f1f1ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    // shadowColor: "#000",
    // shadowOpacity: 0.15,
    // shadowOffset: { width: 0, height: 3 },
    // shadowRadius: 6,
    // elevation: 5,
  },
});
