import { useSettingsStore } from "@/store/settingsSlice";
import React, { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { AdEventType, AppOpenAd } from "react-native-google-mobile-ads";

export const AppOpenAdComponent: React.FC = () => {
  const appState = useRef(AppState.currentState);
  const isAdShowing = useRef(false);
  const isAdLoaded = useRef(false);
  const lastShownTime = useRef<number | null>(null);
  const { ad_app_open_id } = useSettingsStore();

  useEffect(() => {
    const appOpenAd = AppOpenAd.createForAdRequest(
      ad_app_open_id || "/6499/example/app-open",
      { requestNonPersonalizedAdsOnly: true }
    );

    console.log("[GAM] AppOpenAd initializing with ID:", ad_app_open_id);

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        !isAdShowing.current
      ) {
        const now = Date.now();
        const elapsed = lastShownTime.current
          ? now - lastShownTime.current
          : null;

        if (!elapsed || elapsed > 20000) {
          console.log("[GAM] App became active — preparing to show ad...");
          if (!isAdLoaded.current) appOpenAd.load();
        }
      }
      appState.current = nextAppState;
    });

    const loadedListener = appOpenAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        if (!isAdShowing.current) {
          console.log("[GAM] Ad loaded successfully ✅");
          isAdLoaded.current = true;
          isAdShowing.current = true;
          lastShownTime.current = Date.now();
          appOpenAd.show();
        }
      }
    );

    const closedListener = appOpenAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log("[GAM] Ad closed by user");
        isAdShowing.current = false;
        isAdLoaded.current = false;
      }
    );

    const errorListener = appOpenAd.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.log("[GAM] Failed to load/show ad ❌", error);
        isAdShowing.current = false;
        isAdLoaded.current = false;
      }
    );

    appOpenAd.load();

    return () => {
      subscription.remove();
      loadedListener();
      closedListener();
      errorListener();
    };
  }, []);

  return null;
};