import { getPostById } from "@/api/postApi";
import { BannerAdComponent } from "@/components/BannerAdComponent";
import { Header } from "@/components/Header";
import { PostWebView } from "@/components/PostWebView";
import { VimeoPlayer } from "@/components/VimeoPlayer";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/theme/ThemeProvider";
import { moderateScale, scale, verticalScale } from "@/utils/scale";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { SafeAreaView } from "react-native-safe-area-context";

interface UserClaim {
  post_id: number;
  user_id:number;
  status: "pending" | "claimed" | string;
}

export default function NewsDetail() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const [showWebView, setShowWebView] = useState(false);
  const { width } = useWindowDimensions();
  const { isLoggedIn, user } = useAuth();

  const {
    data: post,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.centeredContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (isError || !post) {
    return (
      <SafeAreaView
        style={[
          styles.centeredContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.errorText, { color: colors.text }]}>
          Failed to load post.
        </Text>
      </SafeAreaView>
    );
  }

  const hasUserClaimed = (post: any) =>
    post.user_claims?.some(
      (claim: UserClaim) =>
        claim.user_id === user?.id && claim.status === "claimed"
    );


  // When WebView is active
  if (showWebView && post.read_more_url) {
    return <PostWebView post={post} onBack={() => {
      setShowWebView(false);
      refetch();
    }} />;
  }

  // Default post detail screen
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header
        title={
          post.title?.length > 30
            ? post.title.slice(0, 30) + "..."
            : post.title || "News Detail"
        }
      />

      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.background }]}
      >
        {post.feature_image_url && (
          <Image
            source={{ uri: post.feature_image_url }}
            style={styles.featureImage}
          />
        )}

        <View style={styles.contentContainer}>
          <Text style={[styles.titleText, { color: colors.text }]}>
            {post.title}
          </Text>

          <RenderHtml
            contentWidth={width}
            source={{ html: post.body || post.content }}
            tagsStyles={{
              p: { color: colors.textSecondary, fontSize: 16, lineHeight: 24 },
              strong: { fontWeight: "bold", color: colors.text },
              a: { color: colors.primary },
            }}
          />

          <View style={{ marginVertical: 20 }}>
            {post.vimeo_url && <VimeoPlayer vimeoUrl={post.vimeo_url} />}
          </View>

          {!post.is_vip && isLoggedIn && (
            <TouchableOpacity
              style={[
                styles.pointsButton,
                {
                  backgroundColor: hasUserClaimed(post)
                    ? colors.textSecondary
                    : colors.primary,
                  opacity: hasUserClaimed(post) ? 0.6 : 1,
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                },
              ]}
              disabled={hasUserClaimed(post)}
              onPress={() => setShowWebView(true)}
            >
              <Text style={[styles.pointsButtonText, { color: colors.background }]}>
                {hasUserClaimed(post) ? "Claimed" : "Claim your point"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
      </ScrollView>

      <BannerAdComponent />

      
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: scale(16)
  },
  scrollView: {
    flex: 1,
  },
  featureImage: {
    width: "100%",
    height: Platform.OS === "ios" && (Platform as any).isPad
        ? verticalScale(220)
        : verticalScale(180),
    resizeMode: "cover",
    borderRadius:10
  },
  contentContainer: {
    padding: scale(16),
  },
  titleText: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: verticalScale(8),
  },
  errorText: {
    fontSize: moderateScale(16),
  },
  webViewLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pointsButton: {
    // Removed position: "absolute",
    // Removed bottom, right positioning
    width: scale(120),
    height: scale(35),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pointsButtonText: {
    fontWeight: "600",
    fontSize: moderateScale(12),
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
