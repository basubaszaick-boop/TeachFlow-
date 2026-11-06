
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import {
  Colors,
  Spacing,
  Typography,
} from "../../../theme";

import ScreenContainer from "../../../components/layout/ScreenContainer";
import AppHeader from "../../../components/layout/appheader";
import AppInput from "../../../components/common/appinput";
import AppButton from "../../../components/common/appbutton";

import { Subject } from "../types/subject.types";

type AddSubjectScreenProps = {
  onSave: (
    subject: Omit<Subject, "id" | "createdAt">
  ) => void;
  onCancel: () => void;
  initialSubject?: Subject;
};

export default function AddSubjectScreen({
  onSave,
  onCancel,
  initialSubject,
}: AddSubjectScreenProps) {
  const [subjectCode, setSubjectCode] = useState(
    initialSubject?.subjectCode ?? ""
  );

  const [subjectName, setSubjectName] = useState(
    initialSubject?.subjectName ?? ""
  );

  const [section, setSection] = useState(
    initialSubject?.section ?? ""
  );

  const [units, setUnits] = useState(
    String(initialSubject?.units ?? 3)
  );

  const [description, setDescription] = useState(
    initialSubject?.description ?? ""
  );

  const [error, setError] = useState("");

  const isEditing = Boolean(initialSubject);

  const handleSave = () => {
    if (
      !subjectCode.trim() ||
      !subjectName.trim() ||
      !section.trim() ||
      !units.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    const unitValue = Number(units);

    if (
      !Number.isInteger(unitValue) ||
      unitValue < 1 ||
      unitValue > 10
    ) {
      setError("Please enter a valid number of units (1–10).");
      return;
    }

    setError("");

    onSave({
      subjectCode: subjectCode.trim().toUpperCase(),
      subjectName: subjectName.trim(),
      section: section.trim(),
      units: unitValue,
      description: description.trim(),
      color: initialSubject?.color ?? Colors.primary,
    });
  };

  return (
    <ScreenContainer scrollable={false} padding={0}>
      <AppHeader
        title={isEditing ? "Edit Subject" : "Add Subject"}
        subtitle={
          isEditing
            ? "Update your subject information"
            : "Enter your subject information"
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>
            Subject Information
          </Text>

          <Text style={styles.helperText}>
            Fields marked as required must be completed.
          </Text>

          <AppInput
            label="Subject Code *"
            placeholder="e.g. IT313"
            autoCapitalize="characters"
            value={subjectCode}
            onChangeText={setSubjectCode}
          />

          <AppInput
            label="Subject Name *"
            placeholder="e.g. Mobile Programming"
            value={subjectName}
            onChangeText={setSubjectName}
          />

          <AppInput
            label="Section *"
            placeholder="e.g. BSIT 3B"
            autoCapitalize="characters"
            value={section}
            onChangeText={setSection}
          />

          <AppInput
            label="Number of Units *"
            placeholder="Enter units"
            keyboardType="number-pad"
            value={units}
            onChangeText={setUnits}
          />

          <AppInput
            label="Description"
            placeholder="Enter a short subject description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          {error !== "" && (
            <Text style={styles.errorText}>
              {error}
            </Text>
          )}

          <AppButton
            title={isEditing ? "Update Subject" : "Save Subject"}
            onPress={handleSave}
            style={styles.saveButton}
          />

          <AppButton
            title="Cancel"
            onPress={onCancel}
            variant="outline"
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  formCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: Typography.subtitle,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  helperText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  errorText: {
    color: Colors.danger,
    fontSize: Typography.caption,
    marginBottom: Spacing.md,
  },
  saveButton: {
    width: "100%",
    marginTop: Spacing.lg,
  },
  cancelButton: {
    width: "100%",
    marginTop: Spacing.md,
  },
});
