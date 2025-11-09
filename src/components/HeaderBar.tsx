import { useTheme } from "@/theme/ThemeProvider";
import { scale, verticalScale } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const HeaderBar = ({
  title = "Lotaya Dinga",
  subtitle = "Stay updated & earn rewards!",
}: {
  title?: string;
  subtitle?: string;
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: "#fff" }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: "#f5f5f5" }]}>{subtitle}</Text>
        </View>
        <Ionicons
          name="menu"
          size={scale(22)}
          color="#fff"
          onPress={() => navigation.openDrawer()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: verticalScale(20),
    borderRadius: scale(8),
    marginBottom: verticalScale(16),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flexDirection: "column",
  },
  title: {
    fontSize: scale(21),
    fontWeight: "700",
  },
  subtitle: {
    fontSize: scale(8),
  },
});
