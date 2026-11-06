
import React from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Colors, Spacing } from "../../theme";

type AppCardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export default function AppCard({
  children,
  style,
}: AppCardProps) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
});
