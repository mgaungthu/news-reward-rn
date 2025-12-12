import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface CustomModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  buttonText?: string;
}

export default function CustomModal({
  visible,
  title = "Notice",
  message = "",
  onClose,
  buttonText = "OK",
}: CustomModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#ffffff",
            width: "80%",
            paddingVertical: 25,
            paddingHorizontal: 20,
            borderRadius: 18,
            alignItems: "center",
            elevation: 6,
          }}
        >
          {title && (
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                color: "#E53935",
                marginBottom: 12,
              }}
            >
              {title}
            </Text>
          )}

          {message && (
            <Text
              style={{
                fontSize: 16,
                color: "#444",
                textAlign: "center",
                marginBottom: 25,
              }}
            >
              {message}
            </Text>
          )}

          <Pressable
            onPress={onClose}
            style={{
              backgroundColor: "#E53935",
              paddingVertical: 10,
              paddingHorizontal: 30,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              {buttonText}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}