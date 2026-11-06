
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  Modal,
  TextInput,
  Switch,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";

import {
  updateProfile,
  updateEmail,
} from "firebase/auth";

import { auth } from "../../../services/firebase/firebase";

import ScreenContainer from "../../../components/layout/ScreenContainer";
import AppHeader from "../../../components/layout/appheader";
import AppCard from "../../../components/common/appcard";
import AppButton from "../../../components/common/appbutton";

import { Colors, Spacing, Typography } from "../../../theme";

type ProfileScreenProps = {
  onEditProfile?: () => void;
  onLogout?: () => void;
};

type NotificationSettings = {
  classReminders: boolean;
  preparationReminders: boolean;
  taskReminders: boolean;
};

const defaultNotifications: NotificationSettings = {
  classReminders: true,
  preparationReminders: true,
  taskReminders: true,
};

const ProfileScreen = ({
  onEditProfile,
  onLogout,
}: ProfileScreenProps) => {
  const currentUser = auth.currentUser;

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  const [fullName, setFullName] = useState(
    currentUser?.displayName || ""
  );

  const [email, setEmail] = useState(currentUser?.email || "");
  const [department, setDepartment] = useState("");

  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editDepartment, setEditDepartment] = useState("");

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(defaultNotifications);

  const userId = currentUser?.uid || "guest";

  const imageStorageKey = `teachflow_profile_image_${userId}`;
  const departmentStorageKey = `teachflow_department_${userId}`;
  const notificationStorageKey = `teachflow_notifications_${userId}`;

  const instructorName = fullName.trim() || "Instructor";
  const instructorEmail = email || "No email available";

  // LOAD SAVED PROFILE INFORMATION
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const [savedImage, savedDepartment, savedNotifications] =
          await Promise.all([
            AsyncStorage.getItem(imageStorageKey),
            AsyncStorage.getItem(departmentStorageKey),
            AsyncStorage.getItem(notificationStorageKey),
          ]);

        if (savedImage) {
          setProfileImage(savedImage);
        } else {
          setProfileImage(currentUser?.photoURL ?? null);
        }

        if (savedDepartment) {
          setDepartment(savedDepartment);
        }

        if (savedNotifications) {
          setNotificationSettings({
            ...defaultNotifications,
            ...JSON.parse(savedNotifications),
          });
        }
      } catch (error) {
        console.log("Error loading profile information:", error);
      } finally {
        setIsLoadingImage(false);
      }
    };

    loadProfileData();
  }, [
    imageStorageKey,
    departmentStorageKey,
    notificationStorageKey,
    currentUser?.photoURL,
  ]);

  // OPEN EDIT PROFILE
  const openEditProfile = () => {
    setEditFullName(fullName);
    setEditEmail(email);
    setEditDepartment(department);
    setIsEditModalVisible(true);
  };

  // SAVE PERSONAL INFORMATION
  const saveProfileInformation = async () => {
    if (!editFullName.trim() || !editEmail.trim()) {
      Alert.alert(
        "Required Fields",
        "Please enter your full name and email address."
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(editEmail.trim())) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address."
      );
      return;
    }

    if (!currentUser) {
      Alert.alert("Error", "No authenticated user found.");
      return;
    }

    try {
      setIsSaving(true);

      const newName = editFullName.trim();
      const newEmail = editEmail.trim().toLowerCase();

      // Update Firebase display name
      if (newName !== currentUser.displayName) {
        await updateProfile(currentUser, {
          displayName: newName,
        });
      }

      // Update Firebase email if it changed
      if (newEmail !== currentUser.email) {
        await updateEmail(currentUser, newEmail);
      }

      // Save department locally
      await AsyncStorage.setItem(
        departmentStorageKey,
        editDepartment.trim()
      );

      // Update displayed information
      setFullName(newName);
      setEmail(newEmail);
      setDepartment(editDepartment.trim());

      setIsEditModalVisible(false);

      Alert.alert(
        "Success",
        "Your personal information has been updated."
      );
    } catch (error: any) {
      console.log("Profile update error:", error);

      if (error.code === "auth/requires-recent-login") {
        Alert.alert(
          "Authentication Required",
          "For security, please log out and log in again before changing your email address."
        );
      } else if (error.code === "auth/email-already-in-use") {
        Alert.alert(
          "Email Already Used",
          "This email address is already connected to another account."
        );
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
      } else if (error.code === "auth/operation-not-allowed") {
        Alert.alert(
          "Email Update Unavailable",
          "Email updates are not enabled for this Firebase project."
        );
      } else {
        Alert.alert(
          "Update Failed",
          error.message || "Unable to update your profile."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  // SELECT AND SAVE PROFILE PICTURE
  const pickProfilePicture = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow TeachFlow to access your photo gallery."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const selectedImage = result.assets[0].uri;

      if (!FileSystem.documentDirectory) {
        throw new Error("App storage directory is unavailable.");
      }

      const folderUri =
        `${FileSystem.documentDirectory}profile-pictures/`;

      await FileSystem.makeDirectoryAsync(folderUri, {
        intermediates: true,
      });

      const destinationUri =
        `${folderUri}${userId}_${Date.now()}.jpg`;

      await FileSystem.copyAsync({
        from: selectedImage,
        to: destinationUri,
      });

      await AsyncStorage.setItem(
        imageStorageKey,
        destinationUri
      );

      setProfileImage(destinationUri);

      Alert.alert(
        "Success",
        "Your profile picture has been saved successfully!"
      );
    } catch (error) {
      console.log("Profile picture error:", error);

      Alert.alert(
        "Save Failed",
        "Unable to save your profile picture. Please try again."
      );
    }
  };

  // SAVE NOTIFICATION PREFERENCE
  const toggleNotification = async (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    const updatedSettings = {
      ...notificationSettings,
      [key]: value,
    };

    setNotificationSettings(updatedSettings);

    try {
      await AsyncStorage.setItem(
        notificationStorageKey,
        JSON.stringify(updatedSettings)
      );
    } catch (error) {
      console.log("Notification settings error:", error);

      Alert.alert(
        "Save Failed",
        "Unable to save your notification preferences."
      );
    }
  };

  return (
    <ScreenContainer>
      <AppHeader title="My Profile" />

      {/* PROFILE HEADER */}
      <View style={styles.profileHeader}>
        <Pressable
          onPress={pickProfilePicture}
          style={styles.avatarContainer}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {instructorName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <View style={styles.cameraButton}>
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
        </Pressable>

        <Text style={styles.changePhotoText}>
          {isLoadingImage
            ? "Loading profile picture..."
            : "Tap to change profile picture"}
        </Text>

        <Text style={styles.name}>{instructorName}</Text>

        <Text style={styles.role}>Instructor</Text>

        <Text style={styles.email}>{instructorEmail}</Text>
      </View>

      {/* PERSONAL INFORMATION */}
      <AppCard>
        <Text style={styles.sectionTitle}>
          Personal Information
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{instructorName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email Address</Text>
          <Text style={styles.value}>{instructorEmail}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Department</Text>
          <Text style={styles.value}>
            {department || "Not provided"}
          </Text>
        </View>

        <Pressable
          style={styles.editInformationButton}
          onPress={openEditProfile}
        >
          <Text style={styles.editInformationText}>
            ✏️  Edit Personal Information
          </Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </AppCard>

      {/* ACCOUNT SETTINGS */}
      <AppCard>
        <Text style={styles.sectionTitle}>
          Account Settings
        </Text>

        <Pressable
          style={styles.settingRow}
          onPress={openEditProfile}
        >
          <View style={styles.settingIcon}>
            <Text>👤</Text>
          </View>

          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>
              Account Information
            </Text>
            <Text style={styles.settingDescription}>
              Manage your personal account details.
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable
          style={styles.settingRow}
          onPress={() => {
            Alert.alert(
              "Notification Settings",
              "Manage your reminder preferences below."
            );
          }}
        >
          <View style={styles.settingIcon}>
            <Text>🔔</Text>
          </View>

          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>
              Notifications
            </Text>
            <Text style={styles.settingDescription}>
              Manage your reminder preferences.
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable
          style={styles.settingRow}
          onPress={() => setIsAboutModalVisible(true)}
        >
          <View style={styles.settingIcon}>
            <Text>ℹ️</Text>
          </View>

          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>
              About TeachFlow
            </Text>
            <Text style={styles.settingDescription}>
              Learn more about the TeachFlow system.
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </AppCard>

      {/* NOTIFICATION PREFERENCES */}
      <AppCard>
        <Text style={styles.sectionTitle}>
          Notification Preferences
        </Text>

        <View style={styles.notificationRow}>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>
              Class Reminders
            </Text>
            <Text style={styles.settingDescription}>
              Reminders for your upcoming classes.
            </Text>
          </View>

          <Switch
            value={notificationSettings.classReminders}
            onValueChange={(value) =>
              toggleNotification("classReminders", value)
            }
            trackColor={{
              false: Colors.border,
              true: Colors.primaryLight,
            }}
            thumbColor={
              notificationSettings.classReminders
                ? Colors.primary
                : "#F4F4F5"
            }
          />
        </View>

        <View style={styles.notificationRow}>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>
              Lesson Preparation
            </Text>
            <Text style={styles.settingDescription}>
              Reminders for lesson preparation deadlines.
            </Text>
          </View>

          <Switch
            value={notificationSettings.preparationReminders}
            onValueChange={(value) =>
              toggleNotification("preparationReminders", value)
            }
            trackColor={{
              false: Colors.border,
              true: Colors.primaryLight,
            }}
            thumbColor={
              notificationSettings.preparationReminders
                ? Colors.primary
                : "#F4F4F5"
            }
          />
        </View>

        <View style={styles.notificationRow}>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>
              Academic Task Deadlines
            </Text>
            <Text style={styles.settingDescription}>
              Reminders for pending academic tasks.
            </Text>
          </View>

          <Switch
            value={notificationSettings.taskReminders}
            onValueChange={(value) =>
              toggleNotification("taskReminders", value)
            }
            trackColor={{
              false: Colors.border,
              true: Colors.primaryLight,
            }}
            thumbColor={
              notificationSettings.taskReminders
                ? Colors.primary
                : "#F4F4F5"
            }
          />
        </View>
      </AppCard>

      {/* EDIT PROFILE MODAL */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Edit Personal Information
            </Text>

            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={editFullName}
              onChangeText={setEditFullName}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.textSecondary}
            />

            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Enter your email address"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Department</Text>
            <TextInput
              style={styles.textInput}
              value={editDepartment}
              onChangeText={setEditDepartment}
              placeholder="Enter your department"
              placeholderTextColor={Colors.textSecondary}
            />

            <Pressable
              style={[
                styles.saveButton,
                isSaving && styles.disabledButton,
              ]}
              onPress={saveProfileInformation}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>
                  Save Changes
                </Text>
              )}
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => setIsEditModalVisible(false)}
              disabled={isSaving}
            >
              <Text style={styles.cancelButtonText}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ABOUT TEACHFLOW MODAL */}
      <Modal
        visible={isAboutModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setIsAboutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.aboutLogo}>
              <Text style={styles.aboutLogoText}>TF</Text>
            </View>

            <Text style={styles.modalTitle}>TeachFlow</Text>

            <Text style={styles.aboutSubtitle}>
              Mobile-Based Teaching Workload Management System
            </Text>

            <Text style={styles.aboutDescription}>
              TeachFlow is designed to help college instructors
              organize their subjects, class schedules, lesson
              preparations, academic tasks, and reminders in one
              convenient application.
            </Text>

            <Text style={styles.versionText}>
              Version 1.0.0
            </Text>

            <Pressable
              style={styles.saveButton}
              onPress={() => setIsAboutModalVisible(false)}
            >
              <Text style={styles.saveButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* EDIT PROFILE BUTTON */}
      {onEditProfile && (
        <AppButton
          title="Edit Profile"
          onPress={openEditProfile}
        />
      )}

      {/* LOG OUT */}
      {onLogout && (
        <View style={styles.logoutButton}>
          <AppButton
            title="Log Out"
            onPress={onLogout}
          />
        </View>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
  },

  avatarContainer: {
    width: 110,
    height: 110,
    position: "relative",
    marginBottom: Spacing.sm,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.primary,
  },

  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: Colors.primary,
  },

  avatarText: {
    fontSize: 40,
    fontWeight: "700",
    color: Colors.primary,
  },

  cameraButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.surface,
  },

  cameraIcon: {
    fontSize: 16,
  },

  changePhotoText: {
    fontSize: Typography.caption,
    color: Colors.primary,
    marginBottom: Spacing.md,
  },

  name: {
    width: "100%",
    textAlign: "center",
    fontSize: Typography.title,
    fontWeight: "700",
    color: Colors.text,
  },

  role: {
    fontSize: Typography.body,
    color: Colors.primary,
    marginTop: Spacing.xs,
    textAlign: "center",
  },

  email: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: Typography.subtitle,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.lg,
  },

  infoRow: {
    marginBottom: Spacing.md,
  },

  label: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },

  value: {
    fontSize: Typography.body,
    fontWeight: "600",
    color: Colors.text,
  },

  editInformationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Spacing.md,
    marginTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  editInformationText: {
    color: Colors.primary,
    fontSize: Typography.body,
    fontWeight: "600",
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },

  settingContent: {
    flex: 1,
  },

  settingTitle: {
    fontSize: Typography.body,
    fontWeight: "600",
    color: Colors.text,
  },

  settingDescription: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },

  arrow: {
    fontSize: 25,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },

  notificationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  logoutButton: {
    marginTop: Spacing.md,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    padding: Spacing.lg,
  },

  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.xl,
  },

  modalTitle: {
    fontSize: Typography.title,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },

  inputLabel: {
    fontSize: Typography.caption,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },

  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: Spacing.md,
    color: Colors.text,
    fontSize: Typography.body,
    backgroundColor: Colors.background,
  },

  saveButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xl,
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: Typography.body,
    fontWeight: "700",
  },

  cancelButton: {
    paddingVertical: Spacing.md,
    alignItems: "center",
  },

  cancelButtonText: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    fontWeight: "600",
  },

  aboutLogo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: Spacing.md,
  },

  aboutLogoText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  aboutSubtitle: {
    fontSize: Typography.body,
    color: Colors.primary,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: Spacing.md,
  },

  aboutDescription: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: "center",
  },

  versionText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.lg,
  },
});

export default ProfileScreen;
