
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";

import ScreenContainer from "../../../components/layout/ScreenContainer";
import AppHeader from "../../../components/layout/appheader";
import AppInput from "../../../components/common/appinput";
import AppButton from "../../../components/common/appbutton";

import { Colors, Spacing, Typography } from "../../../theme";
import { useSubjects } from "../../subjects/context/SubjectsContext";
import { useAcademicTasks } from "../context/AcademicTaskContext";

import {
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from "../types/academic-task.types";

type AddAcademicTaskScreenProps = {
  onBack: () => void;
};

const categories: TaskCategory[] = [
  "Lesson Plan",
  "Instructional Materials",
  "Reports",
  "Syllabus",
];

const priorities: TaskPriority[] = ["Low", "Medium", "High"];

const statuses: TaskStatus[] = [
  "Pending",
  "In Progress",
  "Completed",
];

const AddAcademicTaskScreen = ({
  onBack,
}: AddAcademicTaskScreenProps) => {
  const { subjects } = useSubjects();
  const { addTask } = useAcademicTasks();

  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [category, setCategory] = useState<TaskCategory>("Lesson Plan");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [status, setStatus] = useState<TaskStatus>("Pending");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    if (
      !title.trim() ||
      !subjectId ||
      !dueDate.trim()
    ) {
      Alert.alert(
        "Required Fields",
        "Please enter the task title, select a subject, and provide a due date."
      );
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate.trim())) {
      Alert.alert(
        "Invalid Date",
        "Please use YYYY-MM-DD format, example: 2026-11-15."
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

    addTask({
      title: title.trim(),
      subjectId: selectedSubject.id,
      subjectCode: selectedSubject.subjectCode,
      subjectName: selectedSubject.subjectName,
      category,
      dueDate: dueDate.trim(),
      priority,
      status,
      description: description.trim(),
    });

    Alert.alert("Success", "Academic task added successfully!", [
      {
        text: "OK",
        onPress: onBack,
      },
    ]);
  };

  const renderOptions = <T extends string>(
    label: string,
    options: T[],
    selected: T,
    onSelect: (value: T) => void
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              selected === option && styles.selectedOption,
            ]}
            onPress={() => onSelect(option)}
          >
            <Text
              style={[
                styles.optionText,
                selected === option && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <AppHeader title="Add Academic Task" />

      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.heading}>Create New Task</Text>
        <Text style={styles.subtitle}>
          Add and organize your academic responsibilities.
        </Text>

        <AppInput
          label="Task Title"
          placeholder="Enter task title"
          value={title}
          onChangeText={setTitle}
        />

        <View style={styles.field}>
          <Text style={styles.label}>Select Subject</Text>

          {subjects.length === 0 ? (
            <Text style={styles.helperText}>
              No subjects available. Please add a subject first.
            </Text>
          ) : (
            <View style={styles.optionsContainer}>
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    styles.option,
                    subjectId === subject.id && styles.selectedOption,
                  ]}
                  onPress={() => setSubjectId(subject.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      subjectId === subject.id &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {subject.subjectCode}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {renderOptions(
          "Task Category",
          categories,
          category,
          setCategory
        )}

        <AppInput
          label="Due Date (YYYY-MM-DD)"
          placeholder="2026-11-15"
          value={dueDate}
          onChangeText={setDueDate}
        />

        {renderOptions(
          "Priority",
          priorities,
          priority,
          setPriority
        )}

        {renderOptions(
          "Task Status",
          statuses,
          status,
          setStatus
        )}

        <AppInput
          label="Description"
          placeholder="Enter task description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <View style={styles.buttons}>
          <AppButton
            title="Save Task"
            onPress={handleSave}
          />

          <AppButton
            title="Cancel"
            variant="outline"
            onPress={onBack}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginBottom: Spacing.md,
  },
  backText: {
    color: Colors.primary,
    fontSize: Typography.body,
    fontWeight: "600",
  },
  content: {
    paddingBottom: Spacing.xxxl,
  },
  heading: {
    fontSize: Typography.title,
    fontWeight: "700",
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  field: {
    marginBottom: Spacing.lg,
  },
  label: {
    color: Colors.text,
    fontSize: Typography.body,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  option: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },
  selectedOptionText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  helperText: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
  },
  buttons: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
});

export default AddAcademicTaskScreen;
