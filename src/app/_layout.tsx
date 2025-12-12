import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";

SplashScreen.preventAutoHideAsync();

import { AppOpenAdComponent } from "@/components/AppOpenAdComponent";
import { PreventModal } from "@/components/PreventModal";
import SecondSplash from "@/components/SecondSplash";
import { AuthProvider } from "@/context/AuthContext";
import { AdsProvider } from "@/hooks/useAds";
import { SpinWheelProvider } from "@/hooks/useSpinWheelAds";
import { ThemeProvider } from "@/theme/ThemeProvider";

import OfflineBanner from "@/components/OfflineBanner";
import * as Application from "expo-application";
import { Platform, Linking as RNLinking } from "react-native";
import VersionCheck from "react-native-version-check";

const queryClient = new QueryClient();

export default function Layout() {
  const router = useRouter();
  const lastUrlRef = useRef<string | null>(null);

  const [showSecondSplash, setShowSecondSplash] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [storeUrl, setStoreUrl] = useState("");

  const navigateToUrl = useCallback(
    (url: string | null | undefined) => {
      if (!url || lastUrlRef.current === url) {
        return;
      }

      const parsed = Linking.parse(url);
      if (!parsed.path) {
        return;
      }

      const normalizedPath = `/${parsed.path.replace(/^\/+/, "")}`;
      const query = parsed.queryParams ?? {};
      const params = new URLSearchParams();

      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          value.forEach((item) => params.append(key, String(item)));
        } else {
          params.append(key, String(value));
        }
      });

      const destination = params.toString()
        ? `${normalizedPath}?${params.toString()}`
        : normalizedPath;

      lastUrlRef.current = url;
      router.push(destination as never);
    },
    [router]
  );

  useEffect(() => {
    let isMounted = true;
    Linking.getInitialURL()
      .then((initialUrl) => {
        if (isMounted) {
          navigateToUrl(initialUrl);
        }
      })
      .catch(() => null);

    const subscription = Linking.addEventListener("url", (event) => {
      navigateToUrl(event.url);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [navigateToUrl]);

  useEffect(() => {
    const setup = async () => {
      await new Promise((res) => setTimeout(res, 800)); 
      await SplashScreen.hideAsync();
      setTimeout(() => {
        setShowSecondSplash(false);
      }, 1200);
    };
    setup();
  }, []);

  useEffect(() => {
    const checkUpdate = async () => {
      try {
        let latest = "";
        let current = Application.nativeApplicationVersion || "";

        try {
          latest = await VersionCheck.getLatestVersion();
        } catch (err) {
          console.log("Failed to fetch latest version:", err);
          return; // prevent crash
        }

        if (!latest || !current) {
          console.log("Version info missing, skipping update check.");
          return;
        }

        let url = "";

        if (Platform.OS === "ios") {
          try {
            url = await VersionCheck.getAppStoreUrl();
          } catch (err) {
            console.log("iOS store URL fetch failed, using fallback:", err);
            url = "https://apps.apple.com/us/app/lotaya-dinga/id6754815852"; // TODO: replace with your real App Store ID
          }
        } else {
          try {
            url = await VersionCheck.getPlayStoreUrl();
          } catch (err) {
            console.log("Android store URL fetch failed, using fallback:", err);
            url =
              "https://play.google.com/store/apps/details?id=com.mandalayads.lotayadinga";
          }
        }

        setStoreUrl(url);

        let updateNeeded = { isNeeded: false };

        try {
          updateNeeded = await VersionCheck.needUpdate({
            currentVersion: current,
            latestVersion: latest,
          });
        } catch (err) {
          console.log("needUpdate failed:", err);
          return;
        }

        console.log(updateNeeded);

        if (updateNeeded.isNeeded) {
          setForceUpdate(true);
        }
      } catch (e) {
        console.log("Version check failed:", e);
      }
    };

    checkUpdate();
  }, []);

  

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <AdsProvider>
            <SpinWheelProvider>
            <PreventModal
              visible={forceUpdate}
              title="Update Required"
              message="A new version of the app is available. Please update to continue."
              buttonText="Update Now"
              buttonColor="#E53935"
              onPress={() => RNLinking.openURL(storeUrl)}
            />
            {!showSecondSplash && (
              <AppOpenAdComponent show={showSecondSplash}/>
            )}
            <StatusBar style="dark" />
            <SecondSplash showSecondSplash={showSecondSplash} />
            <OfflineBanner />
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
            </SpinWheelProvider>
          </AdsProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
