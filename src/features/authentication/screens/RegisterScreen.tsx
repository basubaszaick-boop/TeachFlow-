
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
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { auth } from "../../../services/firebase/firebase";

import {
  Colors,
  Spacing,
  Typography,
} from "../../../theme";

import ScreenContainer from "../../../components/layout/ScreenContainer";
import AppInput from "../../../components/common/appinput";
import AppButton from "../../../components/common/appbutton";

type RegisterScreenProps = {
  onRegisterSuccess: () => void;
  onLogin: () => void;
};

export default function RegisterScreen({
  onRegisterSuccess,
  onLogin,
}: RegisterScreenProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (isLoading) return;

    if (
      !fullName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setError("");
      setIsLoading(true);

      // Create Firebase account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      // Save instructor's full name in Firebase
      await updateProfile(userCredential.user, {
        displayName: fullName.trim(),
      });

      setIsLoading(false);

      // Return to Login screen
      onRegisterSuccess();

    } catch (error: any) {
      console.log("Registration error:", error.code, error.message);

      let errorMessage = "Registration failed. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered.";
          break;

        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;

        case "auth/weak-password":
          errorMessage = "Your password is too weak.";
          break;

        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your internet connection.";
          break;

        case "auth/operation-not-allowed":
          errorMessage = "Email and Password authentication is not enabled.";
          break;

        default:
          errorMessage = error.message || errorMessage;
      }

      setError(errorMessage);
      setIsLoading(false);
    }
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
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>TF</Text>
            </View>

            <Text style={styles.appName}>TeachFlow</Text>

            <Text style={styles.tagline}>
              Start organizing your teaching workload.
            </Text>

            <View style={styles.formContainer}>
              <Text style={styles.heading}>
                Create Account
              </Text>

              <Text style={styles.description}>
                Set up your instructor account to get started.
              </Text>

              <AppInput
                label="Full Name"
                placeholder="Enter your full name"
                autoCapitalize="words"
                value={fullName}
                onChangeText={setFullName}
              />

              <AppInput
                label="Email Address"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <AppInput
                label="Password"
                placeholder="Create a password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <AppInput
                label="Confirm Password"
                placeholder="Re-enter your password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              {error !== "" && (
                <Text style={styles.errorText}>
                  {error}
                </Text>
              )}

              <AppButton
                title={isLoading ? "Creating Account..." : "Create Account"}
                onPress={handleRegister}
                style={styles.registerButton}
              />

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>
                  Already have an account?
                </Text>

                <TouchableOpacity onPress={onLogin}>
                  <Text style={styles.loginLink}>
                    {" "}Sign In
                  </Text>
                </TouchableOpacity>
              </View>
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

  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: Spacing.md,
  },

  logo: {
    fontSize: 28,
    fontWeight: Typography.bold,
    color: "#FFFFFF",
  },

  appName: {
    fontSize: 30,
    fontWeight: Typography.bold,
    color: Colors.text,
    textAlign: "center",
  },

  tagline: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.sm,
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
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },

  errorText: {
    color: Colors.danger,
    fontSize: Typography.caption,
    marginBottom: Spacing.md,
  },

  registerButton: {
    width: "100%",
    marginTop: Spacing.md,
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: Spacing.xl,
  },

  loginText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },

  loginLink: {
    fontSize: Typography.body,
    color: Colors.primary,
    fontWeight: Typography.bold,
  },

  footer: {
    textAlign: "center",
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xxl,
  },
});
