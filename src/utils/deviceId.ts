import * as Application from "expo-application";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const DEVICE_KEY = "device_id";

export const getDeviceId = async (): Promise<string> => {
  // 1. Check if we already saved a device_id
  const savedId = await SecureStore.getItemAsync(DEVICE_KEY);
  if (savedId) {
    return savedId; // Reuse always
  }

  // 2. Generate the device ID
  let newId = "";

  if (Platform.OS === "android") {
    const androidId = Application.getAndroidId();
    if (androidId) {
      newId = androidId;
    }
  } else {
    const iosId = await Application.getIosIdForVendorAsync();
    if (iosId) {
      newId = iosId;
    }
  }

  if (!newId) {
    newId = "unknown-device";
  }

  // 3. Save to SecureStore (encrypted)
  await SecureStore.setItemAsync(DEVICE_KEY, newId);

  return newId;
};