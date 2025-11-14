import { BannerAdComponent } from "@/components/BannerAdComponent";
import { CustomModal } from "@/components/CustomModal";
import { Header } from "@/components/Header";
import { ERROR_MESSAGES } from "@/constants/messages";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/theme/ThemeProvider";
import { isTablet } from "@/utils/lib";
import { moderateScale, scale, verticalScale } from "@/utils/scale";
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

  const handleLogin = async () => {
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
      console.log(err);

      let message = ERROR_MESSAGES.UNKNOWN_ERROR;

      // Check if response exists and has 401 status
      if (err.response && err.response.status === 401) {
        message = ERROR_MESSAGES.LOGIN_INVALID;
      } else if (err.message) {
        message = ERROR_MESSAGES.LOGIN_FAILED;
      }

      setModalType("error");
      setModalMessage(message);
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
      <Header title="Login" showBack={true} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ alignItems: "center", marginTop:isTablet() ? verticalScale(35) : verticalScale(70) }}>
          <Image
            source={require("../../assets/images/logoinapp.png")}
            style={{
              width: scale(120),
              height: verticalScale(120),
              resizeMode: "contain",
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            marginTop:verticalScale(20),
            paddingHorizontal:
             isTablet()
                ? scale(60)
                : scale(24),
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

          <TextInput
            placeholder="Enter your password"
            placeholderTextColor={colors.textSecondary || "#999"}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={{
              borderBottomWidth: 1,
              borderColor: colors.border,
              marginBottom: verticalScale(20),
              paddingVertical: verticalScale(10),
              color: colors.text,
            }}
          />

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
        <BannerAdComponent/>
      </KeyboardAvoidingView>

      <CustomModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}
