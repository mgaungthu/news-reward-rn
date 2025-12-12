import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Share,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from "react-native";

import Skeleton from "react-native-reanimated-skeleton";
import { SafeAreaView } from "react-native-safe-area-context";

import { getPostById } from "@/api/postApi";
import DetailComponent from "@/components/DetailComponent";
import { Header } from "@/components/Header";
import { PostWebView } from "@/components/PostWebView";
import { useAuth } from "@/context/AuthContext";
import { useAdLoadingStore } from "@/store/adLoadingSlice";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useTheme } from "@/theme/ThemeProvider";
import { moderateScale, scale, verticalScale } from "@/utils/scale";

interface UserClaim {
  post_id: number;
  user_id: number;
  status: "pending" | "claimed" | string;
}

export default function PostsDetail() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const [showWebView, setShowWebView] = useState(false);
  const { width } = useWindowDimensions();
  const { isLoggedIn, user } = useAuth();
  const { adLoading, setAdLoading } = useAdLoadingStore();
  const {
    data: post,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(id as string),
    enabled: !!id,
  });
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const isFavorite = useFavoritesStore(
    useCallback(
      (state) =>
        post ? state.favorites.some((fav) => fav.id === post.id) : false,
      [post?.id]
    )
  );

  useEffect(() => {
    setAdLoading(true);
  }, []);

  const toggleFavorite = useCallback(() => {
    if (!post) {
      return;
    }

    if (!isLoggedIn) {
      Alert.alert("Sign in required", "Please sign in to save favourites.");
      return;
    }

    if (isFavorite) {
      removeFavorite(post.id);
      return;
    }

    addFavorite({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || post.description,
      feature_image: post.feature_image,
      feature_image_url: post.feature_image_url || post.feature_image,
      created_at: post.created_at,
      is_vip: post.is_vip,
    });
  }, [addFavorite, isFavorite, isLoggedIn, post, removeFavorite]);

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Header title="Loading..." />
        <View style={{ height: "100%" }}>
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
    return (
      <PostWebView
        post={post}
        onBack={() => {
          setShowWebView(false);
          refetch();
        }}
      />
    );
  }


  const sharePost = async () => {
    try {
      const webShareUrl = `https://lotaya.mandalayads.io/post-open?post_id=${post.id}`;

      await Share.share({
        title: post.title,
        message: `${post.title}\n\nRead on Lotaya Dinga:\n${webShareUrl}`,
        url: webShareUrl,
      });
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  // Default post detail screen
  return (
   <DetailComponent
      post={post}
      isLoading={false}
      colors={colors}
      toggleFavorite={toggleFavorite}
      isFavorite={isFavorite}
      isLoggedIn={isLoggedIn}
      sharePost={sharePost}
      hasUserClaimed={hasUserClaimed}
      setShowWebView={setShowWebView}
      width={width}
    />
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
    errorText: {
    fontSize: moderateScale(16),
  },
});
