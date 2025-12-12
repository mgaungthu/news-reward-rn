import { useTheme } from "@/theme/ThemeProvider";
import { scale, verticalScale } from "@/utils/scale";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Rect } from "react-native-svg";

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
    <View style={[styles.container, { backgroundColor: 'transperant' }]}>
      <View style={styles.headerRow}>
        
        <View style={styles.titleContainer}>
          <View>
          <Image source={require('../../assets/images/logo.png')} style={{width:60,height:60}}/>
          </View>
          <View style={{padding:2}}>
          <Text style={[styles.title, { color: colors.primary }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: colors.primary }]}>{subtitle}</Text>
          </View>
        </View>
        <Pressable onPress={() => navigation.openDrawer()} hitSlop={10}>
          <Svg
            width={scale(26)}
            height={verticalScale(20)}
            viewBox="0 0 26 20"
          >
            <Rect x="0" y="0" width="16" height="3" rx="1.5" fill={colors.primary} />
            <Rect x="4" y="8" width="22" height="3" rx="1.5" fill={colors.primary} />
            <Rect x="2" y="16" width="12" height="3" rx="1.5" fill={colors.primary} />
          </Svg>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: verticalScale(3),
    borderRadius: scale(8),
    marginBottom: verticalScale(5),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems:'center',
  },
  title: {
    fontSize: scale(21),
    fontWeight: "700",
  },
  subtitle: {
    fontSize: scale(8),
  },
});
