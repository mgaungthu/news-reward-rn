import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/Header";
import { InterstitialAdCard } from "@/components/InterstitialAdCard";
import { useAuth } from "@/context/AuthContext";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useTheme } from "@/theme/ThemeProvider";
import { scale, verticalScale } from "@/utils/scale";

export default function FavoritesScreen() {
  const { colors } = useTheme();
  const { isLoggedIn } = useAuth();
  const favorites = useFavoritesStore((state) => state.favorites);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: scale(16) }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >

        <Header title="Favorites" showBack={true} />

        {!isLoggedIn ? (
          <Text style={[styles.helperText, { color: colors.muted }]}>
            Sign in to start saving your favourite posts.
          </Text>
        ) : favorites.length === 0 ? (
          <Text style={[styles.helperText, { color: colors.muted }]}>
            You have not saved any favourites yet.
          </Text>
        ) : (
          <View style={styles.list}>
            {favorites.map((item, index) => (
              <View key={`${item.id}-${index}`} style={styles.cardWrapper}>
                <InterstitialAdCard
                  i={index}
                  adKey={item.is_vip?  "vip_card": "favorites"}
                  id={item.id}
                  title={item.title}
                  excerpt={item.excerpt}
                  feature_image={item.feature_image}
                  feature_image_url={item.feature_image_url || item.feature_image}
                  created_at={item.created_at}
                />
              </View>
            ))}
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
    marginTop: verticalScale(20),
    fontSize: scale(13),
    textAlign: "center",
  },
  list: {
    marginTop: verticalScale(16),
    gap: verticalScale(12),
  },
  cardWrapper: {
    borderRadius: scale(12),
    overflow: "hidden",
  },
});
