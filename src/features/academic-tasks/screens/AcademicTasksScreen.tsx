
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";

import ScreenContainer from "../../../components/layout/ScreenContainer";
import AppHeader from "../../../components/layout/appheader";
import AppButton from "../../../components/common/appbutton";
import AppCard from "../../../components/common/appcard";
import StatusBadge from "../../../components/common/statusbadge";

import { Colors, Spacing, Typography } from "../../../theme";
import { useAcademicTasks } from "../context/AcademicTaskContext";
import {
  AcademicTask,
  TaskStatus,
} from "../types/academic-task.types";

type AcademicTasksScreenProps = {
  onBack: () => void;
  onAddTask: () => void;
  onViewTask: (task: AcademicTask) => void;
  onEditTask: (task: AcademicTask) => void;
};

const filters = ["All", "Pending", "In Progress", "Completed"] as const;

type TaskFilter = (typeof filters)[number];

const AcademicTasksScreen = ({
  onBack,
  onAddTask,
  onViewTask,
  onEditTask,
}: AcademicTasksScreenProps) => {
  const { tasks, deleteTask, updateTaskStatus } = useAcademicTasks();

  const [activeFilter, setActiveFilter] = useState<TaskFilter>("All");

  const filteredTasks =
    activeFilter === "All"
      ? tasks
      : tasks.filter((task) => task.status === activeFilter);

  const handleDelete = (task: AcademicTask) => {
    Alert.alert(
      "Delete Task",
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTask(task.id),
        },
      ]
    );
  };

  const handleStatusChange = (task: AcademicTask) => {
    const statuses: TaskStatus[] = [
      "Pending",
      "In Progress",
      "Completed",
    ];

    Alert.alert("Update Task Status", "Select a new status:", [
      ...statuses.map((status) => ({
        text: status,
        onPress: () => updateTaskStatus(task.id, status),
      })),
      { text: "Cancel", style: "cancel" as const },
    ]);
  };

  const renderTask = ({ item }: { item: AcademicTask }) => (
    <AppCard>
      <View style={styles.taskHeader}>
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={styles.subject}>
            {item.subjectCode} • {item.subjectName}
          </Text>
        </View>

        <StatusBadge status={item.status} />
      </View>

      <View style={styles.details}>
        <Text style={styles.detailText}>
          Category: {item.category}
        </Text>

        <Text style={styles.detailText}>
          Due Date: {item.dueDate}
        </Text>

        <Text style={styles.detailText}>
          Priority: {item.priority}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onViewTask(item)}>
          <Text style={styles.actionText}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onEditTask(item)}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleStatusChange(item)}>
          <Text style={styles.actionText}>Status</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDelete(item)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </AppCard>
  );

  return (
    <ScreenContainer scrollable={false}>
      <AppHeader title="Academic Tasks" />

      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.heading}>
        <View>
          <Text style={styles.headingTitle}>My Academic Tasks</Text>
          <Text style={styles.subtitle}>
            Organize and manage your academic responsibilities.
          </Text>
        </View>
      </View>

      <AppButton
        title="+ Add New Task"
        onPress={onAddTask}
      />

      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              activeFilter === filter && styles.activeFilter,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        style={styles.taskList}
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No tasks found</Text>
            <Text style={styles.subtitle}>
              Add a new academic task to get started.
            </Text>
          </View>
        }
      />
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

  heading: {
    marginBottom: Spacing.lg,
  },

  headingTitle: {
    fontSize: Typography.title,
    fontWeight: "700",
    color: Colors.text,
  },

  subtitle: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },

  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginVertical: Spacing.lg,
  },

  filterButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  activeFilter: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  filterText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },

  activeFilterText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  taskList: {
    flex: 1,
  },

  list: {
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
  },

  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },

  taskInfo: {
    flex: 1,
  },

  taskTitle: {
    fontSize: Typography.subtitle,
    fontWeight: "700",
    color: Colors.text,
  },

  subject: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },

  details: {
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },

  detailText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  actionText: {
    color: Colors.primary,
    fontSize: Typography.caption,
    fontWeight: "600",
  },

  deleteText: {
    color: Colors.danger,
    fontSize: Typography.caption,
    fontWeight: "600",
  },

  emptyContainer: {
    alignItems: "center",
    padding: Spacing.xxl,
  },

  emptyTitle: {
    fontSize: Typography.subtitle,
    fontWeight: "700",
    color: Colors.text,
  },
});

export default AcademicTasksScreen;
