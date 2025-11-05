import { registerUser } from "@/api/authApi";
import { CustomModal } from "@/components/CustomModal";
import { Header } from "@/components/Header";
import { useTheme } from "@/theme/ThemeProvider";
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
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const router = useRouter();
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error" | null>(null);
  const [modalMessage, setModalMessage] = useState("");

  const handleRegister = async () => {
    try {
      await registerUser({ name, email, password });
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Register" showBack={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: "center",  paddingHorizontal: Platform.OS === "ios" && (Platform as any).isPad ? scale(60) : scale(24), }}>
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
