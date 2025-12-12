import { Header } from "@/components/Header";
import NativeAdCard from "@/components/NativeAdCard";
import { VimeoPlayer } from "@/components/VimeoPlayer";
import { isTablet } from "@/utils/lib";
import { prettyDate } from "@/utils/prettyDate";
import { moderateScale, scale, verticalScale } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import RenderHtml from "react-native-render-html";
import { SafeAreaView } from "react-native-safe-area-context";
import { BannerAdComponent } from "./BannerAdComponent";
export default function DetailComponent({
  post,
  colors,
  toggleFavorite,
  isFavorite,
  isLoggedIn,
  sharePost,
  hasUserClaimed,
  setShowWebView,
  width,
  isLoading,
}: {
  post: any;
  colors: any;
  toggleFavorite: () => void;
  isFavorite: boolean;
  isLoggedIn: boolean;
  sharePost: () => void;
  hasUserClaimed: (post: any) => boolean;
  setShowWebView: React.Dispatch<React.SetStateAction<boolean>>;
  width: number;
  isLoading: boolean;
}) {
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

      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: verticalScale(100),
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.background,
            paddingHorizontal: scale(16),
            paddingTop: scale(10),
            zIndex: 999,
          }}
        >
          <Skeleton
            isLoading={isLoading}
            containerStyle={{ flex: 1 }}
            layout={[
              {
                key: "firstLine",
                width: "100%",
                height: 180,
                marginBottom: verticalScale(15),
                borderRadius: 10,
              },
              {
                key: "secLine",
                width: "100%",
                height: 80,
                marginBottom: verticalScale(15),
                borderRadius: 10,
              },
              {
                key: "someOtherId",
                width: "100%",
                height: 35,
                marginBottom: verticalScale(10),
                borderRadius: 10,
              },
              {
                key: "thirdLine",
                width: "80%",
                height: 20,
                marginBottom: verticalScale(10),
                borderRadius: 10,
              },
              {
                key: "fourthLine",
                width: "50%",
                height: 20,
                marginBottom: verticalScale(10),
                borderRadius: 10,
              },
              {
                key: "fourthLine",
                width: "70%",
                height: 20,
                marginBottom: verticalScale(10),
                borderRadius: 10,
              },
              {
                key: "fourthLine",
                width: "89%",
                height: 20,
                marginBottom: verticalScale(10),
                borderRadius: 10,
              },
              {
                key: "fourthLine",
                width: "80%",
                height: 20,
                marginBottom: verticalScale(10),
                borderRadius: 10,
              },
              {
                key: "fourthLine",
                width: "80%",
                height: 20,
                marginBottom: verticalScale(10),
                borderRadius: 10,
              },
              {
                key: "fourthLine",
                width: "80%",
                height: 20,
                marginBottom: verticalScale(10),
                borderRadius: 10,
              },
              {
                key: "fourthLine",
                width: "78%",
                height: 20,
                marginBottom: verticalScale(10),
                borderRadius: 10,
              },
              {
                key: "fourthLine",
                width: "100%",
                height: 20,
                marginBottom: verticalScale(10),
                borderRadius: 10,
              },
              {
                key: "fourthLine",
                width: "100%",
                height: 50,
                marginBottom: verticalScale(10),
                borderRadius: 10,
              },
            ]}
          />
        </View>
      )}

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background, opacity: isLoading ? 0 : 1 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {post.is_vip ? (
          <View style={{ marginVertical: 20 }}>
            {post.vimeo_url && <VimeoPlayer vimeoUrl={post.vimeo_url} />}
          </View>
        ) : (
          <Image
            source={{ uri: post.feature_image_url }}
            style={{
              width: "100%",
              height: isTablet() ? verticalScale(220) : verticalScale(140),
              resizeMode: "cover",
              borderRadius: 10,
              marginTop: scale(10),
            }}
          />
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: scale(10),
            marginRight: scale(5),
            marginLeft: scale(5),
          }}
        >
          {/* Created at */}
          <Text style={{ fontSize: 12, color: colors.muted }}>
            {prettyDate(post.created_at) ?? ""}
          </Text>

          {/* Action buttons */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: scale(16),
            }}
          >
            {/* Favorite */}
            {isLoggedIn && (
              <TouchableOpacity onPress={toggleFavorite}>
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={scale(18)}
                  color={isFavorite ? colors.primary : colors.text}
                />
              </TouchableOpacity>
            )}

            {/* Share */}
            <TouchableOpacity onPress={sharePost}>
              <Ionicons
                name="share-social-outline"
                size={scale(17)}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingVertical: scale(10) }}>
          <Text
            style={{
              fontSize: moderateScale(18),
              fontWeight: "bold",
              marginBottom: verticalScale(8),
              color: colors.text,
            }}
          >
            {post.title}
          </Text>

          <NativeAdCard />

          <RenderHtml
            contentWidth={width}
            source={{ html: post.body || post.content }}
            tagsStyles={{
              p: {
                color: colors.textSecondary,
                fontSize: 16,
                lineHeight: 24,
              },
              strong: { fontWeight: "bold", color: colors.text },
              a: { color: colors.primary },
            }}
          />

          {/* Claim button */}
          {!post.is_vip && isLoggedIn && (
            <TouchableOpacity
              style={{
                width: scale(120),
                height: scale(35),
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                marginTop: verticalScale(10),
                alignSelf: "center",
                backgroundColor: hasUserClaimed(post)
                  ? colors.textSecondary
                  : colors.primary,
                opacity: hasUserClaimed(post) ? 0.6 : 1,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
              disabled={hasUserClaimed(post)}
              onPress={() => setShowWebView(true)}
            >
              <Text style={{ color: colors.background, fontWeight: "600" }}>
                {hasUserClaimed(post) ? "Claimed" : "Claim your point"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <NativeAdCard />

        <BannerAdComponent/>
      </ScrollView>
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
    padding: scale(16),
  },
  scrollView: {
    flex: 1,
  },
  featureImage: {
    width: "100%",
    height: isTablet() ? verticalScale(220) : verticalScale(140),
    resizeMode: "cover",
    borderRadius: 10,
    marginTop: scale(10),
  },
  contentContainer: {
    paddingVertical: scale(10),
  },
  titleText: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: verticalScale(8),
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
    borderRadius: 5,
    marginTop: verticalScale(10),
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