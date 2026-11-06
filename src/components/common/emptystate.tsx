    
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Spacing, Typography } from "../../theme";
import AppButton from "./appbutton";

type EmptyStateProps = {
  icon?: string;
  title: string;
  description: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
};

export default function EmptyState({
  icon = "📋",
  title,
  description,
  buttonTitle,
  onButtonPress,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>
        {description}
      </Text>

      {buttonTitle && onButtonPress && (
        <AppButton
          title={buttonTitle}
          onPress={onButtonPress}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xxl,
  },
  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: Typography.title,
    fontWeight: Typography.bold,
    color: Colors.text,
    textAlign: "center",
  },
  description: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.sm,
    lineHeight: 21,
  },
  button: {
    marginTop: Spacing.lg,
  },
});
