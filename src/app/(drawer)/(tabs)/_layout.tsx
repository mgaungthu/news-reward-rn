import { DebugGeography, Ump } from "google-ump-react-native";

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, Platform, StyleSheet, View } from "react-native";
import mobileAds from "react-native-google-mobile-ads";

// 🔧 UMP Debug (remove or change for production)
const TEST_DEVICE_ID = "D7FCF9667285AE99077DE54805760DFD";

import { BannerAdComponent } from "@/components/BannerAdComponent";
import { useTheme } from "@/theme/ThemeProvider";


function TabLayout() {
  const { colors } = useTheme();
  
  const [consentLoaded, setConsentLoaded] = useState(false);
  const [canRequestAds, setCanRequestAds] = useState(false);

  useEffect(() => {
    const initConsentAndAds = async () => {
      try {
        // 1️⃣ Request consent info (with debug settings)
        await Ump.requestInfoUpdate({
          debugSettings: __DEV__
            ? {
                debugGeography: DebugGeography.EEA,
                testDeviceIdentifiers: [TEST_DEVICE_ID],
              }
            : undefined,
          tagForUnderAgeOfConsent: false,
        });

        // 2️⃣ Load & show consent form if required
        const { canRequestAds } =
          await Ump.loadAndShowConsentFormIfRequired();

        setCanRequestAds(canRequestAds);
        setConsentLoaded(true);

        // 3️⃣ Initialize AdMob only if allowed
        if (canRequestAds) {
          await mobileAds().initialize();
          console.log("✅ AdMob initialized after UMP consent");
        } else {
          console.log("🚫 Ads not allowed by user consent");
        }
      } catch (error) {
        console.log("UMP initialization error:", error);
      }
    };

    initConsentAndAds();
  }, []);

  const RenderIcon = (focused: boolean, name: string, size: number, color: string) => {
    const scale = new Animated.Value(focused ? 0.8 : 1);

    if (focused) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 100,
      }).start();
    }

    return (
      <Animated.View
        style={[
          styles.iconContainer,
          {
            backgroundColor: focused ? "rgba(255,255,255,0.25)" : "transparent",
            transform: [{ scale }],
          },
        ]}
      >
        <Ionicons
          name={name}
          size={size - 4}
          color={color}
        />
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.background,
          tabBarInactiveTintColor: "#fcdede", 
          tabBarLabelStyle: {
            color:"#fff",
            fontSize: 12,
            marginBottom: 8,
            fontWeight: "600",
          },
          tabBarLabelPosition: "below-icon",
          tabBarItemStyle: {
            paddingTop: 6,   // space above icon+label
            paddingBottom: 4, // space below
          },
          tabBarStyle: {
            backgroundColor: colors.primary,
            borderRadius: 60,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            borderBottomRightRadius: 15,
            borderBottomLeftRadius: 15,
            height: 70,
            borderTopWidth: 0,
            elevation: 15,
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
              },
              android: {
                elevation: 10,
              },
            }),
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size, focused }) =>
              RenderIcon(
                focused,
                focused ? "home" : "home-outline",
                size,
                focused ? colors.background : color
              ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size, focused }) =>
              RenderIcon(
                focused,
                focused ? "search" : "search-outline",
                size,
                focused ? colors.background : color
              ),
          }}
        />
        <Tabs.Screen
          name="vip"
          options={{
            title: "VIP",
            tabBarIcon: ({ color, size, focused }) =>
              RenderIcon(
                focused,
                focused ? "star" : "star-outline",
                size,
                focused ? colors.background : color
              ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size, focused }) =>
              RenderIcon(
                focused,
                focused ? "person" : "person-outline",
                size,
                focused ? colors.background : color
              ),
          }}
        />
        
      </Tabs>

      {canRequestAds && (
        <View style={styles.bannerContainer}>
          <BannerAdComponent />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 50,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerContainer: {
    position: "absolute",
    bottom: 69, // roughly tab height + some extra space
    width: "100%",
    alignItems: "center",
    zIndex: 10,
  },
});

export default function Layout() {
  return <TabLayout />;
}
