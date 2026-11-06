
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Spacing, Typography } from "../../theme";

type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  const isCompleted =
    normalizedStatus === "completed" ||
    normalizedStatus === "ready";

  const isInProgress = normalizedStatus === "in progress";

  const isOverdue = normalizedStatus === "overdue";

  const backgroundColor = isCompleted
    ? Colors.successLight
    : isOverdue
    ? Colors.dangerLight
    : isInProgress
    ? Colors.primaryLight
    : Colors.warningLight;

  const textColor = isCompleted
    ? Colors.success
    : isOverdue
    ? Colors.danger
    : isInProgress
    ? Colors.primary
    : Colors.warning;

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
  },
  text: {
    fontSize: Typography.caption,
    fontWeight: Typography.semibold,
  },
});
