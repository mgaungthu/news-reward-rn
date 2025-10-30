import { resetUserClaims } from "@/api/postApi";
import { useAuth } from "@/context/AuthContext";
import { useAds } from "@/hooks/useAds";
import { useTheme } from "@/theme/ThemeProvider";
import { moderateScale, scale, verticalScale } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
    } else {
      Alert.alert("Wait", "You cannot reset right now");
    }
  }, [showRewardedWithCooldown]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getUser();
    setRefreshing(false);
  };

  if (isLoggedIn) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          {/* Avatar */}
          <View style={styles.avatar}>
            <Image
              source={{
                uri:
                  user?.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/147/147142.png",
              }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>

          {/* Name and Email */}
          <Text style={[styles.name, { color: colors.text }]}>
            {user?.name || "Guest User"}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>
            {user?.email || "guest@example.com"}
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
                {user?.points ?? 0}
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
    );
  }

  // 🚪 Guest View
  return (
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
      <Text style={styles.guestTitle}>Guest Profile</Text>
      <View style={styles.guestMessageWrapper}>
        <Text style={[styles.guestMessage, { color: colors.textSecondary }]}>
          You are not logged in. Please sign in or register to access your
          profile.
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/login")}
        style={[styles.guestButtonPrimary, { backgroundColor: colors.primary }]}
      >
        <Text
          style={[styles.guestButtonTextPrimary, { color: colors.background }]}
        >
          Login
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: scale(400),
    borderRadius: scale(16),
    paddingVertical: verticalScale(30),
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
    marginBottom: verticalScale(20),
    paddingHorizontal: scale(10),
  },
  statsItem: {
    alignItems: "center",
    flex: 1,
  },
  logoutButton: {
    marginTop: verticalScale(30),
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
    marginTop: verticalScale(20),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(60),
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
    justifyContent: "center",
    alignItems: "center",
    padding: scale(20),
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
    marginBottom: verticalScale(20),
  },
  logo: {
    width: scale(100),
    height: scale(100),
  },
  slogan: {
    marginTop: verticalScale(8),
    fontSize: moderateScale(14),
    fontWeight: "500",
    textAlign: "center",
  },
});
