import { resendOtp, verifyEmail } from "@/api/authApi";
import { Header } from "@/components/Header";
import { ERROR_MESSAGES } from "@/constants/messages";
import { useAuth } from "@/context/AuthContext";
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
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { colors } = useTheme();
  const { setisVerify, logout } = useAuth();

  

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const inputs = useRef<any[]>([]);

  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    resendOtp({ email: String(email) });
  }, [email]);

  const handleChange = (text: string, index: number) => {
    const clean = text.replace(/[^0-9]/g, "");

    console.log(text)
    // If user pasted all 6 digits at once
    if (clean.length === 6) {
      const arr = clean.split("");
      setOtp(arr);
      inputs.current[5]?.focus();
      return;
    }

    // Normal single digit typing
    const newOtp = [...otp];
    newOtp[index] = clean;
    setOtp(newOtp);

    if (clean && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      const newOtp = [...otp];

      // If current box has a value, clear it
      if (newOtp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
        return;
      }

      // If current is empty, move to previous box
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

    if (!email) {
      Alert.alert("Error", "Missing email parameter");
      return;
    }

    try {
      setSubmitting(true);
      await verifyEmail({ email: String(email), code });
      setisVerify(true);
      Alert.alert("Success", "Email verified successfully", [
        {
          text: "OK",
          onPress: () => router.replace("/"),
        },
      ]);
    } catch (error: any) {
      console.log("verifyEmail error", error);
      let message = ERROR_MESSAGES.UNKNOWN_ERROR;

      if (error?.response?.status === 422) {
        message = error?.response?.data?.message || "Invalid verification code";
      } else if (error?.message) {
        message = error.message;
      }

      Alert.alert("Verification failed", message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      Alert.alert("Error", "Missing email parameter");
      return;
    }

    try {
      setResendDisabled(true);
      setResendTimer(30);
      setSubmitting(true);
      await resendOtp({ email: String(email) });
      setResendMessage("A new verification code has been sent to your email.");
    } catch (error: any) {
      console.log("resendOtp error:", error);
      let message = "Failed to resend code";

      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        message = error.message;
      }

      Alert.alert("Error", message);
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    let interval: any;

    if (resendDisabled) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resendDisabled]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: scale(16),
      }}
    >
      <Header
        title="Verify Email"
        showBack={true}
        onBackPress={() => {
          logout(); 
          router.back()
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Icon */}
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

        {/* Content */}
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
              marginBottom: verticalScale(8),
              color: colors.text,
            }}
          >
            Verify your email
          </Text>

          <Text
            style={{
              textAlign: "center",
              fontSize: moderateScale(14),
              color: colors.textSecondary || "#777",
              marginBottom: verticalScale(24),
            }}
          >
            Please enter the 6 digit code sent to{"\n"}
            {email || "your email"}
          </Text>

          {/* OTP Boxes */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: verticalScale(24),
            }}
          >
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputs.current[index] = ref ?? null;
                }}
                value={value}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={index === 0 ? 6 : 1}
                style={{
                  width: scale(35),
                  height: scale(40),
                  borderRadius: moderateScale(10),
                  backgroundColor: "#f1eeeeff",
                  borderColor: "rgba(242, 240, 240, 1)eeeff",
                  borderWidth: 1,
                  marginHorizontal: scale(4),
                  textAlign: "center",
                  fontSize: moderateScale(16),
                  color: colors.primary,
                }}
              />
            ))}
          </View>

          {resendMessage !== "" && (
            <Text
              style={{
                textAlign: "center",
                color: colors.muted,
                marginBottom: verticalScale(10),
                fontSize: moderateScale(13),
              }}
            >
              {resendMessage}
            </Text>
          )}
          {/* Resend */}
          <TouchableOpacity
            disabled={resendDisabled || submitting}
            onPress={handleResend}
            style={{
              marginBottom: verticalScale(24),
              opacity: resendDisabled ? 0.4 : 1,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: colors.primary,
                textDecorationLine: "underline",
                fontSize: moderateScale(14),
              }}
            >
              {resendDisabled ? `Resend in ${resendTimer}s` : "Resend code"}
            </Text>
          </TouchableOpacity>

          {/* Confirm button */}
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
            <Text
              style={{
                color: colors.background,
                fontWeight: "600",
                fontSize: moderateScale(16),
              }}
            >
              {submitting ? "Confirming..." : "Confirm email"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
