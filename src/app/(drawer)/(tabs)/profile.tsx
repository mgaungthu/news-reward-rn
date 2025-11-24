import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HeaderBar } from "@/components/HeaderBar";
import { LoggedInProfile } from "@/components/LoggedInProfile";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/theme/ThemeProvider";
import { isTablet } from "@/utils/lib";
import { moderateScale, scale, verticalScale } from "@/utils/scale";

export default function Profile() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isLoggedIn, loading, getUser } = useAuth();

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

  if (isLoggedIn) {
    return <LoggedInProfile />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: scale(16),
      }}
    >
      <HeaderBar title="Welcome" subtitle=" Sign in, get points and explore " />
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
  guestContainer: {
    flex: 1,
    marginTop: isTablet() ? verticalScale(10) : verticalScale(80),
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
