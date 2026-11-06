
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ViewStyle,
} from "react-native";
import { Colors, Spacing, Typography } from "../../theme";

type AppModalProps = {
  visible: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  style?: ViewStyle;
};

export default function AppModal({
  visible,
  title,
  children,
  onClose,
  style,
}: AppModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable
          style={[styles.modal, style]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View>{children}</View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  modal: {
    width: "100%",
    maxWidth: 450,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.title,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  closeButton: {
    fontSize: 20,
    color: Colors.textSecondary,
    padding: Spacing.xs,
  },
});
