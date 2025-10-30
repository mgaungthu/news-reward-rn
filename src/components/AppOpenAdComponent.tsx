import { useSettingsStore } from "@/store/settingsSlice";
import React, { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { AdEventType, AppOpenAd } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? '/6499/example/app-open' : '/YOUR_NETWORK_ID/YOUR_AD_UNIT_NAME';
const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});



export const AppOpenAdComponent: React.FC = () => {
  const appState = useRef(AppState.currentState);
  const isAdShowing = useRef(false);
  const lastShownTime = useRef<number | null>(null); // track last show time


   const { ad_app_open_id} = useSettingsStore();


  
  useEffect(() => {
    console.log('[GAM] AppOpenAd initializing with ID:', ad_app_open_id);

    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('[GAM] App state changed:', nextAppState);

      const now = Date.now();
      const elapsed = lastShownTime.current ? now - lastShownTime.current : null;

      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        !isAdShowing.current &&
        (!elapsed || elapsed > 20000) // only show again after 20s
      ) {
        console.log('[GAM] App became active — loading ad...');
        appOpenAd.load();
      }

      appState.current = nextAppState;
    });

    const loadedListener = appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
      console.log('[GAM] Ad loaded successfully ✅');
      if (!isAdShowing.current) {
        isAdShowing.current = true;
        lastShownTime.current = Date.now();
        appOpenAd.show();
      }
    });

    const closedListener = appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('[GAM] Ad closed by user');
      isAdShowing.current = false;
    });

    const errorListener = appOpenAd.addAdEventListener(AdEventType.ERROR, error => {
      console.log('[GAM] Failed to load/show ad ❌', error);
      isAdShowing.current = false;
    });

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