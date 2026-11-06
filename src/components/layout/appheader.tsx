
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Colors, Spacing, Typography } from "../../theme";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export default function AppHeader({
  title,
  subtitle,
  actionLabel,
  onActionPress,
}: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>

        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>

      {actionLabel && onActionPress && (
        <TouchableOpacity
          onPress={onActionPress}
          style={styles.actionButton}
          activeOpacity={0.8}
        >
          <Text style={styles.actionText}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.heading,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  actionButton: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 10,
  },
  actionText: {
    color: Colors.primary,
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
  },
});
