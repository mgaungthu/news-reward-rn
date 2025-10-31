import { createAds } from "@/utils/lib";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AdEventType,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";


// ---------- Storage & Rules ----------
const STORAGE_KEYS = {
  REWARDED_LAST_SHOWN_AT: "ads:rewarded:lastShownAt",
} as const;

const REWARDED_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour
const DEFAULT_INTERSTITIAL_THRESHOLD = 5;

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

export function useAds() {
  const [interstitial, setInterstitial] = useState<any>(null);
  const [rewarded, setRewarded] = useState<any>(null);

  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [rewardedLoaded, setRewardedLoaded] = useState(false);
  const [rewardedNextInMs, setRewardedNextInMs] = useState<number>(0);

  const countersRef = useRef<KeyedCounter>({});
  const loadingInterstitialRef = useRef(false);
  const loadingRewardedRef = useRef(false);

  // ✅ new: remember we owe a show once load completes
  const pendingInterstitialShowRef = useRef(false);

  // Initialize ads
  useEffect(() => {
    const ads = createAds();
    setInterstitial(ads.interstitial);
    setRewarded(ads.rewarded);
  }, []);

  // ---------- helpers ----------
  const getRewardedRemainingMs = useCallback(async () => {
    const last = await AsyncStorage.getItem(STORAGE_KEYS.REWARDED_LAST_SHOWN_AT);
    const lastMs = last ? Number(last) : 0;
    const now = Date.now();
    return Math.max(0, lastMs + REWARDED_COOLDOWN_MS - now);
  }, []);

  const refreshRewardedRemaining = useCallback(async () => {
    const remaining = await getRewardedRemainingMs();
    setRewardedNextInMs(remaining);
    return remaining;
  }, [getRewardedRemainingMs]);

  // ---------- Interstitial wiring ----------
  useEffect(() => {
    if (!interstitial) return;

    let mounted = true;

    const unsubLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      if (!mounted) return;
      loadingInterstitialRef.current = false;
      setInterstitialLoaded(true);

      // ✅ if user hit the threshold while we were loading, show now
      if (pendingInterstitialShowRef.current) {
        pendingInterstitialShowRef.current = false;
        interstitial.show();
      }
    });

    const unsubClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      if (!mounted) return;
      setInterstitialLoaded(false);
      if (!loadingInterstitialRef.current) {
        loadingInterstitialRef.current = true;
        interstitial.load();
      }
    });

    const unsubError = interstitial.addAdEventListener(AdEventType.ERROR, () => {
      if (!mounted) return;
      setInterstitialLoaded(false);
      loadingInterstitialRef.current = false; // allow retry later
      pendingInterstitialShowRef.current = false; // cancel pending if failed
    });

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

  // ---------- Rewarded wiring (with compat) ----------
  useEffect(() => {
    if (!rewarded) return;

    let mounted = true;

    const unsubLoaded = rewarded.addAdEventListener(REWARDED_EVENTS.LOADED, () => {
      if (!mounted) return;
      loadingRewardedRef.current = false;
      setRewardedLoaded(true);
    });

    const unsubClosed = rewarded.addAdEventListener(REWARDED_EVENTS.CLOSED, () => {
      if (!mounted) return;
      setRewardedLoaded(false);
      if (!loadingRewardedRef.current) {
        loadingRewardedRef.current = true;
        rewarded.load();
      }
    });

    const unsubError = rewarded.addAdEventListener(REWARDED_EVENTS.ERROR, () => {
      if (!mounted) return;
      setRewardedLoaded(false);
      loadingRewardedRef.current = false; // allow retry later
    });

    if (!loadingRewardedRef.current) {
      loadingRewardedRef.current = true;
      rewarded.load();
    }

    return () => {
      mounted = false;
      unsubLoaded();
      unsubClosed && unsubClosed();
      unsubError && unsubError();
    };
  }, [rewarded]);

  useEffect(() => {
    refreshRewardedRemaining();
  }, [refreshRewardedRemaining]);

  // ---------- Public API ----------

  // Show interstitial every N actions (default 5)
  const maybeShowInterstitialOnAction = useCallback(
    (key: string, threshold = DEFAULT_INTERSTITIAL_THRESHOLD) => {
      const counters = countersRef.current;
      counters[key] = (counters[key] ?? 0) + 1;

      if (counters[key] % threshold === 0) {
        if (interstitialLoaded && interstitial) {
          interstitial.show();
        } else {
          // ✅ remember to show once LOADED
          pendingInterstitialShowRef.current = true;
          if (!loadingInterstitialRef.current && interstitial) {
            loadingInterstitialRef.current = true;
            interstitial.load();
          }
        }
      }
    },
    [interstitialLoaded, interstitial]
  );

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

      if (!rewardedLoaded || !rewarded) {
        if (!loadingRewardedRef.current && rewarded) {
          loadingRewardedRef.current = true;
          rewarded.load();
        }
        return false;
      }

      // One‑time reward listener
      const unsubEarned = rewarded.addAdEventListener(
        REWARDED_EVENTS.EARNED_REWARD,
        (reward: any) => {
          onReward?.(Number(reward?.amount ?? 1), reward?.type);
        }
      );

      try {
        await rewarded.show();
        const now = Date.now();
        await AsyncStorage.setItem(
          STORAGE_KEYS.REWARDED_LAST_SHOWN_AT,
          String(now)
        );
        setRewardedNextInMs(REWARDED_COOLDOWN_MS);
        return true;
      } finally {
        // Always reload after show() so we don't depend on CLOSED existing
        unsubEarned();
        loadingRewardedRef.current = true;
        rewarded.load();
      }
    },
    [rewardedLoaded, rewarded, getRewardedRemainingMs]
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

  return {
    interstitialLoaded,
    rewardedLoaded,
    rewardedNextInMs,
    maybeShowInterstitialOnAction,
    showRewardedWithCooldown,
    refreshRewardedRemaining,
    // helpers
    resetRewardedCooldown,
    canShowRewardedNow,
  };
}