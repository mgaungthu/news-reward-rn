import { resetUserClaims } from "@/api/postApi";
import { useAds } from "@/hooks/useAds";
import { useCallback } from "react";
import { Alert, Animated, Easing } from "react-native";

export function useRewardReset() {
  const {
    showRewardedWithCooldown,
    showRewardedInterstitialWithCooldown,
    getRewardedRemainingMs,
  } = useAds();

  const shakeAnim = new Animated.Value(0);

  const triggerShake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 80,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -1,
        duration: 80,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 80,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 80,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleRewardReset = useCallback(async () => {
    // Shake UI
    triggerShake();

    // Check cooldown
    const res = await getRewardedRemainingMs();
    if (res) {
      const minutes = Math.ceil(res / 60000);
      Alert.alert("Please wait", `Try again in ${minutes} minute(s).`);
      return false;
    }

    // Try Rewarded
    const success = await showRewardedWithCooldown();

    if (!success) {
      const res2 = await showRewardedInterstitialWithCooldown();
      if (res2) {
        await resetUserClaims();
        Alert.alert("Success", "Points reset completed!");
        return true;
      }
      return true;
    }

    await resetUserClaims();
    Alert.alert("Success", "Points reset completed!");
    return true;
  }, []);

  return { handleRewardReset, shakeAnim };
}