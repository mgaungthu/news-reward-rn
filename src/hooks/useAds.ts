import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AdEventType,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";

import { createAds } from "@/utils/lib";

// ---------- Storage & Rules ----------
const STORAGE_KEYS = {
  REWARDED_LAST_SHOWN_AT: "ads:rewarded:lastShownAt",
} as const;

const REWARDED_COOLDOWN_MS = 5 * 60 * 1000; // 4 minutes


// ---------- Compat: some versions don't export CLOSED/ERROR for Rewarded ----------
const REWARDED_EVENTS = {
  LOADED: RewardedAdEventType.LOADED,
  EARNED_REWARD: RewardedAdEventType.EARNED_REWARD,
  CLOSED: (RewardedAdEventType as any).CLOSED ?? ("closed" as any),
  OPENED: (RewardedAdEventType as any).OPENED ?? ("opened" as any),
  ERROR:
    (RewardedAdEventType as any).ERROR ??
    (AdEventType as any).ERROR ??
    ("error" as any),
};

type KeyedCounter = Record<string, number>;

type AdsContextValue = {
  interstitialLoaded: boolean;
  rewardedLoaded: boolean;
  rewardedNextInMs: any;
  rewardedInterstitialLoadCount: number;
  showRewardedWithCooldown: (
    onReward?: (amount: number, type?: string) => void,
    onBlocked?: (msRemaining: number) => void
  ) => Promise<boolean>;
  getRewardedRemainingMs: () => Promise<number>;
  resetRewardedCooldown: () => Promise<void>;
  refreshRewardedRemaining: () => Promise<number>;
  showInterstitialEvery3Clicks: () => Promise<void>;
  showRewardedInterstitialWithCooldown: (
    onReward?: (amount: number, type?: string) => void,
    onBlocked?: (msRemaining: number) => void,
    onClosed?: () => void
  ) => Promise<boolean>;
};

const AdsContext = createContext<AdsContextValue | null>(null);

export const AdsProvider = ({ children }: { children: ReactNode }) => {
  const [interstitial, setInterstitial] = useState<any>(null);
  const [rewarded, setRewarded] = useState<any>(null);
  const [rewardedInterstitial, setRewardedInterstitial] = useState<any>(null);

  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [rewardedLoaded, setRewardedLoaded] = useState(false);
  const [rewardedInterstitialLoaded, setRewardedInterstitialLoaded] =
    useState(false);
  const [rewardedNextInMs, setRewardedNextInMs] = useState<number>(0);
  const [rewardedInterstitialLoadCount, setRewardedInterstitialLoadCount] =
    useState(0);

  const loadingInterstitialRef = useRef(false);
  const loadingRewardedRef = useRef(false);
  const loadingRewardedInterstitialRef = useRef(false);

  const onRewardRef = useRef<null | ((amount: number, type?: string) => void)>(
    null
  );

    const NormaloRewardRef = useRef<null | ((amount: number, type?: string) => void)>(
    null
  );

  

  // ✅ new: remember we owe a show once load completes
  const pendingInterstitialShowRef = useRef(false);

  // Initialize ads once in the provider
  useEffect(() => {
    const ads = createAds();
    setInterstitial(ads.interstitial);
    setRewarded(ads.rewarded);
    setRewardedInterstitial(ads.rewardedInterstitial);
  }, []);

  // ---------- helpers ----------
  const getRewardedRemainingMs = useCallback(async () => {
    const last = await AsyncStorage.getItem(
      STORAGE_KEYS.REWARDED_LAST_SHOWN_AT
    );
    const lastMs = last ? Number(last) : 0;
    const now = Date.now();
    return Math.max(0, lastMs + REWARDED_COOLDOWN_MS - now);
  }, []);

  const refreshRewardedRemaining = useCallback(async () => {
    const remaining = await getRewardedRemainingMs();
    setRewardedNextInMs(remaining);
    return remaining;
  }, [getRewardedRemainingMs]);

  const startRewardCooldown = useCallback(async () => {
    const now = Date.now();
    await AsyncStorage.setItem(
      STORAGE_KEYS.REWARDED_LAST_SHOWN_AT,
      String(now)
    );
    setRewardedNextInMs(REWARDED_COOLDOWN_MS);
  }, []);

  // ---------- Interstitial wiring ----------
  useEffect(() => {
    if (!interstitial) return;

    let mounted = true;

    const unsubLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        if (!mounted) return;
        loadingInterstitialRef.current = false;
        setInterstitialLoaded(true);

        // ✅ if user hit the threshold while we were loading, show now
        if (pendingInterstitialShowRef.current) {
          pendingInterstitialShowRef.current = false;
          interstitial.show();
        }
      }
    );

    const unsubClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        if (!mounted) return;
        setInterstitialLoaded(false);
        if (!loadingInterstitialRef.current) {
          loadingInterstitialRef.current = true;
          interstitial.load();
        }
      }
    );

    const unsubError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      () => {
        if (!mounted) return;
        setInterstitialLoaded(false);
        loadingInterstitialRef.current = false; // allow retry later
        pendingInterstitialShowRef.current = false; // cancel pending if failed
      }
    );

    if (!loadingInterstitialRef.current) {
      loadingInterstitialRef.current = true;
      interstitial.load();
    }

    return () => {
      mounted = false;
      unsubLoaded();
      unsubClosed();
      unsubError();
    };
  }, [interstitial]);

  useEffect(() => {
    if (!rewardedInterstitial) return;

    let mounted = true;

    const unsubEarned = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward: any) => {
        if (onRewardRef.current) {

          onRewardRef.current(Number(reward?.amount ?? 1), reward?.type);
        }
      }
    );

    // When ad is loaded
    const unsubLoaded = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        if (!mounted) return;
        loadingRewardedInterstitialRef.current = false;
        setRewardedInterstitialLoaded(true);
        console.log("[GAM] Rewarded Interstitial Loaded");
      }
    );

    // When user closes the ad
    const unsubClosed = rewardedInterstitial.addAdEventListener(
      REWARDED_EVENTS.CLOSED,
      () => {
        if (!mounted) return;
        console.log("[GAM] Rewarded Interstitial Closed");

        setRewardedInterstitialLoaded(false);
        // Reload for next use
        if (!loadingRewardedInterstitialRef.current) {
          loadingRewardedInterstitialRef.current = true;
          rewardedInterstitial.load();
        }
      }
    );

    // When ad fails to load
    const unsubError = rewardedInterstitial.addAdEventListener(
      REWARDED_EVENTS.ERROR,
      (error: any) => {
        if (!mounted) return;
        console.log("[GAM] Rewarded Interstitial ERROR:", error);

        setRewardedInterstitialLoaded(false);
        loadingRewardedInterstitialRef.current = false; // allow retry
      }
    );

    // Initial load
    if (!loadingRewardedInterstitialRef.current) {
      loadingRewardedInterstitialRef.current = true;
      rewardedInterstitial.load();
    }

    return () => {
      mounted = false;
      unsubLoaded();
      unsubClosed();
      unsubError();
      unsubEarned();
    };
  }, [rewardedInterstitial]);

  const showRewardedInterstitialWithCooldown = useCallback(
    async (
      onReward?: (amount: number, type?: string) => void,
      onBlocked?: (msRemaining: number) => void,
      onClosed?: () => void
    ) => {
      // 1. Cooldown check
      const remaining = await getRewardedRemainingMs();
      if (remaining > 0) {
        setRewardedNextInMs(remaining);
        onBlocked?.(remaining);
        return false;
      }

      onRewardRef.current = onReward ?? null;
      // 2. Check if RI is ready
      if (!rewardedInterstitialLoaded || !rewardedInterstitial?.loaded) {
        console.log("[GAM] Rewarded Interstitial not ready");
        if (rewardedInterstitialLoadCount < 50) {
          setRewardedInterstitialLoadCount(rewardedInterstitialLoadCount + 1);
          rewardedInterstitial.load();
        } else {
          console.log(
            "[GAM] Rewarded Interstitial load prevented (limit reached)"
          );
        }
        return false;
      }

      // 4. Show ad
      try {
        await rewardedInterstitial.show();

        // ⭐ cooldown must start only if earned
        await startRewardCooldown();

        return true; // 👉 TRUE only when rewarded
      } catch (e) {
        console.log("[GAM] show() failed:", e);
        return false;
      }
    },
    [
      rewardedInterstitialLoaded,
      rewardedInterstitial,
      getRewardedRemainingMs,
      startRewardCooldown,
      rewardedInterstitialLoadCount,
      setRewardedInterstitialLoadCount,
    ]
  );

  // ---------- Rewarded wiring (with compat) ----------
  useEffect(() => {
    if (!rewarded) return;

    let mounted = true;

    const unsubLoaded = rewarded.addAdEventListener(
      REWARDED_EVENTS.LOADED,
      () => {
        if (!mounted) return;
        loadingRewardedRef.current = false;
        setRewardedLoaded(true);
      }
    );

    const unsubClosed = rewarded.addAdEventListener(
      REWARDED_EVENTS.CLOSED,
      () => {
        if (!mounted) return;
        setRewardedLoaded(false);
        if (!loadingRewardedRef.current) {
          loadingRewardedRef.current = true;
          rewarded.load();
        }
      }
    );

    const unsubError = rewarded.addAdEventListener(
      REWARDED_EVENTS.ERROR,
      () => {
        if (!mounted) return;
        setRewardedLoaded(false);
        loadingRewardedRef.current = false; // allow retry later
      }
    );

          // One‑time reward listener
    const unsubEarned = rewarded.addAdEventListener(
        REWARDED_EVENTS.EARNED_REWARD,
        (reward: any) => {
         if (NormaloRewardRef.current) {
          console.log("Normal calling");
          NormaloRewardRef.current(Number(reward?.amount ?? 1), reward?.type);
        }
        }
      );

    if (!loadingRewardedRef.current) {
      loadingRewardedRef.current = true;
      rewarded.load();
    }

    return () => {
      mounted = false;
      unsubLoaded();
      unsubEarned();
      unsubClosed && unsubClosed();
      unsubError && unsubError();
    };
  }, [rewarded]);

  useEffect(() => {
    refreshRewardedRemaining();
  }, [refreshRewardedRemaining]);

  // ---------- Public API ----------

  // Show rewarded if cooldown passed; otherwise call onBlocked(msRemaining)
  const showRewardedWithCooldown = useCallback(
    async (
      onReward?: (amount: number, type?: string) => void,
      onBlocked?: (msRemaining: number) => void
    ) => {
      const remaining = await getRewardedRemainingMs();

      if (remaining > 0) {
        setRewardedNextInMs(remaining);
        onBlocked?.(remaining);
        return false;
      }


       NormaloRewardRef.current = onReward ?? null;

      // ❌ Rewarded not ready → try Rewarded Interstitial
      if (!rewarded || !rewardedLoaded || !rewarded.loaded) {
        console.log(
          "[GAM] Rewarded not ready → using Rewarded Interstitial fallback"
        );

        return false;
      }



      try {
        await rewarded.show();
        console.log("NORMAL Reward");
        await startRewardCooldown();
        return true;
      } finally {
        // Always reload after show() so we don't depend on CLOSED existing
        loadingRewardedRef.current = true;
        rewarded.load();
      }
    },
    [rewardedLoaded, rewarded, getRewardedRemainingMs, startRewardCooldown]
  );

  // Optional helpers
  const resetRewardedCooldown = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.REWARDED_LAST_SHOWN_AT);
    await refreshRewardedRemaining();
  }, [refreshRewardedRemaining]);

  const canShowRewardedNow = useCallback(async () => {
    const remaining = await getRewardedRemainingMs();
    return remaining <= 0 && rewardedLoaded;
  }, [getRewardedRemainingMs, rewardedLoaded]);

  // Show Interstitial every 3 presses (global counter)
  const showInterstitialEvery3Clicks = useCallback(async () => {
    const key = "post_click_counter";
    const raw = await AsyncStorage.getItem(key);
    const count = raw ? Number(raw) + 1 : 1;

    await AsyncStorage.setItem(key, String(count));

    if (count >= 3) {
      // Remove instead of resetting

      if (interstitialLoaded && interstitial?.loaded) {
        interstitial.show();
        await AsyncStorage.removeItem(key);
      } else {
        pendingInterstitialShowRef.current = true;
        if (!loadingInterstitialRef.current && interstitial?.load) {
          loadingInterstitialRef.current = true;
          interstitial.load();
        }
      }
    }
  }, [interstitialLoaded, interstitial]);

  const value: AdsContextValue = {
    interstitialLoaded,
    rewardedLoaded,
    getRewardedRemainingMs,
    rewardedInterstitialLoadCount,
    showRewardedWithCooldown,
    rewardedNextInMs,
    refreshRewardedRemaining,
    resetRewardedCooldown,
    showInterstitialEvery3Clicks,
    showRewardedInterstitialWithCooldown,
  };

  return React.createElement(AdsContext.Provider, { value }, children);
};

export function useAds() {
  const ctx = useContext(AdsContext);
  if (!ctx) {
    throw new Error("useAds must be used within an AdsProvider");
  }
  return ctx;
}
