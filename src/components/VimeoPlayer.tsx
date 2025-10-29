import React from "react";
import { Dimensions, View } from "react-native";
import { WebView } from "react-native-webview";

interface VimeoPlayerProps {
  vimeoUrl: string;
}

export const VimeoPlayer: React.FC<VimeoPlayerProps> = ({ vimeoUrl }) => {
  const videoHeight = Dimensions.get("window").width * (9 / 16); // 16:9 ratio

  return (
    <View style={{ width: "100%", height: videoHeight, borderRadius: 12, overflow: "hidden" }}>
      <WebView
        source={{ uri: vimeoUrl }}
        style={{ flex: 1 }}
        allowsFullscreenVideo
        javaScriptEnabled
        domStorageEnabled
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};