import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HeaderBar } from "@/components/HeaderBar";
import { useTheme } from "@/theme/ThemeProvider";
import { moderateScale, scale, verticalScale } from "@/utils/scale";
import { useRouter } from "expo-router";

import { resetUserClaims } from "@/api/postApi";
import { useAuth } from "@/context/AuthContext";
import { useAds } from "@/hooks/useAds";

export function LoggedInProfile() {
  const [refreshing, setRefreshing] = useState(false);
  const [loadingReward, setLoadingReward] = useState(false);

  const { colors } = useTheme();
  const router = useRouter();
  const { user, logout, getUser } = useAuth();

  const { showRewardedWithCooldown } = useAds();


   useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);

  const handlePress = useCallback(async () => {
    if (loadingReward) return;      // ⛔ prevents double tap

    setLoadingReward(true);

    const success = await showRewardedWithCooldown(
      async () => {
        Alert.alert("Now, You’re ready to get new points!");
      },
      (msRemaining) => {
        const minutes = Math.ceil(msRemaining / 60000);
        Alert.alert("Please wait", `Try again in ${minutes} minute(s).`);
      }
    );

    if (success) {
      await resetUserClaims();
      Alert.alert("Now, You’re ready to get new points!");
    }

    setLoadingReward(false);
  }, [showRewardedWithCooldown, loadingReward]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getUser();
    } catch (e) {
      console.log("Refresh error:", e);
    }
    setRefreshing(false);
  }, [getUser]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: scale(16),
      }}
    >
      <HeaderBar title="Profile" subtitle="Your profile status" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          {/* Avatar */}
          <View style={styles.avatar}>
            <Image
              source={require("@/../assets/images/logoinapp.png")}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>

          {/* User Name & Email */}
          <Text style={[styles.name, { color: colors.text }]}>
            {user?.name || "Guest User"}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>
            {user?.email || "Earn points and unlock"}
          </Text>

          {/* POINTS + EDIT PROFILE */}
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

          {/* SETTINGS LIST */}
          <View
            style={{
              width: "100%",
              backgroundColor: colors.cardBackground,
              borderRadius: scale(12),
              paddingVertical: verticalScale(6),
              marginTop: verticalScale(20),
            }}
          >
            {/* Referral */}
            <TouchableOpacity onPress={() => router.push('/referral')} style={styles.listItem}>
              <View style={styles.listLeft}>
                <Ionicons
                  name="copy-outline"
                  size={22}
                  color={colors.primary}
                  style={styles.listIcon}
                />
                <Text style={[styles.listText, { color: colors.text }]}>
                  Referral
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {/* Buy Package */}
            <TouchableOpacity
              onPress={() => router.push("/buy-points")}
              style={styles.listItem}
            >
              <View style={styles.listLeft}>
                <Ionicons
                  name="star-outline"
                  size={22}
                  color={colors.primary}
                  style={styles.listIcon}
                />
                <Text style={[styles.listText, { color: colors.text }]}>
                  Buy Points
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {/* Reset All Posts */}
            <TouchableOpacity onPress={handlePress} style={styles.listItem}>
              <View style={styles.listLeft}>
                <Ionicons
                  name="refresh-outline"
                  size={22}
                  color={colors.primary}
                  style={styles.listIcon}
                />
                <Text style={[styles.listText, { color: colors.text }]}>
                  Reset All Posts
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {/* Version */}
            <View style={styles.listItem}>
              <View style={styles.listLeft}>
                <Ionicons
                  name="information-circle-outline"
                  size={22}
                  color={colors.primary}
                  style={styles.listIcon}
                />
                <Text style={[styles.listText, { color: colors.text }]}>
                  Version
                </Text>
              </View>
              <Text style={{ color: colors.textSecondary }}>v 1.0.0</Text>
            </View>

            {/* Logout */}
            <TouchableOpacity onPress={logout} style={styles.listItem}>
              <View style={styles.listLeft}>
                <Ionicons
                  name="log-out-outline"
                  size={22}
                  color={colors.primary}
                  style={styles.listIcon}
                />
                <Text style={[styles.listText, { color: colors.text }]}>
                  Logout
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>


          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------
   STYLESHEET (self-contained version)
--------------------------------------------------------*/
export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: scale(400),
    borderRadius: scale(16),
    paddingVertical: verticalScale(20),
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
    paddingHorizontal: scale(10),
  },

  statsItem: {
    alignItems: "center",
    flex: 1,
  },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(14),
    justifyContent: "space-between",
  },

  listLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  listIcon: {
    width: scale(26),
  },

  listText: {
    fontSize: 15,
    marginLeft: scale(8),
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
});
