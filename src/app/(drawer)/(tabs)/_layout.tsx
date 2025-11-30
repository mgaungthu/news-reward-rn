import mobileAds from "react-native-google-mobile-ads";

import { BannerAdComponent } from "@/components/BannerAdComponent";
import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";

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
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 8,
            fontWeight: "600",
          },
          tabBarLabelPosition: "below-icon",
          tabBarStyle: {
            backgroundColor: colors.cardBackground,
            borderRadius: 60,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            borderBottomRightRadius: 15,
            borderBottomLeftRadius: 15,
            height: 70,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
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
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size + 2}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "search" : "search-outline"}
                size={size + 2}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="vip"
          options={{
            title: "VIP",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "star" : "star-outline"}
                size={size + 2}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size + 2}
                color={color}
              />
            ),
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
    bottom: 69, // roughly tab height + some extra space
    width: "100%",
    alignItems: "center",
    zIndex: 10,
  },
});

export default function Layout() {
  return <TabLayout />;
}
