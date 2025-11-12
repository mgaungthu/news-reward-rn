import { BannerAdComponent } from "@/components/BannerAdComponent";
import { CustomModal } from "@/components/CustomModal";
import { Header } from "@/components/Header";
import { ERROR_MESSAGES } from "@/constants/messages";
import { useSettingsStore } from "@/store/settingsSlice";
import { useTheme } from "@/theme/ThemeProvider";
import { moderateScale, scale, verticalScale } from "@/utils/scale";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPassword() {

  const router = useRouter();
  const { colors } = useTheme();
  const { email } = useSettingsStore();

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error" | "info" | null>(null);
  const [modalMessage, setModalMessage] = useState("");

  const handleSendEmail = async () => {
    setLoading(true);
    try {
      // Simulate sending email with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setModalType("success");
      setModalMessage("Password reset email sent successfully.");
      setModalVisible(true);
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      setModalType("error");
      setModalMessage(ERROR_MESSAGES.CHANGE_PASSWORD_FAILED);
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalType === "success") {
      router.back();
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
              Platform.OS === "ios" && (Platform as any).isPad ? scale(60) : scale(24),
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
            Send forgot password email
          </Text>
          <Text style={{ textAlign: "center", color: colors.textSecondary || "#666" }}>
            Please send email to admin about forgetting your password and reset!
          </Text>

          <Text
            style={{
              textAlign: "center",
              color: colors.text,
              fontSize: moderateScale(16),
              paddingVertical: verticalScale(12),
            }}
          >
            {email}
          </Text>

          {/* <TouchableOpacity
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
                Send Password Reset Email
              </Text>
            )}
          </TouchableOpacity> */}
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
