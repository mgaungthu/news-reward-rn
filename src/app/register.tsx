import { registerUser } from "@/api/authApi";
import { BannerAdComponent } from "@/components/BannerAdComponent";
import { CustomModal } from "@/components/CustomModal";
import { Header } from "@/components/Header";
import { useTheme } from "@/theme/ThemeProvider";
import { isTablet } from "@/utils/lib";
import { moderateScale, scale, verticalScale } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

export default function Register() {
  const router = useRouter();
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error" | null>(null);
  const [modalMessage, setModalMessage] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const params = useLocalSearchParams<{ ref?: string }>();

  useEffect(() => {
    if (params.ref?.length) {
      setReferralCode((prev) => prev || params.ref!.toUpperCase());
    }
  }, [params.ref]);

  const handleRegister = async () => {
    if (!acceptedTerms) {
      setModalType("error");
      setModalMessage("Please accept the Terms of Use and Privacy Policy.");
      setModalVisible(true);
      return;
    }
    try {
      await registerUser({
        name,
        email,
        password,
        referral_code: referralCode.trim() || undefined,
      });
      setModalType("success");
      setModalMessage("Registration successful!");
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        router.replace("/login");
      }, 1500);
    } catch (err: any) {
      setModalType("error");
      setModalMessage(err.response?.data?.message || "Error");
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
      <Header title="Register" showBack={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ alignItems: "center" }}>
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
            justifyContent: "center",
            paddingHorizontal:
              isTablet()
                ? scale(60)
                : scale(24),
          }}
        >
          <Text
            style={{
              fontSize: moderateScale(24),
              fontWeight: "600",
              color: colors.text,
              textAlign: "center",
              marginBottom: verticalScale(10),
            }}
          >
            Welcome Aboard!
          </Text>
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor={colors.textSecondary || "#999"}
            value={name}
            onChangeText={setName}
            style={{
              borderBottomWidth: 1,
              borderColor: colors.border,
              marginBottom: verticalScale(20),
              paddingVertical: verticalScale(10),
              color: colors.text,
            }}
          />
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor={colors.textSecondary || "#999"}
            value={email}
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

          <TextInput
            placeholder="Referral code (optional)"
            placeholderTextColor={colors.textSecondary || "#999"}
            value={referralCode}
            onChangeText={setReferralCode}
            autoCapitalize="characters"
            style={{
              borderBottomWidth: 1,
              borderColor: colors.border,
              marginBottom: verticalScale(20),
              paddingVertical: verticalScale(10),
              color: colors.text,
            }}
          />

          <TouchableOpacity
            onPress={() => setAcceptedTerms((prev) => !prev)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: verticalScale(20),
              gap: scale(8),
            }}
          >
            <Ionicons
              name={acceptedTerms ? "checkbox" : "square-outline"}
              size={moderateScale(20)}
              color={acceptedTerms ? colors.primary : colors.textSecondary}
            />
            <Text
              style={{
                flex: 1,
                color: colors.textSecondary,
                fontSize: scale(11),
              }}
            >
              I agree to the
              <Text
                style={{ color: colors.primary, fontWeight: "600" }}
                onPress={() => router.push("/terms")}
              >
                {" "}
                Terms of Use
              </Text>{" "}
              and
              <Text
                style={{ color: colors.primary, fontWeight: "600" }}
                onPress={() => router.push("/privacy")}
              >
                {" "}
                Privacy Policy
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleRegister}
            style={{
              backgroundColor: colors.primary,
              padding: verticalScale(12),
              borderRadius: moderateScale(8),
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.background, fontWeight: "600" }}>
              Register
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={{ marginTop: verticalScale(20), alignItems: "center" }}
          >
            <Text>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>

        <BannerAdComponent />
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
