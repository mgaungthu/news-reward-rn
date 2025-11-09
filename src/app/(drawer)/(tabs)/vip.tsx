import { getVipPosts } from "@/api/postApi";
import { InterstitialAdCard } from "@/components/InterstitialAdCard";
import { useVipPostStore } from "@/store/useVipPostStore";
import { useTheme } from "@/theme/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

import { HeaderBar } from "@/components/HeaderBar";
import { useAuth } from "@/context/AuthContext";
import { moderateScale, scale, verticalScale } from "@/utils/scale";
import {
    ActivityIndicator,
    Dimensions,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VipPosts() {
  const { colors } = useTheme();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const {
    data: vipPosts = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["vipPosts"],
    queryFn: getVipPosts,
  });

  const { width } = Dimensions.get("window");
  const isIpad = Platform.OS === "ios" && width >= 768;

  const { vipPurchasePosts, loading, fetchUserVipPosts } = useVipPostStore();

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    getUserPurchaseList();
  }, [isLoggedIn]);

  const getUserPurchaseList = () => {
    if (isLoggedIn) {
      return fetchUserVipPosts();
    }
    return;
  };

  console.log()

  const mergedVipPosts = vipPosts.map((post: any) => {
    const purchased = vipPurchasePosts.some((p: any) => p.id === post.id);
    return { ...post, purchased: purchased ? 1 : 0 };
  });

  const onRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      getUserPurchaseList();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch, fetchUserVipPosts]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError || vipPosts.length === 0) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
        }}
      >
        {/* <TitleHeader title="VIP Posts" align="center" /> */}
         <HeaderBar title="VIP Posts" subtitle=" Unlock exclusive VIP posts with your points"/>
        <Text
          style={{
            fontSize: 14,
            color: colors.textSecondary || "#888",
            marginBottom: 20,
            textAlign: "center",
            width: "90%",
          }}
        >
          Unlock exclusive VIP posts using your earned points to access premium
          content and rewards.
        </Text>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.background,
          }}
        >
          <Text style={{ color: colors.text }}>No VIP posts available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: scale(16) }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >


          <HeaderBar title="VIP Posts" subtitle=" Unlock exclusive VIP posts with your points"/>

        <View style={[styles.section]}>
          <View style={[isIpad && styles.postsGrid]}>
            {isLoading && <ActivityIndicator color={colors.primary} />}
            {isError && (
              <Text style={{ color: "red" }}>
                Failed to load posts. Pull to refresh.
              </Text>
            )}
            {!isLoading && !isError && mergedVipPosts.length === 0 && (
              <Text
                style={{
                  textAlign: "center",
                  color: colors.muted,
                  marginTop: 20,
                }}
              >
                No posts available at the moment.
              </Text>
            )}
            {mergedVipPosts.map((post: any, i: number) => (
              <View key={post.id} style={[isIpad && styles.cardWrapper]}>
                <InterstitialAdCard
                  i={i}
                  id={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  feature_image={post.feature_image}
                  feature_image_url={post.feature_image_url}
                  purchase={post.purchased}
                  adKey="vip_card"
                  threshold={3}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
  header: {
    marginBottom: verticalScale(16),
    
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: "700",
    textAlign:'center'
  },
  subtitle: {
    fontSize: moderateScale(16),
    marginTop: verticalScale(4),
    textAlign:'center'
  },
  section: {
    marginBottom: verticalScale(24),
  },
  postsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%",
    marginBottom: verticalScale(16),
  },
});