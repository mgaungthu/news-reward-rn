import { getPosts } from "@/api/postApi";
import { AppOpenAdComponent } from "@/components/AppOpenAdComponent";
import { InterstitialAdCard } from "@/components/InterstitialAdCard";
import { useAuth } from "@/context/AuthContext";
import { useSettingsStore } from "@/store/settingsSlice";
import { useTheme } from "@/theme/ThemeProvider";
import { moderateScale, scale, verticalScale } from "@/utils/scale";
import { getAnalytics, logEvent } from '@react-native-firebase/analytics';
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default  function HomePage() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
  const { fetchSettings, banner_image } = useSettingsStore();

  const [refreshing, setRefreshing] = useState(false);


const logScreenView = async (screenName: string) => {
  const analyticsInstance = getAnalytics();
  await logEvent(analyticsInstance, 'screen_view', {
    firebase_screen: screenName,
    firebase_screen_class: screenName,
  });
};

  useEffect(() => {
    fetchSettings();
    refetch();
    logScreenView('home');
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    fetchSettings();
    setRefreshing(false);
  };

  const posts = data?.data || data || [];

  const { width } = Dimensions.get("window");
  const isIpad = Platform.OS === "ios" && width >= 768;

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

        <View style={[styles.section]}>
          <View style={[isIpad && styles.postsGrid]}>
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
                (claim: any) => claim.user_id === user?.id && claim.status === "claimed"
              );

              return (
                <View key={item.id} style={[isIpad && styles.cardWrapper]}>
                  <InterstitialAdCard
                    i={index}
                    adKey="news_home"
                    threshold={3}
                    id={item.id}
                    title={item.title}
                    excerpt={item.excerpt}
                    feature_image={item.feature_image}
                    feature_image_url={item.feature_image_url}
                    created_at={item.created_at}
                    readStatus={hasRead}
                  />
                </View>
              );
            })}
          </View>
<<<<<<< HEAD

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
                claim.user_id === user.id && claim.status === "claimed"
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
                  created_at={item.created_at}
                readStatus={hasRead} // 👈 send read status
              />
            );
          })}
        </View>
      </ScrollView>
      <AppOpenAdComponent/>
      {/* <RewardAdButton/> */}
=======
        </View>
      </ScrollView>
     
>>>>>>> 7db23fb (bk)
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
    height:
  Platform.OS === "ios" && (Platform as any).isPad
    ? verticalScale(220)
    : verticalScale(160),
    borderRadius: scale(12),
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
