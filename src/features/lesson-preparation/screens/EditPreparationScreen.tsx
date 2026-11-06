
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

import { Colors, Spacing, Typography } from "../../../theme";
import ScreenContainer from "../../../components/layout/ScreenContainer";
import AppHeader from "../../../components/layout/appheader";
import AppButton from "../../../components/common/appbutton";

import { useSubjects } from "../../subjects/context/SubjectsContext";
import {
  LessonPreparation,
  PreparationStatus,
} from "../types/lesson-preparation.types";

type EditPreparationScreenProps = {
  preparation: LessonPreparation;
  onSave: (
    preparation: Omit<LessonPreparation, "id" | "createdAt">
  ) => void;
  onCancel: () => void;
};

export default function EditPreparationScreen({
  preparation,
  onSave,
  onCancel,
}: EditPreparationScreenProps) {
  const { subjects } = useSubjects();

  const [subjectId, setSubjectId] = useState(preparation.subjectId);
  const [topic, setTopic] = useState(preparation.topic);
  const [teachingDate, setTeachingDate] = useState(
    preparation.teachingDate
  );
  const [preparationDeadline, setPreparationDeadline] =
    useState(preparation.preparationDeadline);
  const [notes, setNotes] = useState(preparation.notes);
  const [status, setStatus] = useState<PreparationStatus>(
    preparation.status
  );

  const handleSave = () => {
    if (
      !subjectId ||
      !topic.trim() ||
      !teachingDate.trim() ||
      !preparationDeadline.trim()
    ) {
      Alert.alert(
        "Missing Information",
        "Please complete all required fields."
      );
      return;
    }

    const selectedSubject = subjects.find(
      (subject) => subject.id === subjectId
    );

    if (!selectedSubject) {
      Alert.alert("Error", "Please select a valid subject.");
      return;
    }

    onSave({
      subjectId: selectedSubject.id,
      subjectCode: selectedSubject.subjectCode,
      subjectName: selectedSubject.subjectName,
      topic: topic.trim(),
      teachingDate: teachingDate.trim(),
      preparationDeadline: preparationDeadline.trim(),
      notes: notes.trim(),
      status,
    });
  };

  return (
    <ScreenContainer>
      <AppHeader title="Edit Preparation" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.heading}>
          Update Lesson Preparation
        </Text>

        <Text style={styles.subtitle}>
          Modify the details of your lesson preparation.
        </Text>

        <Text style={styles.label}>Select Subject *</Text>

        <View style={styles.subjectList}>
          {subjects.map((subject) => {
            const selected = subjectId === subject.id;

            return (
              <TouchableOpacity
                key={subject.id}
                style={[
                  styles.subjectOption,
                  selected && styles.selectedSubject,
                ]}
                onPress={() => setSubjectId(subject.id)}
              >
                <Text
                  style={[
                    styles.subjectCode,
                    selected && styles.selectedText,
                  ]}
                >
                  {subject.subjectCode}
                </Text>

                <Text
                  style={[
                    styles.subjectName,
                    selected && styles.selectedText,
                  ]}
                >
                  {subject.subjectName} - {subject.section}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Lesson Topic *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter lesson topic"
          value={topic}
          onChangeText={setTopic}
        />

        <Text style={styles.label}>
          Teaching Date * (YYYY-MM-DD)
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Example: 2026-11-15"
          value={teachingDate}
          onChangeText={setTeachingDate}
        />

        <Text style={styles.label}>
          Preparation Deadline * (YYYY-MM-DD)
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Example: 2026-11-13"
          value={preparationDeadline}
          onChangeText={setPreparationDeadline}
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Add lesson notes or reminders..."
          value={notes}
          onChangeText={setNotes}
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.label}>Preparation Status</Text>

        <View style={styles.statusContainer}>
          {(
            ["Not Started", "In Progress", "Completed"] as PreparationStatus[]
          ).map((item) => {
            const selected = status === item;

            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.statusOption,
                  selected && styles.selectedStatus,
                ]}
                onPress={() => setStatus(item)}
              >
                <Text
                  style={[
                    styles.statusText,
                    selected && styles.selectedText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            title="Save Changes"
            onPress={handleSave}
          />

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  heading: {
    fontSize: Typography.title,
    fontWeight: "700",
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: Typography.body,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: Spacing.md,
    fontSize: Typography.body,
    color: Colors.text,
  },
  notesInput: {
    height: 110,
  },
  subjectList: {
    gap: Spacing.sm,
  },
  subjectOption: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: Spacing.md,
  },
  selectedSubject: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  subjectCode: {
    fontSize: Typography.caption,
    fontWeight: "700",
    color: Colors.primary,
  },
  subjectName: {
    fontSize: Typography.body,
    color: Colors.text,
    marginTop: 3,
  },
  selectedText: {
    color: Colors.primaryDark,
    fontWeight: "700",
  },
  statusContainer: {
    gap: Spacing.sm,
  },
  statusOption: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 10,
  },
  selectedStatus: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  statusText: {
    fontSize: Typography.body,
    color: Colors.text,
  },
  buttonContainer: {
    marginTop: Spacing.xxl,
    gap: Spacing.md,
  },
  cancelButton: {
    alignItems: "center",
    padding: Spacing.md,
  },
  cancelText: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    fontWeight: "600",
  },
});
