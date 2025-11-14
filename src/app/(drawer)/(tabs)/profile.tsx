
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image, RefreshControl, ScrollView, StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { resetUserClaims } from "@/api/postApi";
import { HeaderBar } from "@/components/HeaderBar";
import { useAuth } from "@/context/AuthContext";
import { useAds } from "@/hooks/useAds";
import { useTheme } from "@/theme/ThemeProvider";
import { isTablet } from "@/utils/lib";
import { moderateScale, scale, verticalScale } from "@/utils/scale";

export default function Profile() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isLoggedIn, logout, user, loading, getUser } = useAuth();
  const { showRewardedWithCooldown } = useAds();
  const [refreshing, setRefreshing] = useState(false);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  useEffect(() => {
    if (isLoggedIn) {
      getUser();
    }
  }, [isLoggedIn]);

  const handlePress = useCallback(async () => {
    const success = await showRewardedWithCooldown(
      async (amount, type) => {
        Alert.alert("Now, You`re ready to get new points!");
      },
      (msRemaining) => {
        const minutes = Math.ceil(msRemaining / 60000);
        Alert.alert("Please wait", `Try again in ${minutes} minute(s).`);
      }
    );
    if (success) {
      await resetUserClaims();
      Alert.alert("Now, You`re ready to get new points!");
    }
  }, [showRewardedWithCooldown]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getUser();
    setRefreshing(false);
  };

  if (isLoggedIn) {
    return (
      <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: scale(16),
      }}
    >
      <HeaderBar
        title="Profile"
        subtitle="Your profile status"
      />
        <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          {/* Avatar */}
          <View style={styles.avatar}>
            <Image
              source={require('../../../../assets/images/logoinapp.png')}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>

          {/* Name and Email */}
          <Text style={[styles.name, { color: colors.text }]}>
            {user?.name || "Guest User"}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>
            {user?.email || "Earn points and unlock"}
          </Text>

          {/* Stats Section */}
          <View style={styles.statsRow}>
            <View style={styles.statsItem}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: colors.primary,
                }}
              >
                {Math.floor(Number(user?.points ?? 0))}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  marginTop: 4,
                }}
              >
                Points
              </Text>
            </View>

            {/* Divider Line */}
            <View
              style={{
                width: 1,
                backgroundColor: colors.textSecondary,
                opacity: 0.3,
                marginHorizontal: 10,
              }}
            />

            <TouchableOpacity
              onPress={() => router.push("/edit-profile")}
              style={styles.statsItem}
            >
              <Ionicons
                name="create-outline"
                size={22}
                color={colors.primary}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  marginTop: 4,
                }}
              >
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>

          {/* Referral Box */}
          <View
            style={{
              width: "100%",
              padding: scale(10),
              borderRadius: scale(10),
              backgroundColor: colors.cardBackground,
              // marginBottom: verticalScale(10),
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.primary,
                marginBottom: verticalScale(8),
              }}
            >
              Your Referral Link
            </Text>

            <TouchableOpacity
              onPress={async () => {
                const link = `https://lotaya.mandalayads.io/register?ref=${user?.referral_code}`;
                await Clipboard.setStringAsync(link);
                Alert.alert(
                  "Copied!",
                  "Your referral link has been copied to clipboard."
                );
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.primary,
                borderRadius: scale(8),
                paddingVertical: verticalScale(8),
                paddingHorizontal: scale(12),
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 14,
                  flexShrink: 1,
                }}
              >
                https://lotaya.mandalayads.io/register?ref={user?.referral_code}
              </Text>
              <Ionicons
                name="copy-outline"
                size={18}
                color={colors.primary}
                style={{ marginLeft: scale(6) }}
              />
            </TouchableOpacity>
          </View>

          {/* Reset Claims Button */}
          <TouchableOpacity
            onPress={async () => {
              try {
                handlePress();
                // const res = await resetUserClaims();
                // alert(res.message || "Claims and points have been reset.");
              } catch (err: any) {
                alert(err.message || "Failed to reset claims.");
              }
            }}
            style={[styles.resetButton, { backgroundColor: colors.secondary }]}
          >
            <Text style={[styles.resetText, { color: colors.background }]}>
              Reset your points
            </Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={logout}
            style={[styles.logoutButton, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.logoutText, { color: colors.background }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
      
    );
  }

  // 🚪 Guest View
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: scale(16),
      }}
    >
      <HeaderBar
        title="Welcome"
        subtitle=" Sign in, get points and explore "
      />
      <View
        style={[styles.guestContainer, { backgroundColor: colors.background }]}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../../assets/images/logoinapp.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.slogan, { color: colors.textSecondary }]}>
            Your Daily Source of contents
          </Text>
        </View>
        <Text style={styles.guestTitle}>Welcome</Text>
        <View style={styles.guestMessageWrapper}>
          <Text style={[styles.guestMessage, { color: colors.textSecondary }]}>
            You are not logged in. Please sign in or register to access your
            profile.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/login")}
          style={[
            styles.guestButtonPrimary,
            { backgroundColor: colors.primary },
          ]}
        >
          <Text
            style={[
              styles.guestButtonTextPrimary,
              { color: colors.background },
            ]}
          >
            Sign in
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/register")}
          style={[styles.guestButtonSecondary, { borderColor: colors.primary }]}
        >
          <Text
            style={[styles.guestButtonTextSecondary, { color: colors.primary }]}
          >
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(20),
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: scale(400),
    borderRadius: scale(16),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    alignItems: "center",
  },
  avatar: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    overflow: "hidden",
    marginBottom: verticalScale(16),
  },
  name: {
    fontSize: moderateScale(24),
    fontWeight: "700",
    marginBottom: verticalScale(4),
    textAlign: "center",
  },
  email: {
    fontSize: moderateScale(14),
    marginBottom: verticalScale(20),
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    // marginBottom: verticalScale(10),
    paddingHorizontal: scale(10),
  },
  statsItem: {
    alignItems: "center",
    flex: 1,
  },
  logoutButton: {
    marginTop: verticalScale(10),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(60),
    borderRadius: scale(30),
    alignSelf: "center",
  },
  logoutText: {
    fontWeight: "700",
    fontSize: moderateScale(16),
    textAlign: "center",
  },
  resetButton: {
    marginTop: verticalScale(15),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(55),
    borderRadius: scale(30),
    alignSelf: "center",
  },
  resetText: {
    fontWeight: "700",
    fontSize: moderateScale(16),
    textAlign: "center",
  },
  guestContainer: {
    flex: 1,
    marginTop:isTablet() ? verticalScale(10) : verticalScale(80),
    alignItems: "center",
  },
  guestTitle: {
    fontSize: moderateScale(22),
    fontWeight: "bold",
  },
  guestMessageWrapper: {
    maxWidth: scale(300),
    alignItems: "center",
  },
  guestMessage: {
    marginVertical: verticalScale(10),
    textAlign: "center",
  },
  guestButtonPrimary: {
    padding: verticalScale(12),
    borderRadius: scale(8),
    width: "70%",
    alignItems: "center",
    marginTop: verticalScale(10),
  },
  guestButtonTextPrimary: {
    fontWeight: "600",
  },
  guestButtonSecondary: {
    borderWidth: 1,
    padding: verticalScale(12),
    borderRadius: scale(8),
    width: "70%",
    alignItems: "center",
    marginTop: verticalScale(10),
  },
  guestButtonTextSecondary: {
    fontWeight: "600",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  logo: {
    width: scale(120),
    height: scale(120),
  },
  slogan: {
    marginTop: verticalScale(8),
    fontSize: moderateScale(14),
    fontWeight: "500",
    textAlign: "center",
  },
});
