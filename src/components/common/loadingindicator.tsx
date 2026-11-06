
import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Colors, Spacing, Typography } from "../../theme";

type LoadingIndicatorProps = {
  message?: string;
};

export default function LoadingIndicator({
  message = "Please wait...",
}: LoadingIndicatorProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={Colors.primary}
      />

      <Text style={styles.message}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xxl,
  },
  message: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
});
