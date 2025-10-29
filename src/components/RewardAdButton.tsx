import { useAds } from "@/hooks/useAds";
import { useTheme } from "@/theme/ThemeProvider";
import React, { useCallback } from "react";
import { Alert, Pressable, Text } from "react-native";

export const RewardAdButton = () => {
  const { showRewardedWithCooldown } = useAds();
  const { colors } = useTheme();

  const handlePress = useCallback(async () => {
    const success = await showRewardedWithCooldown(
      (amount, type) => {
        Alert.alert("🎉 Reward Earned!", `You earned ${amount} ${type ?? "points"}!`);
      },
      (msRemaining) => {
        const minutes = Math.ceil(msRemaining / 60000);
        Alert.alert("⏳ Please wait", `Try again in ${minutes} minute(s).`);
      }
    );

    if (!success) {
      console.log("Reward ad not shown yet (maybe cooling down or loading)");
    }
  }, [showRewardedWithCooldown]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignItems: "center",
        opacity: pressed ? 0.8 : 1,
        marginVertical: 10,
      })}
    >
      <Text style={{ color: "#fff", fontWeight: "600" }}>🎁 Watch Ad to Earn Reward</Text>
    </Pressable>
  );
};