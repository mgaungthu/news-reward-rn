import { getVipPosts } from "@/api/postApi";
import { InterstitialAdCard } from "@/components/InterstitialAdCard";
import { TitleHeader } from "@/components/TitleHeader";
import { useVipPostStore } from "@/store/useVipPostStore";
import { useTheme } from "@/theme/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

import { useAuth } from "@/context/AuthContext";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
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

  const { vipPurchasePosts, loading, fetchUserVipPosts } = useVipPostStore();

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    
      getUserPurchaseList();
    
    
  }, [isLoggedIn]);

  const getUserPurchaseList = () => {
      if(isLoggedIn){
        return  fetchUserVipPosts();
    }

    return;
  }

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
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
        alignItems: "center",
      }}
    >
      <TitleHeader title="VIP Posts" align="center" />
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
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        {mergedVipPosts.map((post: any, i: number) => (
          <InterstitialAdCard
            key={post.id}
            i={i}
            id={post.id}
            title={post.title}
            excerpt={post.excerpt}
            feature_image={post.feature_image}
            purchase={post.purchased}
            adKey="vip_card"
            threshold={2}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
