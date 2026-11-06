
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import {
  Colors,
  Spacing,
  Typography,
} from "../../../theme";

import ScreenContainer from "../../../components/layout/ScreenContainer";
import AppInput from "../../../components/common/appinput";
import AppButton from "../../../components/common/appbutton";

type ForgotPasswordScreenProps = {
  onBackToLogin: () => void;
};

export default function ForgotPasswordScreen({
  onBackToLogin,
}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      setSuccess(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      setSuccess(false);
      return;
    }

    setError("");
    setSuccess(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenContainer scrollable={false}>
          <View style={styles.container}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>?</Text>
            </View>

            <Text style={styles.appName}>TeachFlow</Text>

            <View style={styles.formContainer}>
              <Text style={styles.heading}>
                Forgot Password?
              </Text>

              <Text style={styles.description}>
                Don't worry! Enter your registered email address.
                We'll help you reset your password.
              </Text>

              <AppInput
                label="Email Address"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  setError("");
                  setSuccess(false);
                }}
              />

              {error !== "" && (
                <Text style={styles.errorText}>
                  {error}
                </Text>
              )}

              {success && (
                <View style={styles.successContainer}>
                  <Text style={styles.successText}>
                    Reset request submitted successfully!
                    Password reset will be connected to your email
                    through Firebase later.
                  </Text>
                </View>
              )}

              <AppButton
                title="Send Reset Link"
                onPress={handleResetPassword}
                style={styles.resetButton}
              />

              <TouchableOpacity
                style={styles.backContainer}
                onPress={onBackToLogin}
              >
                <Text style={styles.backText}>
                  Back to Sign In
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.footer}>
              TeachFlow • Teaching Made Organized
            </Text>
          </View>
        </ScreenContainer>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: Spacing.xxl,
  },
  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: 36,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  appName: {
    fontSize: 30,
    fontWeight: Typography.bold,
    color: Colors.text,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.xxxl,
  },
  heading: {
    fontSize: Typography.heading,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  description: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  errorText: {
    color: Colors.danger,
    fontSize: Typography.caption,
    marginTop: Spacing.sm,
  },
  successContainer: {
    backgroundColor: Colors.successLight,
    padding: Spacing.md,
    borderRadius: 10,
    marginTop: Spacing.md,
  },
  successText: {
    color: Colors.success,
    fontSize: Typography.caption,
    lineHeight: 19,
  },
  resetButton: {
    width: "100%",
    marginTop: Spacing.xl,
  },
  backContainer: {
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  backText: {
    color: Colors.primary,
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
  },
  footer: {
    textAlign: "center",
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xxl,
  },
});
