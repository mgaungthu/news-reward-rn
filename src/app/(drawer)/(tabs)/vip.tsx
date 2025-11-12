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
  Switch,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VipPosts() {
  const { colors } = useTheme();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [showPurchasedOnly, setShowPurchasedOnly] = React.useState(false);

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

  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    getUserPurchaseList();
  }, [isLoggedIn]);

  const getUserPurchaseList = () => {
    if (isLoggedIn) {
      return fetchUserVipPosts();
    }
    return;
  };

  

  const mergedVipPosts = vipPosts.map((post: any) => {
    const purchased = vipPurchasePosts.some((p: any) => p.id === post.id);
    return { ...post, purchased: purchased ? 1 : 0 };
  });

  const filteredVipPosts = showPurchasedOnly
    ? mergedVipPosts.filter((post: any) => post.purchased)
    : mergedVipPosts;

  const emptyStateMessage = showPurchasedOnly
    ? "You haven't purchased any VIP posts yet."
    : "No posts available at the moment.";

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
        <HeaderBar
          title="VIP Posts"
          subtitle=" Unlock exclusive VIP posts with your points"
        />
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
        <HeaderBar
          title="VIP Posts"
          subtitle=" Unlock exclusive VIP posts with your points"
        />
        {user && (
          <View style={[styles.balanceRow]}>
            <Text
              style={{
                fontSize: moderateScale(16),
              }}
            >
              <Text style={{ color: colors.text }}>Balance: </Text>
              <Text style={{ color: colors.primary }}>{user.points ?? 0}</Text>
              <Text style={{ color: colors.text }}> points </Text>
            </Text>
            <View style={styles.switchGroup}>
              <Text
                style={[
                  styles.switchLabel,
                  {
                    color: !showPurchasedOnly
                      ? colors.primary
                      : colors.textSecondary || colors.muted || colors.text,
                  },
                ]}
              >
                All
              </Text>
              <Switch
                value={showPurchasedOnly}
                onValueChange={setShowPurchasedOnly}
                trackColor={{
                  false: colors.border || "#d3d3d3",
                  true: colors.primary,
                }}
                ios_backgroundColor={colors.border || "#d3d3d3"}
              />
              <Text
                style={[
                  styles.switchLabel,
                  {
                    color: showPurchasedOnly
                      ? colors.primary
                      : colors.textSecondary || colors.muted || colors.text,
                  },
                ]}
              >
                Buy
              </Text>
            </View>
          </View>
        )}

        <View style={[styles.section]}>
          <View style={[isIpad && styles.postsGrid]}>
            {isLoading && <ActivityIndicator color={colors.primary} />}
            {isError && (
              <Text style={{ color: "red" }}>
                Failed to load posts. Pull to refresh.
              </Text>
            )}
            {!isLoading && !isError && filteredVipPosts.length === 0 && (
              <Text
                style={{
                  textAlign: "center",
                  color: colors.muted,
                  marginTop: 20,
                }}
              >
                {emptyStateMessage}
              </Text>
            )}
            {filteredVipPosts.map((post: any, i: number) => (
              <View key={post.id} style={[isIpad && styles.cardWrapper]}>
                <InterstitialAdCard
                  i={i}
                  id={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  feature_image={post.feature_image}
                  feature_image_url={post.feature_image_url}
                  purchase={post.purchased}
                  required_points={post.required_points}
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
    textAlign: "center",
  },
  subtitle: {
    fontSize: moderateScale(16),
    marginTop: verticalScale(4),
    textAlign: "center",
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scale(10),
  },
  switchGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: scale(12),
  },
  switchLabel: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    marginHorizontal: scale(6),
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
