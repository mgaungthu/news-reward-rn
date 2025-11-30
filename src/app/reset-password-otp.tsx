import { forgotPassword, verifyResetOtp } from "@/api/authApi";
import { Header } from "@/components/Header";
import { useTheme } from "@/theme/ThemeProvider";
import { isTablet } from "@/utils/lib";
import { moderateScale, scale, verticalScale } from "@/utils/scale";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPasswordOtpScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { colors } = useTheme();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);

  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(30);
  const [resendMessage, setResendMessage] = useState("");

  const inputs = useRef<any[]>([]);

  useEffect(() => {
    // Start timer immediately on first screen load
    setResendDisabled(true);
    setResendTimer(30);
  }, []);

  const handleChange = (text: string, index: number) => {
    const cleaned = text.replace(/[^0-9]/g, "");

    // If user pastes 2–6 digits at once
    if (cleaned.length > 1) {
      const digits = cleaned.split("").slice(0, 6); // limit to 6 digits

      const newArr = [...otp];

      digits.forEach((d, i) => {
        if (index + i < 6) {
          newArr[index + i] = d;
        }
      });

      setOtp(newArr);

      // Move focus to the next empty box
      const nextIndex = index + digits.length - 1;
      inputs.current[Math.min(nextIndex, 5)]?.focus();

      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleaned.slice(-1); // only last digit
    setOtp(newOtp);

    if (cleaned && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      const newOtp = [...otp];

      if (newOtp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
        return;
      }

      if (!newOtp[index] && index > 0) {
        inputs.current[index - 1]?.focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleConfirm = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      Alert.alert("Invalid code", "Please enter all 6 digits");
      return;
    }

    try {
      setSubmitting(true);
      const res = await verifyResetOtp({ email: String(email), code });

      Alert.alert("Success", "OTP verified", [
        {
          text: "OK",
          onPress: () =>
            router.push(
              `/new-password?email=${String(email)}&code=${code}`
            ),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Verification failed", error.message || "Invalid code");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendDisabled(true);
      setResendTimer(30);
      await forgotPassword({ email: String(email) });

      setResendMessage("A new reset code has been sent to your email.");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to resend code");
    }
  };

  useEffect(() => {
    if (!resendDisabled) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendDisabled]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, padding: scale(16) }}>
      <Header title="Reset Password" showBack={true} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={{ alignItems: "center", marginTop: verticalScale(40) }}>
          <Image
            source={require("../../assets/images/logoinapp.png")}
            style={{ width: scale(120), height: verticalScale(120), resizeMode: "contain" }}
          />
        </View>

        <View style={{ flex: 1, marginTop: verticalScale(20), paddingHorizontal: isTablet() ? scale(60) : scale(24) }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: moderateScale(22),
              fontWeight: "bold",
              marginBottom: verticalScale(8),
              color: colors.text,
            }}
          >
            Enter Reset Code
          </Text>

          <Text
            style={{
              textAlign: "center",
              fontSize: moderateScale(14),
              color: colors.textSecondary || "#777",
              marginBottom: verticalScale(24),
            }}
          >
            A 6 digit code was sent to{"\n"}
            {email}
          </Text>

          {/* OTP Boxes */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: verticalScale(24) }}>
            {otp.map((val, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputs.current[index] = ref;
                }}
                value={val}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={index === 0 ? 6 : 1}
                style={{
                  width: scale(35),
                  height: scale(40),
                  borderRadius: moderateScale(10),
                  backgroundColor: "#f1eeeeff",
                  marginHorizontal: scale(4),
                  textAlign: "center",
                  fontSize: moderateScale(16),
                  color: colors.primary,
                }}
              />
            ))}
          </View>

          {resendMessage !== "" && (
            <Text style={{ textAlign: "center", color: colors.muted, marginBottom: verticalScale(10) }}>
              {resendMessage}
            </Text>
          )}

          {/* Resend Button */}
          <TouchableOpacity
            disabled={resendDisabled}
            onPress={handleResend}
            style={{ marginBottom: verticalScale(24), opacity: resendDisabled ? 0.4 : 1 }}
          >
            <Text style={{ textAlign: "center", color: colors.primary, textDecorationLine: "underline" }}>
              {resendDisabled ? `Resend in ${resendTimer}s` : "Resend Code"}
            </Text>
          </TouchableOpacity>

          {/* CONFIRM */}
          <TouchableOpacity
            disabled={submitting}
            onPress={handleConfirm}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: verticalScale(14),
              borderRadius: moderateScale(30),
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.background, fontWeight: "600", fontSize: moderateScale(16) }}>
              {submitting ? "Confirming..." : "Confirm Code"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}