import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";

// Configure notification behavior (optional)
Notifications.setNotificationHandler({
       handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
});

export default function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  const [notificationResponse, setNotificationResponse] =
    useState<Notifications.NotificationResponse | undefined>();

const notificationListener = useRef<Notifications.EventSubscription | null>(null);
const responseListener = useRef<Notifications.EventSubscription | null>(null);

  // 🧠 Register push notifications on mount
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    // Listen for foreground notifications
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notif) => {
        setNotification(notif);
      });

    // Listen for notification responses (when user taps)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        setNotificationResponse(response);
      });

    // Cleanup listeners
   return () => {
      try {
        if (
          notificationListener.current &&
          typeof notificationListener.current.remove === "function"
        ) {
          notificationListener.current.remove();
        }
        if (
          responseListener.current &&
          typeof responseListener.current.remove === "function"
        ) {
          responseListener.current.remove();
        }
      } catch (err) {
        console.warn("Error removing notification listeners:", err);
      }
    };
  }, []);

  return {
    expoPushToken,
    notification,
    notificationResponse,
  };
}

// ⚙️ Helper: Register and return Expo push token
async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token: string | undefined;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  // if (!Device.isDevice) {
  //   Alert.alert("Push Notifications", "Must use a physical device for push notifications.");
  //   return undefined;
  // }

  // Check permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert("Push Notifications", "Permission not granted for push notifications.");
    return undefined;
  }

  // Get Expo push token
  try {
    const projectId = (await Notifications.getExpoPushTokenAsync()).data;
    token = projectId;
    console.log("Expo push token:", token);
  } catch (error) {
    console.warn("Error fetching Expo push token:", error);
  }

  return token;
}