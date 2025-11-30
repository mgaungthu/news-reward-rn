import { forgotPassword } from "@/api/authApi";
import { BannerAdComponent } from "@/components/BannerAdComponent";
import { CustomModal } from "@/components/CustomModal";
import { Header } from "@/components/Header";
import { useTheme } from "@/theme/ThemeProvider";
import { isTablet } from "@/utils/lib";
import { moderateScale, scale, verticalScale } from "@/utils/scale";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const isValidEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export default function ForgotPassword() {

  const router = useRouter();
  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error" | "info" | null>(null);
  const [modalMessage, setModalMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleSendEmail = async () => {
    if (!email) {
      setModalType("error");
      setModalMessage("Please enter your email");
      setModalVisible(true);
      return;
    }

    if (!isValidEmail(email)) {
      setModalType("error");
      setModalMessage("Please enter a valid email address");
      setModalVisible(true);
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword({ email });

      if (res?.status === false) {
        if (res.errors?.email && Array.isArray(res.errors.email)) {
          setModalType("error");
          setModalMessage(res.errors.email[0]);
          setModalVisible(true);
          return;
        }

        setModalType("error");
        setModalMessage(res.message || "Failed to send reset code.");
        setModalVisible(true);
        return;
      }

      setModalType("success");
      setModalMessage(res.message || "Password reset code sent to your email.");
      setModalVisible(true);
    } catch (error: any) {
      setModalType("error");
      setModalMessage("Something went wrong. Please try again.");
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalType === "success") {
      router.push(`/reset-password-otp?email=${encodeURIComponent(email)}`);
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
      <Header title="Forgot Password" showBack={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal:
              isTablet() ? scale(60) : scale(24),
            gap: verticalScale(16),
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: moderateScale(22),
              fontWeight: "bold",
              marginBottom: verticalScale(8),
            }}
          >
            Reset your password
          </Text>
          <Text style={{ textAlign: "center", color: colors.textSecondary || "#666" }}>
            Enter your email and we will send you a reset code.
          </Text>

          <TextInput
            value={email}
            placeholder="Enter your email"
            placeholderTextColor={"#ddd"}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(t) => setEmail(t)}
            style={{
              backgroundColor: colors.background,
              paddingVertical: verticalScale(10),
              paddingHorizontal: scale(15),
              borderRadius: moderateScale(8),
              fontSize: moderateScale(16),
              color: colors.text,
              borderWidth: 1,
              borderColor: colors.border || "#ccc",
            }}
          />

          <TouchableOpacity
            onPress={handleSendEmail}
            disabled={loading}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: verticalScale(12),
              borderRadius: moderateScale(8),
              alignItems: "center",
              marginTop: verticalScale(16),
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={{ color: colors.background, fontWeight: "600" }}>
                Send Reset Code
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <BannerAdComponent/>
      </KeyboardAvoidingView>

      <CustomModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={handleModalClose}
      />
      
    </SafeAreaView>
  );
}
