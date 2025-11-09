import { deleteUser, updateUserInfo } from "@/api/authApi";
import { Header } from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/theme/ThemeProvider";
import { moderateScale, scale, verticalScale } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfile() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = async () => {
    try {
      const res = await updateUserInfo({ name, email, password });
      console.log("Profile updated:", res);
      router.back();
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              await deleteUser();
              Alert.alert("Success", "Your account has been deleted.");
              router.replace("/login");
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete account.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: verticalScale(40),
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Header title="Edit Profile" showBack />

          {/* Avatar Preview */}
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Image
              source={{
                uri:
                  user?.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/147/147142.png",
              }}
              style={styles.avatar}
            />
          </View>

          {/* Input Fields */}
          <View style={styles.form}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Full Name
            </Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.primary },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Email
            </Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.primary },
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              placeholderTextColor={colors.textSecondary}
            />

            {/* Password Confirmation */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Current Password
            </Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.primary,
                    paddingRight: scale(40),
                  },
                ]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleDeleteAccount}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.saveText, { color: colors.background }]}>
                Save Changes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.cancelButton, { borderColor: colors.primary }]}
            >
              <Text style={[styles.cancelText, { color: colors.primary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  avatarContainer: {
    width: scale(110),
    height: scale(110),
    borderRadius: scale(55),
    overflow: "hidden",
    marginTop: verticalScale(10),
    marginBottom: verticalScale(20),
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  form: {
    width: "90%",
  },
  label: {
    fontSize: moderateScale(13),
    fontWeight: "500",
    marginBottom: verticalScale(6),
  },
  input: {
    borderWidth: 1,
    borderRadius: scale(10),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12),
    marginBottom: verticalScale(16),
    fontSize: moderateScale(14),
  },
  passwordWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: verticalScale(16),
  },
  eyeIcon: {
    position: "absolute",
    right: scale(12),
    top: verticalScale(14),
  },
  deleteButton: {
    width: "100%",
    backgroundColor: "#000",
    borderRadius: scale(25),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(20),
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: moderateScale(15),
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: verticalScale(20),
  },
  saveButton: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(30),
    borderRadius: scale(25),
  },
  saveText: {
    fontSize: moderateScale(15),
    fontWeight: "600",
  },
  cancelButton: {
    borderWidth: 1,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(30),
    borderRadius: scale(25),
  },
  cancelText: {
    fontSize: moderateScale(15),
    fontWeight: "600",
  },
});
