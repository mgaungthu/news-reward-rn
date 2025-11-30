import { resetPassword } from "@/api/authApi";
import { CustomModal } from "@/components/CustomModal";
import { Header } from "@/components/Header";
import { useTheme } from "@/theme/ThemeProvider";
import { moderateScale, scale, verticalScale } from "@/utils/scale";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewPasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const { email, code } = useLocalSearchParams<{
    email?: string;
    code?: string;
  }>();

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] =
    useState<"success" | "error" | "info" | null>(null);
  const [modalMessage, setModalMessage] = useState("");

  const handleReset = async () => {
    if (!newPassword || !confirm) {
      setModalType("error");
      setModalMessage("Please fill all fields.");
      setModalVisible(true);
      return;
    }

    if (newPassword !== confirm) {
      setModalType("error");
      setModalMessage("Passwords do not match.");
      setModalVisible(true);
      return;
    }

    try {
      setLoading(true);

      const res = await resetPassword({
        email: String(email),
        code: String(code),
        new_password: newPassword,
      });

      setModalType("success");
      setModalMessage(res.message || "Password reset successfully.");
      setModalVisible(true);
    } catch (error: any) {
      setModalType("error");
      setModalMessage(error.message || "Password reset failed.");
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setModalVisible(false);
    if (modalType === "success") {
      router.push("/login");
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
      <Header title="Set New Password" showBack={true} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, justifyContent: "center" }}
      >
        <View
          style={{
            paddingHorizontal: scale(20),
            gap: verticalScale(20),
          }}
        >
          <Text
            style={{
              fontSize: moderateScale(20),
              textAlign: "center",
              fontWeight: "600",
              color: colors.text,
              marginBottom: verticalScale(10),
            }}
          >
            Enter your new password
          </Text>

          {/* New Password */}
          <View
            style={{
              position: "relative",
            }}
          >
            <TextInput
              placeholder="New Password"
              placeholderTextColor="#aaa"
              secureTextEntry={!show}
              value={newPassword}
              onChangeText={setNewPassword}
              style={{
                backgroundColor: colors.card,
                paddingVertical: verticalScale(12),
                paddingHorizontal: scale(16),
                borderRadius: moderateScale(8),
                color: colors.text,
                borderWidth: 1,
                borderColor: colors.border,
                fontSize: moderateScale(16),
              }}
            />

            <TouchableOpacity
              onPress={() => setShow(!show)}
              style={{
                position: "absolute",
                right: scale(12),
                top: verticalScale(14),
              }}
            >
              <Ionicons
                name={show ? "eye-off" : "eye"}
                size={22}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View
            style={{
              position: "relative",
            }}
          >
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#aaa"
              secureTextEntry={!showConfirm}
              value={confirm}
              onChangeText={setConfirm}
              style={{
                backgroundColor: colors.card,
                paddingVertical: verticalScale(12),
                paddingHorizontal: scale(16),
                borderRadius: moderateScale(8),
                color: colors.text,
                borderWidth: 1,
                borderColor: colors.border,
                fontSize: moderateScale(16),
              }}
            />

            <TouchableOpacity
              onPress={() => setShowConfirm(!showConfirm)}
              style={{
                position: "absolute",
                right: scale(12),
                top: verticalScale(14),
              }}
            >
              <Ionicons
                name={showConfirm ? "eye-off" : "eye"}
                size={22}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>

          {/* Submit */}
          <TouchableOpacity
            disabled={loading}
            onPress={handleReset}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: verticalScale(14),
              borderRadius: moderateScale(8),
              alignItems: "center",
              marginTop: verticalScale(10),
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text
                style={{
                  color: colors.background,
                  fontSize: moderateScale(16),
                  fontWeight: "600",
                }}
              >
                Save New Password
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <CustomModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={handleClose}
      />
    </SafeAreaView>
  );
}