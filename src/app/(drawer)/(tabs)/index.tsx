import { getAnalytics, logEvent } from "@react-native-firebase/analytics";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Skeleton from "react-native-reanimated-skeleton";

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

  const [page, setPage] = useState(1);
  const [loadingChunk, setLoadingChunk] = useState(false);

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
      <FlatList
        data={posts.slice(0, page * 2)}
        showsVerticalScrollIndicator={false}
        initialNumToRender={2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <>
            <HeaderBar
              title="Lotaya Dinga"
              subtitle="Stay updated & earn rewards!"
            />

            <View style={styles.banner}>
              <Image
                source={{ uri: banner_image }}
                style={styles.bannerImage}
              />
            </View>

            <View style={{ marginTop: verticalScale(15) }}>
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
              </View>
            </View>
          </>
        }
        renderItem={({ item, index }) => {
          const hasRead = item.user_claims?.some(
            (claim: any) =>
              claim.user_id === user?.id && claim.status === "claimed"
          );

          return (
            <View style={[isIpad && styles.cardWrapper]}>
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

              {index !== 0 && (index + 1) % 2 === 0 && <NativeAdCard />}
            </View>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        numColumns={isIpad ? 2 : 1}
        columnWrapperStyle={
          isIpad ? { justifyContent: "space-between" } : undefined
        }
        ListFooterComponent={() =>
          loadingChunk ? (
            <View style={{ width: "100%", }}>
              <Skeleton
                isLoading={loadingChunk}
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
                    key: "firstLine",
                    width: "100%",
                    height: 15,
                    marginBottom: verticalScale(15),
                    borderRadius: 10,
                  },
                ]}
              />
            </View>
          ) : (
            <View style={{ height: 30 }} />
          )
        }
        onEndReachedThreshold={0.2}
        onEndReached={() => {
          if (!loadingChunk && page * 2 < posts.length) {
            setLoadingChunk(true);
            setTimeout(() => {
              setPage((prev) => prev + 1);
              setLoadingChunk(false);
            }, 800);
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: scale(16),
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
