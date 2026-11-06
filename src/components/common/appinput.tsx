
import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { Colors, Spacing, Typography } from "../../theme";

type AppInputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export default function AppInput({
  label,
  error,
  style,
  ...textInputProps
}: AppInputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          style,
        ]}
        placeholderTextColor={Colors.textSecondary}
        {...textInputProps}
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.body,
    fontWeight: Typography.medium,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: Typography.body,
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  error: {
    color: Colors.danger,
    fontSize: Typography.caption,
    marginTop: Spacing.xs,
  },
});
