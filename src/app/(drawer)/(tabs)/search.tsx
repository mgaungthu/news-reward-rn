import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getPosts } from "@/api/postApi";
import { CustomTextInput } from "@/components/CustomTextInput";
import { HeaderBar } from "@/components/HeaderBar";
import { InterstitialAdCard } from "@/components/InterstitialAdCard";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/theme/ThemeProvider";
import { scale, verticalScale } from "@/utils/scale";

export default function SearchPage() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();
  const currentQuery = typeof params.q === "string" ? params.q : "";

  const [searchValue, setSearchValue] = useState(currentQuery);

  useEffect(() => {
    setSearchValue(currentQuery);
  }, [currentQuery]);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const posts = data?.data || data || [];

  const filteredPosts = useMemo(() => {
    const term = currentQuery.trim().toLowerCase();
    if (!term) {
      return [];
    }

    return posts.filter((item: any) => {
      const title = (item?.title ?? "").toLowerCase();
      const excerpt = (item?.excerpt ?? "").toLowerCase();
      return title.includes(term) || excerpt.includes(term);
    });
  }, [posts, currentQuery]);

  const handleSubmitSearch = () => {
    const trimmed = searchValue.trim();
    if (!trimmed) {
      return;
    }

    router.setParams({ q: trimmed });
  };

  const refreshing = isFetching && !isLoading;
  const showResults = Boolean(currentQuery.trim());

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: scale(16) }}
        keyboardShouldPersistTaps="handled"
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={refetch}
        //     tintColor={colors.primary}
        //   />
        // }
      >
        <HeaderBar
          title="Search"
          subtitle="Find by keywords"
        />

        <View style={{ marginVertical: verticalScale(10) }}>
          <CustomTextInput
            placeholder="Search..."
            icon={searchValue ? "close" : "search"}
            value={searchValue}
            onChangeText={setSearchValue}
            onSubmitEditing={handleSubmitSearch}
            onIconPress={() => setSearchValue('')}
            returnKeyType="search"
          />
        </View>

        {!showResults && !isLoading && (
          <Text style={[styles.helperText, { color: colors.muted }]}>
            Type a keyword above and press search to view matching posts.
          </Text>
        )}

        {isLoading && (
          <ActivityIndicator
            style={{ marginTop: verticalScale(20) }}
            color={colors.primary}
          />
        )}

        {isError && !isLoading && (
          <Text style={[styles.errorText, { color: colors.danger ?? "#ff4d4f" }]}>
            Failed to load posts. Pull to refresh and try again.
          </Text>
        )}

        {showResults && !isLoading && !isError && (
          <View style={styles.resultsWrapper}>
            {filteredPosts.length === 0 ? (
              <Text style={{ color: colors.muted }}>
                No results found for "{currentQuery}".
              </Text>
            ) : (
              <>
                <Text style={{ color: colors.text, fontSize: scale(14), marginBottom:verticalScale(10) }}>
                  {filteredPosts.length} result{filteredPosts.length > 1 ? "s" : ""} found
                </Text>
                {filteredPosts.map((item: any, index: number) => {
                  const hasRead = item.user_claims?.some(
                    (claim: any) =>
                      claim.user_id === user?.id && claim.status === "claimed"
                  );

                  return (
                    <View key={`${item.id}-${index}`} style={styles.cardWrapper}>
                      <InterstitialAdCard
                        i={index}
                        adKey="search"
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
              </>
            )}
          </View>
        )}
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
  helperText: {
    fontSize: scale(12),
  },
  errorText: {
    marginTop: verticalScale(16),
    fontSize: scale(12),
  },
  resultsWrapper: {
    marginTop: verticalScale(10),
  },
  cardWrapper: {
    borderRadius: scale(12),
    overflow: "hidden",
  },
});
