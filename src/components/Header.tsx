import { useTheme } from "@/theme/ThemeProvider";
import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { scale } from "react-native-size-matters";

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

  const [cameFromRef,setCameFromRef]= useState(false)
  const router = useRouter();
  const { colors } = useTheme();
    const params = useLocalSearchParams<{ ref?: string }>();
  
    useEffect(() => {
        if (params.ref?.length) {
          setCameFromRef(true);
        }
    }, [params.ref]);

  const bgColor = backgroundColor ?? colors.primary;
  const txtColor = textColor ?? "#fff";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: 56,
        justifyContent: "center",
        paddingHorizontal: 16,
        borderRadius:10,
        backgroundColor: bgColor,
        marginBottom:scale(10)
      }}
    >
      {showBack ? (
        <TouchableOpacity
          onPress={() => {
            if (cameFromRef) {
              router.replace("/"); // redirect to home if referral
            } else {
              router.back(); // normal back navigation
            }
          }}
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
          // textAlign: "center",
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