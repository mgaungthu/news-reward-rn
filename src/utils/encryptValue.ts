import { SECRET_KEY } from "@env";
import CryptoJS from "crypto-js";

/**
 * AES-256-CBC encryption compatible with Laravel.
 */
export function encryptValue(value: string | number): string {
  try {
    const plaintext = String(value);

    // Convert SECRET_KEY into CryptoJS WordArray
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);

    // Use static 16-byte IV to avoid RN crypto random crash
    const iv = CryptoJS.enc.Utf8.parse("1234567890ABCDEF");

    // Encrypt with explicit key + iv
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Combine IV + ciphertext (Laravel needs both)
    const combined = iv.concat(encrypted.ciphertext);

    // Encode Base64
    const base64 = CryptoJS.enc.Base64.stringify(combined);

    // URL safe
    return encodeURIComponent(base64);

  } catch (error) {
    console.error("Encryption failed:", error);
    return "";
  }
}