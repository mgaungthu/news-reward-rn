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
  const { user, logout } = useAuth();
  const activeTab = useNavigationState((state) => {
    const activeRoute = state.routes[state.index];
    const nestedState = activeRoute.state as NavigationState | undefined;
    if (activeRoute.name === "(tabs)" && nestedState) {
      const nestedRoute = nestedState.routes[nestedState.index];
      return (nestedRoute?.name as TabScreen) ?? "index";
    }
    return "index";
  });

  const navigateToTab = (screen: TabScreen) => {
    props.navigation.navigate("(tabs)" as never, { screen } as never);
    props.navigation.closeDrawer();
  };

  type IconName = ComponentProps<typeof Ionicons>["name"];
  const menuItems = useMemo(
    () =>
      [
        {
          label: "Home",
          icon: "home-outline" as IconName,
          screen: "index" as TabScreen,
        },
        {
          label: "VIP Zone",
          icon: "star-outline" as IconName,
          screen: "vip" as TabScreen,
        },
        {
          label: "Profile",
          icon: "person-outline" as IconName,
          screen: "profile" as TabScreen,
        },
      ].map((item) => ({
        ...item,
        focused: activeTab === item.screen,
        onPress: () => navigateToTab(item.screen),
      })),
    [activeTab]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        {/* User Info */}
        <View style={styles.header}>
          <Image
            source={{
              uri:
                user?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
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
          {menuItems.map((item) => (
            <DrawerItem
              key={item.label}
              label={item.label}
              focused={item.focused}
              activeTintColor="#fff"
              inactiveTintColor={colors.text}
              activeBackgroundColor={colors.primary}
              icon={({ color, size }) => (
                <Ionicons
                  name={item.icon}
                  size={size}
                  color={item.focused ? "#fff" : color}
                />
              )}
              labelStyle={{
                fontSize: 14,
                fontWeight: "500",
                color: item.focused ? "#fff" : colors.text,
              }}
              style={{ borderRadius: 18, marginHorizontal: 12 }}
              onPress={item.onPress}
            />
          ))}
        </View>
      </DrawerContentScrollView>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.primary }]}
        onPress={logout}
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
    width: 70,
    height: 70,
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
