import React from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

type SecondSplashProps = {
  showSecondSplash?: boolean;
};

export default function SecondSplash({
  showSecondSplash
}: SecondSplashProps) {

  if(!showSecondSplash) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/splash_ios.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    position:'absolute',
    zIndex:100,
    height:"100%",
    width:"100%"
  },
  logo: {
    width: 180,
    height: 180,
  },
});