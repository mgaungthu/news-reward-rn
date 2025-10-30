import mobileAds from "react-native-google-mobile-ads";

import { BannerAdComponent } from "@/components/BannerAdComponent";
import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

function TabLayout() {
  const { colors } = useTheme();

  useEffect(() => {
    // Initialize Google Mobile Ads SDK
    mobileAds()
      .initialize()
      .then(() => {
        console.log("AdMob initialized successfully");
      });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: colors.background },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="vip/index"
          options={{
            title: "VIP",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "star" : "star-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="news"
          options={{
            href: null,
          }}
        />
      </Tabs>

      <View style={styles.bannerContainer}>
        <BannerAdComponent />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    position: "absolute",
    bottom: 60, // roughly tab height
    width: "100%",
    alignItems: "center",
    zIndex: 10,
  },
});

export default function Layout() {
  return <TabLayout />;
}
