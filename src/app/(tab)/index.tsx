import { getPosts } from "@/api/postApi";
import { InterstitialAdCard } from "@/components/InterstitialAdCard";
import { useAuth } from "@/context/AuthContext";
import { useSettingsStore } from "@/store/settingsSlice";
import { useTheme } from "@/theme/ThemeProvider";
import { moderateScale, scale, verticalScale } from "@/utils/scale";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
  const { fetchSettings, banner_image } = useSettingsStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSettings();
    refetch();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const posts = data?.data || data || [];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: scale(16) }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Lotaya Dinga
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Stay updated & earn rewards!
          </Text>
        </View>
        <View style={styles.banner}>
          <Image
            source={{ uri: banner_image || "https://picsum.photos/800/400" }}
            style={styles.bannerImage}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Latest Posts
            </Text>
            {/* <Link href="/news" asChild>
              <TouchableOpacity>
                <Text style={[styles.link, { color: colors.primary }]}>View All</Text>
              </TouchableOpacity>
            </Link> */}
          </View>

          {isLoading && <ActivityIndicator color={colors.primary} />}
          {isError && (
            <Text style={{ color: "red" }}>
              Failed to load posts. Pull to refresh.
            </Text>
          )}
          {!isLoading && !isError && posts.length === 0 && (
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

          {posts.map((item: any, index: number) => {
            const hasRead = item.user_claims?.some(
              (claim: any) =>
                claim.user_id === user?.id && claim.status === "claimed"
            );

            return (
              <InterstitialAdCard
                key={item.title}
                i={index}
                adKey="news_home"
                threshold={3}
                id={item.id}
                title={item.title}
                excerpt={item.excerpt}
                feature_image={item.feature_image}
                feature_image_url={item.feature_image_url}
                readStatus={hasRead} // 👈 send read status
              />
            );
          })}
        </View>
      </ScrollView>
      {/* <RewardAdButton/> */}
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
  },
  subtitle: {
    fontSize: moderateScale(16),
    marginTop: verticalScale(4),
  },
  banner: {
    borderRadius: scale(12),
    overflow: "hidden",
    marginBottom: verticalScale(24),
  },
  bannerImage: {
    width: "100%",
    height: verticalScale(180),
    borderRadius: scale(12),
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: "600",
  },
  link: {
    fontWeight: "500",
  },
  card: {
    borderRadius: scale(10),
    padding: scale(12),
    marginBottom: verticalScale(10),
  },
  cardTitle: {
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  cardExcerpt: {
    fontSize: moderateScale(14),
    marginTop: verticalScale(4),
  },
  rewardsButton: {
    borderRadius: scale(10),
    paddingVertical: verticalScale(14),
    alignItems: "center",
  },
  rewardsText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  cardImage: {
    width: "100%",
    height: verticalScale(120),
    borderRadius: scale(8),
    marginBottom: verticalScale(8),
  },
});
