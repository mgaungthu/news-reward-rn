import { useEffect } from "react";
import { Alert, Platform } from "react-native";
import {
  ErrorCode,
  Purchase,
  useIAP,
} from "react-native-iap";
import { validateIAP } from "../api/authApi";

const PRODUCT_IDS = ["points_2000", "points_100"];

export function useIAPHook() {
  const {
    connected,
    products,
    fetchProducts,
    requestPurchase,
    finishTransaction,
  } = useIAP({
    // When a purchase succeeds
    onPurchaseSuccess: async (purchase: Purchase) => {
      try {
        // Correct receipt fields for react-native-iap v14+
        const receipt =
          (purchase as any).transactionReceipt || // iOS StoreKit 2
          (purchase as any).purchaseToken ||      // Android Billing v6
          null;

        if (!receipt) {
          console.log("No receipt found in purchase object:", purchase);
          return;
        }

        // 🔥 Validate receipt on your Laravel backend
        await validateIAP({
          productId: purchase.productId,
          platform: Platform.OS as "ios" | "android",
          receipt,
        });

        // Complete (consume) the purchase
        await finishTransaction({
          purchase,
          isConsumable: true,
        });

        Alert.alert("Success", "Points added to your account!");
      } catch (error) {
        console.log("Purchase validation failed:", error);
        Alert.alert("Error", "Purchase validation failed.");
      }
    },

    // When user cancels or error happens
    onPurchaseError: (error) => {
      if (error.code === ErrorCode.UserCancelled) return;
      console.error("Purchase failed:", error);

      Alert.alert("Purchase Error", "Failed to complete purchase.");
    },
  });

  // Load products when connected to store
  useEffect(() => {
    if (!connected) return;

    const init = async () => {
      try {
        await fetchProducts({
          skus: PRODUCT_IDS,
          type: "in-app",
        });
      } catch (err) {
        console.log("fetchProducts error:", err);
      }
    };

    init();
  }, [connected]);

  // Request purchase wrapper
  const buy = async (productId: string) => {
    try {
      await requestPurchase({
        request: {
          ios: { sku: productId },
          android: { skus: [productId] },
        },
        type: "in-app",
      });
    } catch (error) {
      console.log("Buy error:", error);
      Alert.alert("Error", "Could not start purchase.");
    }
  };

  return {
    products,
    buy,
  };
}