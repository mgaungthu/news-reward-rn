import { BannerAdComponent } from "@/components/BannerAdComponent";
import { CustomModal } from "@/components/CustomModal";
import { Header } from "@/components/Header";
import { ERROR_MESSAGES } from "@/constants/messages";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/theme/ThemeProvider";
import { isTablet } from "@/utils/lib";
import { moderateScale, scale, verticalScale } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const router = useRouter();
  const { colors } = useTheme();
  const { login } = useAuth(); // 👈 from AuthContext

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error" | null>(null);
  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Basic validation
    if (!email.trim()) {
      setModalType("error");
      setModalMessage("Please enter your email.");
      setModalVisible(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setModalType("error");
      setModalMessage("Please enter a valid email address.");
      setModalVisible(true);
      return;
    }

    if (!password.trim()) {
      setModalType("error");
      setModalMessage("Please enter your password.");
      setModalVisible(true);
      return;
    }

    try {
      await login(email, password);

      setModalType("success");
      setModalMessage("Login successful!");
      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
        router.replace("/");
      }, 1200);
    } catch (err: any) {
      // If AuthContext threw "email_not_verified"
      if (err?.message === "email_not_verified") {
        return router.push({
          pathname: "/verify-email",
          params: { email },
        });
      }

      // Otherwise show normal login error
      setModalType("error");
      setModalMessage(ERROR_MESSAGES.LOGIN_INVALID);
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: scale(16),
      }}
    >
      <Header title="Sign in to your Account" showBack={true} />

      <View
        style={{
          alignItems: "center",
          marginTop: isTablet() ? verticalScale(35) : verticalScale(70),
        }}
      >
        <Image
          source={require("../../assets/images/logoinapp.png")}
          style={{
            width: scale(120),
            height: verticalScale(120),
            resizeMode: "contain",
          }}
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            marginTop: verticalScale(20),
            paddingHorizontal: isTablet() ? scale(60) : scale(24),
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: moderateScale(22),
              fontWeight: "bold",
              marginBottom: verticalScale(24),
            }}
          >
            Sign in to your account
          </Text>

          <TextInput
            placeholder="Enter your email"
            placeholderTextColor={colors.textSecondary || "#999"}
            value={email}
            autoCapitalize="none"
            onChangeText={setEmail}
            style={{
              borderBottomWidth: 1,
              borderColor: colors.border,
              marginBottom: verticalScale(20),
              paddingVertical: verticalScale(10),
              color: colors.text,
            }}
          />

          <View style={{ position: "relative" }}>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={colors.textSecondary || "#999"}
              autoCapitalize="none"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={{
                borderBottomWidth: 1,
                borderColor: colors.border,
                marginBottom: verticalScale(20),
                paddingVertical: verticalScale(10),
                color: colors.text,
                paddingRight: scale(40),
              }}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 0,
                bottom: verticalScale(18),
                padding: 10,
              }}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={scale(20)}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/forgot-password")}
            style={{
              alignSelf: "flex-end",
              marginBottom: verticalScale(20),
            }}
          >
            <Text style={{ color: colors.primary, fontWeight: "500" }}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            style={{
              backgroundColor: colors.primary,
              padding: verticalScale(12),
              borderRadius: moderateScale(8),
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.background, fontWeight: "600" }}>
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/register")}
            style={{ marginTop: verticalScale(20), alignItems: "center" }}
          >
            <Text>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>
        
      </KeyboardAvoidingView>
        
        <BannerAdComponent />
      <CustomModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}
