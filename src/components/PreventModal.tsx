import React from "react";
import {
    Modal,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface PreventModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttonText?: string;
  buttonColor?: string;
  onPress: () => void;
}

export const PreventModal: React.FC<PreventModalProps> = ({
  visible,
  title,
  message,
  buttonText,
  buttonColor = "#E53935",
  onPress,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 12,
            width: "80%",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              marginBottom: 20,
              fontSize: 15,
              textAlign: "center",
            }}
          >
            {message}
          </Text>
            {buttonText && (
                <TouchableOpacity
            onPress={onPress}
            style={{
              backgroundColor: buttonColor,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {buttonText}
            </Text>
          </TouchableOpacity>
            )

            }
          
        </View>
      </View>
    </Modal>
  );
};