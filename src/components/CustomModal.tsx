import { useTheme } from "@/theme/ThemeProvider";
import { moderateScale } from "@/utils/scale";
import React from "react";
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

interface CustomModalProps {
  visible: boolean;
  type: "success" | "error" | "info" | null;
  message: string;
  onClose: () => void;
   children?: React.ReactNode;
}

export const CustomModal = ({ visible, type, message, onClose, children }: CustomModalProps) => {
  const { colors } = useTheme();

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                width: "80%",
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 20,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: moderateScale(18),
                  fontWeight: "600",
                  color: type === "success" ? colors.primary : type === "error" ? colors.primary : colors.primary,
                  marginBottom: 10,
                }}
              >
                {type === "success" ? "Success" : type === "error" ? "Error" : "Info"}
              </Text>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  textAlign: "center",
                  marginBottom: 16,
                  color: colors.text,
                }}
              >
                {message}
              </Text>
              
              <View style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}>
                {children}

              {!children && (
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    backgroundColor:
                      type === "success" ? colors.primary :
                      type === "error" ? colors.primary :
                      colors.primary,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>Close</Text>
                </TouchableOpacity>
              )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
