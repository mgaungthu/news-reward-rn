import { buyVipPost } from "@/api/postApi";
import { SUCCESS_MESSAGES } from "@/constants/messages";
import { useAuth } from "@/context/AuthContext";
import { useAds } from "@/hooks/useAds";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useVipPostStore } from "@/store/useVipPostStore";
import { useTheme } from "@/theme/ThemeProvider";
import { handleApiError } from "@/utils/handleApiError";
import { prettyDate } from "@/utils/prettyDate";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // 👈 Add this
import React, { memo, useCallback } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { scale } from "react-native-size-matters";
import { CustomModal } from "./CustomModal";

type Props = {
  i: number;
  id: number | string;
  adKey?: string;
  threshold?: number;
  feature_image?: string;
  feature_image_url: string;
  title?: string;
  excerpt?: string;
  key?: string;
  purchase?: number;
  required_points?: number;
  readStatus?: boolean;
  created_at?: string;
  is_vip?:boolean
};

function InterstitialAdCardBase({
  i,
  adKey = "news_card",
  threshold = 3,
  id = 0,
  feature_image = "https://picsum.photos/800/400",
  feature_image_url,
  title = `Breaking News Headline ${i}`,
  excerpt = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  purchase,
  required_points = 0,
  readStatus, // 👈 add this
  created_at,
  is_vip=0
}: Props) {
  const { maybeShowInterstitialOnAction } = useAds();
  const { colors } = useTheme();
  const router = useRouter(); // 👈 for navigation
  const { isLoggedIn, getUser } = useAuth();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [buyModalVisible, setBuyModalVisible] = React.useState(false);
  const [buyMessage, setBuyMessage] = React.useState("");
  const [buyConfirmVisible, setBuyConfirmVisible] = React.useState(false);

  const { fetchUserVipPosts } = useVipPostStore();
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const isFavorite = useFavoritesStore(
    useCallback((state) => state.favorites.some((fav) => fav.id === id), [id])
  );

  const handlePress = useCallback(() => {
    if (adKey === "vip_card" && !isLoggedIn) {
      setModalVisible(true);
      return;
    }

    if (adKey === "vip_card" && isLoggedIn) {
      if (purchase === 1) {
        // ✅ Already purchased, go directly to detail page
      router.push({
        pathname: `/posts/${id}`,
        params: { id },
      });
        return;
      }
      // Not purchased yet, ask to buy
      setBuyConfirmVisible(true);
      return;
    }

    // ✅ Wait for ad to finish before navigating
    maybeShowInterstitialOnAction(adKey, threshold);
    // ✅ Navigate after ad is closed or fails
    router.push({
      pathname: "/posts/[id]",
      params: { id: String(id), title, feature_image, excerpt },
    });
  }, [
    adKey,
    threshold,
    maybeShowInterstitialOnAction,
    router,
    i,
    title,
    feature_image,
    excerpt,
    isLoggedIn,
    purchase,
  ]);

  const toggleFavorite = useCallback(() => {
    if (!isLoggedIn) {
      Alert.alert("Sign in required", "Please sign in to save favourites.");
      return;
    }

    if (isFavorite) {
      removeFavorite(id);
      return;
    }

    addFavorite({
      id,
      title,
      excerpt,
      feature_image,
      feature_image_url,
      created_at,
      is_vip,
    });
  }, [
    addFavorite,
    created_at,
    excerpt,
    feature_image,
    feature_image_url,
    id,
    isFavorite,
    isLoggedIn,
    removeFavorite,
    title,
  ]);

  const handleBuyVipPost = async () => {
    try {
      const res = await buyVipPost(id);

      // ✅ If backend includes message, display it
      if (res?.message) {
        setBuyMessage(SUCCESS_MESSAGES.VIP_PURCHASE_SUCCESS);
      } else {
        setBuyMessage(SUCCESS_MESSAGES.VIP_PURCHASE_SUCCESS);
      }
      getUser();
      fetchUserVipPosts();
    } catch (error: any) {
      const message = handleApiError(error);
      setBuyMessage(message);
    } finally {
      setBuyConfirmVisible(false);
      setBuyModalVisible(true);
    }
  };

  return (
    <>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.container,
          {
            backgroundColor: colors.surface ?? "#ffffff",
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <View style={styles.imageWrapper}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: feature_image_url }}
              style={{
                width: "100%",
                height: "100%",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                opacity: readStatus
                  ? 0.4
                  : adKey === "vip_card" && purchase !== 1
                  ? 0.5
                  : 1,
              }}
              resizeMode="cover"
            />
            {readStatus && (
                <View style={styles.claimedBadge}>
                  <Text style={{ color: "#fff", fontSize: 12 }}>Claimed</Text>
                </View>
              )}
            <View
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              {isLoggedIn && (
                <Pressable
                  onPress={toggleFavorite}
                  hitSlop={10}
                  style={styles.favoriteButton}
                >
                  <Ionicons
                    name={isFavorite ? "heart" : "heart-outline"}
                    size={scale(18)}
                    color={isFavorite ? colors.primary : "#ffffff"}
                  />
                </Pressable>
              )}

              {adKey === "vip_card" && (
                <View style={styles.star}>
                  <Ionicons style={styles.starText} name="star" />
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text ?? "#111" }]}>
            {title}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: scale(10),
            }}
          >
            <Text style={{ fontSize: 13, color: colors.muted }}>
              {created_at ? prettyDate(created_at) : ""}
            </Text>
            {adKey === "vip_card" && (
              <Text
                style={[
                  styles.requirePoint,
                  { color: colors.primary ?? "#EC3E38", marginTop: 0 },
                ]}
              >
                {required_points ?? 0} Points
              </Text>
            )}
          </View>
        </View>
      </Pressable>
      <CustomModal
        visible={buyConfirmVisible}
        type="info"
        message={"This is a VIP post.\nDo you want to unlock?"}
        onClose={() => setBuyConfirmVisible(false)}
      >
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleBuyVipPost}
        >
          <Text style={styles.buttonText}>Unlock Now</Text>
        </Pressable>
      </CustomModal>
      <CustomModal
        visible={modalVisible}
        type="error"
        message="Login required to read VIP posts."
        onClose={() => setModalVisible(false)}
      >
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => {
            setModalVisible(false);
            router.push("/login");
          }}
        >
          <Text style={styles.buttonText}>Go to Login</Text>
        </Pressable>
      </CustomModal>
      <CustomModal
        visible={buyModalVisible}
        type="info"
        message={buyMessage}
        onClose={() => setBuyModalVisible(false)}
      />
    </>
  );
}

export const InterstitialAdCard = memo(InterstitialAdCardBase);

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: "visible",
    marginBottom: 16,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android shadow
    elevation: 3,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 2,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  star: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 4,
    width: 35,
    height: 35,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  starText: {
    color: "#FFD700",
    fontSize: 18,
    textAlign: "center",
  },
  favoriteButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    padding: 6,
  },
  claimedBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  content: {
    padding: 12,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
  },
  excerpt: {
    marginTop: 4,
    fontSize: 13,
  },
  requirePoint: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "right",
    marginTop: scale(10),
  },
  button: {
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
