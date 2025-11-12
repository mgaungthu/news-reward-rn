import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { NavigationState, useNavigationState } from "@react-navigation/native";
import { Drawer } from "expo-router/drawer";
import React, { ComponentProps, useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TabScreen = "index" | "vip" | "profile";

function CustomDrawer(props: DrawerContentComponentProps) {
  const { colors } = useTheme();
  const { user, logout, isLoggedIn } = useAuth();
  const { activeRouteName, activeTab } = useNavigationState((state) => {
    const activeRoute = state.routes[state.index];
    const nestedState = activeRoute.state as NavigationState | undefined;
    let tab: TabScreen = "index";
    if (activeRoute.name === "(tabs)" && nestedState) {
      const nestedRoute = nestedState.routes[nestedState.index];
      tab = (nestedRoute?.name as TabScreen) ?? "index";
    }
    return { activeRouteName: activeRoute.name, activeTab: tab };
  });

  const navigateToTab = (screen: TabScreen) => {
      props.navigation.navigate("(tabs)", { screen });
    props.navigation.closeDrawer();
  };

  type IconName = ComponentProps<typeof Ionicons>["name"];
  type MenuItem =
    | {
        label: string;
        icon: IconName;
        type: "tab";
        screen: TabScreen;
      }
    | {
        label: string;
        icon: IconName;
        type: "route";
        routeName: string;
      };

  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        label: "Home",
        icon: "home-outline",
        type: "tab",
        screen: "index",
      },
      {
        label: "VIP Zone",
        icon: "star-outline",
        type: "tab",
        screen: "vip",
      },
      {
        label: "Profile",
        icon: "person-outline",
        type: "tab",
        screen: "profile",
      },
      {
        label: "Privacy Policy",
        icon: "document-text-outline",
        type: "route",
        routeName: "privacy",
      },
      {
        label: "Terms of Use",
        icon: "reader-outline",
        type: "route",
        routeName: "terms",
      },
    ],
    []
  );

  const handleLogout = async () => {
  await logout();
  props.navigation.navigate("(tabs)", { screen: "profile" });
};

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        {/* User Info */}
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/logoinapp.png')}
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: "#000" }]}>
            {user?.name || "Guest"}
          </Text>
          <Text style={[styles.email, { color: "#000" }]}>
            {user?.email || "guest@example.com"}
          </Text>
        </View>

        {/* Drawer Items */}
        <View style={{ flex: 1, paddingTop: 10 }}>
          {menuItems.map((item) => {
            const focused =
              item.type === "tab"
                ? activeRouteName === "(tabs)" && activeTab === item.screen
                : activeRouteName === item.routeName;

            const handlePress = () => {
              if (item.type === "tab") {
                navigateToTab(item.screen);
              } else {
                props.navigation.navigate(item.routeName as never);
                props.navigation.closeDrawer();
              }
            };

            return (
              <DrawerItem
                key={item.label}
                label={item.label}
                focused={focused}
                activeTintColor="#fff"
                inactiveTintColor={colors.text}
                activeBackgroundColor={colors.primary}
                icon={({ color, size }) => (
                  <Ionicons
                    name={item.icon}
                    size={size}
                    color={focused ? "#fff" : color}
                  />
                )}
                labelStyle={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: focused ? "#fff" : colors.text,
                }}
                style={{ borderRadius: 18, marginHorizontal: 12 }}
                onPress={handlePress}
              />
            );
          })}
        </View>
      </DrawerContentScrollView>

      {/* Logout/Sign in Button */}
      {isLoggedIn ? (
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.primary }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.primary }]}
          onPress={() => props.navigation.navigate("login" as never)}
        >
          <Ionicons name="log-in-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Sign in</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function Layout() {
  const { colors } = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
        drawerStyle: {
          backgroundColor: colors.cardBackground,
          width: 280,
        },
        drawerLabelStyle: {
          fontSize: 14,
          fontWeight: "500",
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="privacy"
        options={{
          drawerLabel: "Privacy Policy",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="terms"
        options={{
          drawerLabel: "Terms of Use",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="reader-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 35,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
  },
  email: {
    fontSize: 13,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    margin: 16,
    borderRadius: 30,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
