import { buyVipPost } from "@/api/postApi";
import { SUCCESS_MESSAGES } from "@/constants/messages";
import { useAuth } from "@/context/AuthContext";
import { useAds } from "@/hooks/useAds";
import { useVipPostStore } from "@/store/useVipPostStore";
import { useTheme } from "@/theme/ThemeProvider";
import { handleApiError } from "@/utils/handleApiError";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // 👈 Add this
import React, { memo, useCallback } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { CustomModal } from "./CustomModal";

type Props = {
  i: number;
  id: number;
  adKey?: string;
  threshold?: number;
  feature_image?: string;
  feature_image_url: string;
  title?: string;
  excerpt?: string;
  key?: string;
  purchase?: number;
  readStatus?: boolean; 
  created_at?: string;
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
  readStatus, // 👈 add this
    created_at,
}: Props) {
  const { maybeShowInterstitialOnAction } = useAds();
  const { colors } = useTheme();
  const router = useRouter(); // 👈 for navigation
  const { isLoggedIn } = useAuth();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [buyModalVisible, setBuyModalVisible] = React.useState(false);
  const [buyMessage, setBuyMessage] = React.useState("");
  const [buyConfirmVisible, setBuyConfirmVisible] = React.useState(false);

  const { fetchUserVipPosts } = useVipPostStore();

  const handlePress = useCallback(() => {
    // if (adKey === "vip_card" && !isLoggedIn) {
    //   setModalVisible(true);
    //   return;
    // }

    // if (adKey === "vip_card" && isLoggedIn) {
    //   if (purchase === 1) {
    //     // ✅ Already purchased, go directly to detail page
    //     router.push({
    //       pathname: "/news/[id]",
    //       params: { id, title, feature_image, excerpt },
    //     });
    //     return;
    //   }
    //   // Not purchased yet, ask to buy
    //   setBuyConfirmVisible(true);
    //   return;
    // }

    // ✅ Wait for ad to finish before navigating
    maybeShowInterstitialOnAction(adKey, threshold);
    // ✅ Navigate after ad is closed or fails
    router.push({
      pathname: "/news/[id]",
      params: { id, title, feature_image, excerpt },
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

  const handleBuyVipPost = async () => {
    try {
      const res = await buyVipPost(id);

      // ✅ If backend includes message, display it
      if (res?.message) {
        setBuyMessage(res.message);
      } else {
        setBuyMessage(SUCCESS_MESSAGES.VIP_PURCHASE_SUCCESS);
      }

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
                opacity: readStatus
                  ? 0.4
                  : adKey === "vip_card" && purchase !== 1
                  ? 0.5
                  : 1,
              }}
              resizeMode="cover"
            />
            {readStatus && (
              <View
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 12 }}>Claimed</Text>
              </View>
            )}
            {adKey === "vip_card" && (
              <View style={styles.star}>
                <Ionicons style={styles.starText} name="star" />
              </View>
            )}
          </View>
          
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text ?? "#111" }]}>
            {title}
          </Text>

          <Text style={[styles.excerpt, { color: colors.muted ?? "#666" }]}>
            {excerpt}
          </Text>
        </View>
      </Pressable>
      <CustomModal
        visible={buyConfirmVisible}
        type="info"
        message="This is a VIP post. Do you want to buy access?"
        onClose={() => setBuyConfirmVisible(false)}
      >
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleBuyVipPost}
        >
          <Text style={styles.buttonText}>Buy Now</Text>
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
    shadowColor: '#000',
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
    position: "absolute",
    top: 8,
    right: 8,
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
