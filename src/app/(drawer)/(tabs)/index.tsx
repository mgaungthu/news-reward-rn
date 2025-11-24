import { getAnalytics, logEvent } from "@react-native-firebase/analytics";
import { useIsFocused } from "@react-navigation/native";
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

import * as Device from "expo-device";
import { SafeAreaView } from "react-native-safe-area-context";

import { getPosts } from "@/api/postApi";
import { InterstitialAdCard } from "@/components/InterstitialAdCard";
import { useAuth } from "@/context/AuthContext";
import { useSettingsStore } from "@/store/settingsSlice";
import { useTheme } from "@/theme/ThemeProvider";
import { moderateScale, scale, verticalScale } from "@/utils/scale";

import { CustomTextInput } from "@/components/CustomTextInput";
import { HeaderBar } from "@/components/HeaderBar";
import NativeAdCard from "@/components/NativeAdCard";
import { isTablet } from "@/utils/lib";
import { useRouter } from "expo-router";

export default function HomePage() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
  const { fetchSettings, banner_image } = useSettingsStore();

  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const isFocused = useIsFocused();

  const logScreenView = async (screenName: string) => {
    const analyticsInstance = getAnalytics();
    await logEvent(analyticsInstance, "screen_view", {
      firebase_screen: screenName,
      firebase_screen_class: screenName,
    });
  };

  useEffect(() => {
    if (isFocused) {
      refetch();
      fetchSettings();
      logScreenView("home");
    }
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    fetchSettings();
    setRefreshing(false);
  };

  const posts = data?.data || data || [];

  const { width } = Dimensions.get("window");
  const isIpad =
    (Platform.OS === "ios" && width >= 768) ||
    Device.deviceType === Device.DeviceType.TABLET;

  const handleSearchSubmit = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      return;
    }

    router.push({ pathname: "/search", params: { q: trimmed } });
    setSearchTerm("");
  };

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
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <HeaderBar
          title="Lotaya Dinga"
          subtitle="Stay updated & earn rewards!"
        />

        <View style={styles.banner}>
          <Image source={{ uri: banner_image }} style={styles.bannerImage} />
        </View>

        <View style={{ marginVertical: verticalScale(10) }}>
          <CustomTextInput
            placeholder="Search..."
            icon="search"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
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
                (claim: any) =>
                  claim.user_id === user?.id && claim.status === "claimed"
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
                  {index !== 0 && (index + 1) % 3 === 0 && (
                    <View
                      style={{
                        justifyContent: "center",
                      }}
                    >
                      <NativeAdCard />
                    </View>
                  )}
                </View>
              );
            })}
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
    fontSize: moderateScale(18),
    fontWeight: "700",
  },
  subtitle: {
    fontSize: moderateScale(12),
    marginTop: verticalScale(4),
  },
  banner: {
    borderRadius: scale(12),
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: isTablet() ? verticalScale(220) : verticalScale(160),
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
