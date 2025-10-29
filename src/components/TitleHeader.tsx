import { useTheme } from "@/theme/ThemeProvider";
import { moderateScale, verticalScale } from "@/utils/scale";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TitleHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export const TitleHeader: React.FC<TitleHeaderProps> = ({
  title,
  subtitle,
  align = "left",
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { alignItems: align === "center" ? "center" : "flex-start" },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(16),
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: "700",
  },
  subtitle: {
    fontSize: moderateScale(16),
    marginTop: verticalScale(4),
  },
});