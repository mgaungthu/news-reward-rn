import { claimPostReward } from "@/api/postApi";
import { CustomModal } from "@/components/CustomModal";
import { Header } from "@/components/Header";
import { useTheme } from "@/theme/ThemeProvider";
import { moderateScale, scale, verticalScale } from "@/utils/scale";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

interface PostWebViewProps {
  post: any;
  onBack: () => void;
}

export function PostWebView({ post, onBack }: PostWebViewProps) {
  
  const [isClaimEnabled, setIsClaimEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<
    "success" | "error" | "info" | null
  >(null);
  const [modalMessage, setModalMessage] = useState("");
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title={
          post.title?.length > 30
            ? post.title.slice(0, 30) + "..."
            : post.title || "News Detail"
        }
        showBack
      />

      <WebView
        source={{ uri: post.read_more_url }}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator
            style={styles.webViewLoading}
            size="large"
            color={colors.primary}
          />
        )}
        onNavigationStateChange={(navState) => {
          const detectedUrl = navState.url;
          // Detect if reward URL is matched
          if (
            post.rewards &&
            post.rewards.some((reward: any) => detectedUrl.includes(reward.url))
          ) {
            setIsClaimEnabled(true);
          } else {
            setIsClaimEnabled(false);
          }
        }}
      />

      <TouchableOpacity
        style={[
          styles.detectButton,
          {
            backgroundColor: isClaimEnabled
              ? colors.primary
              : colors.primary + "99",
          },
        ]}
        disabled={!isClaimEnabled}
        onPress={async () => {
          if (isClaimEnabled) {
            try {
              await claimPostReward(post.id);
              setModalType("success");
              setModalMessage("Claim successful!");
              setModalVisible(true);
              setIsClaimEnabled(false);
              setTimeout(() => {
                onBack();
              }, 1500);
            } catch (e) {
              setModalType("error");
              setModalMessage("Failed to claim");
              setModalVisible(true);
            }
          }
        }}
      >
        <Text style={[styles.detectButtonText, { color: colors.background }]}>
          {isClaimEnabled ? "Claim Your Point" : "Detecting URL..."}
        </Text>
      </TouchableOpacity>

      <CustomModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  webViewLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  detectButton: {
    position: "absolute",
    bottom: verticalScale(16),
    left: scale(16),
    right: scale(16),
    height: verticalScale(48),
    borderRadius: scale(10),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detectButtonText: {
    fontSize: moderateScale(14),
    fontWeight: "500",
  },
});
