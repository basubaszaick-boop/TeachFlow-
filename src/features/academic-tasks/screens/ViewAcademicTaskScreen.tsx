
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import ScreenContainer from "../../../components/layout/ScreenContainer";
import AppHeader from "../../../components/layout/appheader";
import AppCard from "../../../components/common/appcard";
import StatusBadge from "../../../components/common/statusbadge";

import { Colors, Spacing, Typography } from "../../../theme";
import { AcademicTask } from "../types/academic-task.types";

type ViewAcademicTaskScreenProps = {
  task: AcademicTask;
  onBack: () => void;
  onEdit: () => void;
};

const ViewAcademicTaskScreen = ({
  task,
  onBack,
  onEdit,
}: ViewAcademicTaskScreenProps) => {
  const details = [
    { label: "Subject Code", value: task.subjectCode },
    { label: "Subject Name", value: task.subjectName },
    { label: "Category", value: task.category },
    { label: "Due Date", value: task.dueDate },
    { label: "Priority", value: task.priority },
    { label: "Created At", value: task.createdAt.slice(0, 10) },
  ];

  return (
    <ScreenContainer>
      <AppHeader title="Task Details" />

      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <AppCard>
          <Text style={styles.title}>{task.title}</Text>

          <View style={styles.statusContainer}>
            <StatusBadge status={task.status} />
          </View>

          <Text style={styles.sectionTitle}>Task Information</Text>

          {details.map((detail) => (
            <View key={detail.label} style={styles.detailRow}>
              <Text style={styles.label}>{detail.label}</Text>
              <Text style={styles.value}>{detail.value}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Description</Text>

          <Text style={styles.description}>
            {task.description || "No description provided."}
          </Text>
        </AppCard>

        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editButtonText}>Edit Task</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onBack}>
          <Text style={styles.cancelButtonText}>Back to Tasks</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: Typography.title,
    fontWeight: "700",
    color: Colors.text,
  },
  statusContainer: {
    alignSelf: "flex-start",
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.subtitle,
    fontWeight: "700",
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  label: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    flex: 1,
  },
  value: {
    fontSize: Typography.body,
    color: Colors.text,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  description: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  editButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: Typography.body,
  },
  cancelButton: {
    padding: Spacing.lg,
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontWeight: "600",
    fontSize: Typography.body,
  },
});

export default ViewAcademicTaskScreen;
