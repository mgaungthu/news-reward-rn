import { AppOpenAdComponent } from "@/components/AppOpenAdComponent";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef } from "react";

const queryClient = new QueryClient();

export default function Layout() {
  const router = useRouter();
  const lastUrlRef = useRef<string | null>(null);

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

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <AppOpenAdComponent />
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
