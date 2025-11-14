import { useTheme } from "@/theme/ThemeProvider";
import { moderateScale, scale, verticalScale } from "@/utils/scale";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

interface Props {
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  icon?: any; // e.g. "search", "close", "filter"
  iconColor?: string;
  onIconPress?: () => void;
  secureTextEntry?: boolean;
  onSubmitEditing?: () => void;
  returnKeyType?: TextInputProps["returnKeyType"];
}

export const CustomTextInput = ({
  value,
  placeholder,
  onChangeText,
  icon = "search",
  iconColor,
  onIconPress,
  secureTextEntry = false,
  onSubmitEditing,
  returnKeyType,
}: Props) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}
    >
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        placeholderTextColor={colors.muted}
        secureTextEntry={secureTextEntry}
        style={[styles.input, { color: colors.text }]}
        onSubmitEditing={
          onSubmitEditing
            ? (_event) => {
                onSubmitEditing();
              }
            : undefined
        }
        returnKeyType={returnKeyType}
      />

      <Ionicons
        name={icon}
        size={scale(20)}
        color={iconColor || colors.border}
        onPress={onIconPress}
        style={{ marginLeft: scale(8) }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: scale(10),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(14),
    paddingVertical: 0,
  },
});
