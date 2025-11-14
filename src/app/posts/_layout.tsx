
import { Stack } from "expo-router";
import { useEffect } from "react";

import { savePushToken } from "@/api/postApi";
import usePushNotifications from "@/hooks/usePushNotifications";

export default function PostsLayout() {


   const { expoPushToken } = usePushNotifications(); 

   useEffect(()=> {
     if (expoPushToken) {
      savePushToken(expoPushToken);
    }
   },[expoPushToken])

      return (
    <Stack
      screenOptions={{
        headerShown: false, // you use custom Header
        animation: "slide_from_right", // ✅ smooth transition
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );

}