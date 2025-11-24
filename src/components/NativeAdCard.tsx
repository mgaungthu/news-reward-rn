
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  NativeAd,
  NativeAdEventType,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaAspectRatio,
  NativeMediaView
} from "react-native-google-mobile-ads";
import Skeleton from "react-native-reanimated-skeleton";

import { useSettingsStore } from "@/store/settingsSlice";
import { verticalScale } from "react-native-size-matters";

const NativeAdCard: React.FC = () => {
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  const { ad_native_id } = useSettingsStore();
  if (!ad_native_id) {
    return null;
  }
  // Load the ad
  useEffect(() => {
    let isMounted = true;

    NativeAd.createForAdRequest(ad_native_id, {
      aspectRatio: NativeMediaAspectRatio.ANY,
      startVideoMuted: true,
    })
      .then(ad => {
        if (!isMounted) {
          ad.destroy();
          return;
        }
        setNativeAd(ad);
        setIsLoading(false);
      })
      .catch(err => {
        console.log("[NativeAd] load error:", err);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
      if (nativeAd) {
        nativeAd.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Example event listener (click)
  useEffect(() => {
    if (!nativeAd) return;

    const listener = nativeAd.addAdEventListener(
      NativeAdEventType.CLICKED,
      () => {
        console.log("[NativeAd] clicked");
      }
    );

    return () => {
      listener.remove();
    };
  }, [nativeAd]);

  if (isLoading) {
    return (
      <View style={styles.card}>
        {/* Simple skeleton */}
        <Skeleton
            isLoading={isLoading}
            containerStyle={{flex:1}}
            layout={[
              {
                key: "firstLine",
                width: "100%",
                height: 180,
                marginBottom: verticalScale(15),
                borderRadius: 10,
              },
              {
                key: "secLine",
                width: "100%",
                height: 10,
                borderRadius: 10,
              },
              
            ]}
          >
            <Text>Your content</Text>
            <Text>Other content</Text>
          </Skeleton>
      </View>
    );
  }

  if (!nativeAd) {
    return null;
  }

  return (
    <NativeAdView nativeAd={nativeAd} style={styles.nativeWrapper}>
      <View style={styles.card}>
        {/* Top Row: Icon + Headline + Advertiser */}
        <View style={styles.row}>
          {/* Icon */}
          {nativeAd.icon && (
            <NativeAsset assetType={NativeAssetType.ICON}>
              <Image
                source={{ uri: nativeAd.icon.url }}
                style={styles.icon}
              />
            </NativeAsset>
          )}

          {/* Texts */}
          <View style={styles.textContainer}>
            {/* Headline */}
            <NativeAsset assetType={NativeAssetType.HEADLINE}>
              <Text style={styles.headline}>{nativeAd.headline}</Text>
            </NativeAsset>

            {/* Body / Tagline */}
            {nativeAd.body && (
              <NativeAsset assetType={NativeAssetType.BODY}>
                <Text style={styles.body} numberOfLines={2}>
                  {nativeAd.body}
                </Text>
              </NativeAsset>
            )}

            {/* Advertiser */}
            {nativeAd.advertiser && (
              <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                <Text style={styles.advertiser}>{nativeAd.advertiser}</Text>
              </NativeAsset>
            )}
          </View>
        </View>

        {/* Media (image / video) */}
        <View style={styles.mediaContainer}>
          <NativeMediaView
            resizeMode="cover"
            style={styles.media}
          />
        </View>

        {/* "Sponsored" label – required by policy */}
        <Text style={styles.sponsored}>Sponsored</Text>
      </View>
    </NativeAdView>
  );
};

export default NativeAdCard;

const styles = StyleSheet.create({
  nativeWrapper: {
    width: "100%",
    overflow: "hidden",
  },
  card: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 12,
    elevation: 2,
    // shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    marginVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  headline: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  body: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },
  advertiser: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  mediaContainer: {
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  media: {
    width: "100%",
    height: 180,
    backgroundColor: "#eee",
  },
  sponsored: {
    marginTop: 6,
    fontSize: 11,
    color: "#999",
  },

  // Skeletons
  iconSkeleton: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  textSkeletonContainer: {
    flex: 1,
    marginLeft: 10,
  },
  textSkeleton: {
    height: 12,
    borderRadius: 999,
    backgroundColor: "#eee",
    marginBottom: 6,
    width: "80%",
  },
  mediaSkeleton: {
    marginTop: 10,
    height: 180,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
});