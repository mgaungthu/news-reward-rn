import { useTheme } from "@/theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  backgroundColor?: string;
  textColor?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = true,
  backgroundColor,
  textColor,
}) => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const bgColor = backgroundColor ?? colors.background;
  const txtColor = textColor ?? colors.primary;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: 56,
        justifyContent: "center",
        paddingHorizontal: 16,
        backgroundColor: bgColor,
      }}
    >
      {showBack ? (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ justifyContent: "center", height: "100%", width: 40 }}
        >
          <Ionicons name="arrow-back" size={24} color={txtColor} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 40 }} /> // placeholder for alignment
      )}

      <Text
        style={{
          flex: 1,
          textAlign: "center",
          fontSize: 21,
          fontWeight: "500",
          color: txtColor,
          lineHeight: 56,
          marginRight: 40, // keeps title centered with back button width
        }}
      >
        {title}
      </Text>
    </View>
  );
};