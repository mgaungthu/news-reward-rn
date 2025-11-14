import { useSettingsStore } from "@/store/settingsSlice";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";


export const BannerAdComponent = () => {
  const [loaded, setLoaded] = useState(false);

      const { ad_banner_id} =
      useSettingsStore();

  if (!ad_banner_id) {
    return null;
  }

  return (
    <View style={{ alignItems: "center", minHeight: 60 }}>
      {ad_banner_id && (
        <>
          {!loaded && <ActivityIndicator />}
          <BannerAd
            unitId={ad_banner_id}
            size={BannerAdSize.BANNER}
            onAdLoaded={() => setLoaded(true)}
            onAdFailedToLoad={(error) =>
              console.warn("❌ [GAM] Banner failed to load:", error)
            }
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </>
      )}
      
    </View>
  );
};