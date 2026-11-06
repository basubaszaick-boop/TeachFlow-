
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

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../services/firebase/firebase";

import {
  Colors,
  Spacing,
  Typography,
} from "../../../theme";

import ScreenContainer from "../../../components/layout/ScreenContainer";
import AppInput from "../../../components/common/appinput";
import AppButton from "../../../components/common/appbutton";

type LoginScreenProps = {
  onLogin: () => void;
  onRegister: () => void;
  onForgotPassword: () => void;
};

export default function LoginScreen({
  onLogin,
  onRegister,
  onForgotPassword,
}: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (isLoading) return;

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setError("");
      setIsLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      setIsLoading(false);
      onLogin();

    } catch (error: any) {
      console.log("Login error:", error.code, error.message);

      let errorMessage = "Login failed. Please try again.";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;

        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          errorMessage = "Incorrect email or password.";
          break;

        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;

        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later.";
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
              Manage your teaching workload with ease.
            </Text>

            <View style={styles.formContainer}>
              <Text style={styles.heading}>
                Welcome Back!
              </Text>

              <Text style={styles.description}>
                Sign in to manage your teaching activities.
              </Text>

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
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                style={styles.forgotContainer}
                onPress={onForgotPassword}
              >
                <Text style={styles.forgotText}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {error !== "" && (
                <Text style={styles.errorText}>
                  {error}
                </Text>
              )}

              <AppButton
                title={isLoading ? "Signing In..." : "Sign In"}
                onPress={handleLogin}
                style={styles.loginButton}
              />

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>
                  Don't have an account?
                </Text>

                <TouchableOpacity onPress={onRegister}>
                  <Text style={styles.registerLink}>
                    {" "}Create Account
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

  forgotContainer: {
    alignSelf: "flex-end",
    marginBottom: Spacing.lg,
  },

  forgotText: {
    color: Colors.primary,
    fontSize: Typography.caption,
    fontWeight: Typography.semibold,
  },

  errorText: {
    color: Colors.danger,
    fontSize: Typography.caption,
    marginBottom: Spacing.md,
  },

  loginButton: {
    width: "100%",
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: Spacing.xl,
  },

  registerText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },

  registerLink: {
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
