
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

import {
  Colors,
  Spacing,
  Typography,
} from "../../../theme";

import ScreenContainer from "../../../components/layout/ScreenContainer";
import AppHeader from "../../../components/layout/appheader";
import AppCard from "../../../components/common/appcard";
import AppButton from "../../../components/common/appbutton";
import StatusBadge from "../../../components/common/statusbadge";

import {
  LessonPreparation,
} from "../types/lesson-preparation.types";

import {
  useLessonPreparation,
} from "../context/LessonPreparationContext";

import AddPreparationScreen from "./AddPreparationScreen";
import EditPreparationScreen from "./EditPreparationScreen";

type LessonPreparationScreenProps = {
  onBack: () => void;
};

export default function LessonPreparationScreen({
  onBack,
}: LessonPreparationScreenProps) {
  const {
    preparations,
    addPreparation,
    updatePreparation,
    deletePreparation,
  } = useLessonPreparation();

  const [selectedFilter, setSelectedFilter] =
    useState("All");

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [showEditForm, setShowEditForm] =
    useState(false);

  const [selectedPreparation, setSelectedPreparation] =
    useState<LessonPreparation | null>(null);

  const filters = [
    "All",
    "Not Started",
    "In Progress",
    "Completed",
  ];

  const filteredPreparations =
    selectedFilter === "All"
      ? preparations
      : preparations.filter(
          (item) => item.status === selectedFilter
        );

  // ADD PREPARATION
  const handleSavePreparation = (
    preparation: Parameters<typeof addPreparation>[0]
  ) => {
    addPreparation(preparation);
    setShowAddForm(false);

    Alert.alert(
      "Success",
      "Lesson preparation added successfully!"
    );
  };

  // OPEN EDIT FORM
  const handleEditPreparation = (
    preparation: LessonPreparation
  ) => {
    setSelectedPreparation(preparation);
    setShowEditForm(true);
  };

  // UPDATE PREPARATION
  const handleUpdatePreparation = (
    updatedData: Parameters<typeof updatePreparation>[1]
  ) => {
    if (!selectedPreparation) return;

    updatePreparation(
      selectedPreparation.id,
      updatedData
    );

    setShowEditForm(false);
    setSelectedPreparation(null);

    Alert.alert(
      "Success",
      "Lesson preparation updated successfully!"
    );
  };

  // DELETE PREPARATION
  const handleDelete = (
    id: string,
    topic: string
  ) => {
    Alert.alert(
      "Delete Preparation",
      `Are you sure you want to delete "${topic}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deletePreparation(id),
        },
      ]
    );
  };

  // SHOW ADD FORM
  if (showAddForm) {
    return (
      <AddPreparationScreen
        onSave={handleSavePreparation}
        onCancel={() => setShowAddForm(false)}
      />
    );
  }

  // SHOW EDIT FORM
  if (showEditForm && selectedPreparation) {
    return (
      <EditPreparationScreen
        preparation={selectedPreparation}
        onSave={handleUpdatePreparation}
        onCancel={() => {
          setShowEditForm(false);
          setSelectedPreparation(null);
        }}
      />
    );
  }

  // MAIN PREPARATION LIST
  return (
    <ScreenContainer>
      <AppHeader title="Lesson Preparation" />

      <View style={styles.backContainer}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>
            ‹ Back to Dashboard
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.headingContainer}>
          <View>
            <Text style={styles.heading}>
              My Preparations
            </Text>

            <Text style={styles.subtitle}>
              Organize and track your lesson preparation.
            </Text>
          </View>

          <Text style={styles.totalText}>
            {preparations.length} Total
          </Text>
        </View>

        {/* ADD BUTTON */}
        <AppButton
          title="+ Add Preparation"
          onPress={() => setShowAddForm(true)}
        />

        {/* STATUS FILTERS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {filters.map((filter) => {
            const isActive =
              selectedFilter === filter;

            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  isActive && styles.activeFilter,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.activeFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* PREPARATION LIST */}
        {filteredPreparations.length === 0 ? (
          <AppCard>
            <Text style={styles.emptyTitle}>
              No Preparations Found
            </Text>

            <Text style={styles.emptyText}>
              There are no lesson preparations under this status.
            </Text>
          </AppCard>
        ) : (
          filteredPreparations.map((item) => (
            <AppCard key={item.id}>
              <View style={styles.cardHeader}>
                <View style={styles.subjectInfo}>
                  <Text style={styles.subjectCode}>
                    {item.subjectCode}
                  </Text>

                  <Text style={styles.subjectName}>
                    {item.subjectName}
                  </Text>
                </View>

                <StatusBadge status={item.status} />
              </View>

              <Text style={styles.topic}>
                {item.topic}
              </Text>

              <View style={styles.dateContainer}>
                <Text style={styles.dateLabel}>
                  Teaching Date
                </Text>

                <Text style={styles.dateValue}>
                  {item.teachingDate}
                </Text>
              </View>

              <View style={styles.dateContainer}>
                <Text style={styles.dateLabel}>
                  Preparation Deadline
                </Text>

                <Text style={styles.dateValue}>
                  {item.preparationDeadline}
                </Text>
              </View>

              {item.notes ? (
                <Text style={styles.notes}>
                  {item.notes}
                </Text>
              ) : null}

              {/* ACTION BUTTONS */}
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      item.topic,
                      `Subject: ${item.subjectName}\nTeaching Date: ${item.teachingDate}\nDeadline: ${item.preparationDeadline}\nStatus: ${item.status}\n\nNotes: ${item.notes || "No notes"}`
                    )
                  }
                >
                  <Text style={styles.viewAction}>
                    View
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    handleEditPreparation(item)
                  }
                >
                  <Text style={styles.editAction}>
                    Edit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    handleDelete(item.id, item.topic)
                  }
                >
                  <Text style={styles.deleteAction}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </AppCard>
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },

  backText: {
    color: Colors.primary,
    fontSize: Typography.body,
    fontWeight: "600",
  },

  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },

  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },

  heading: {
    fontSize: Typography.title,
    fontWeight: "700",
    color: Colors.text,
  },

  subtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    marginTop: Spacing.xs,
  },

  totalText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: Typography.caption,
  },

  filterContainer: {
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
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
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    fontWeight: "500",
  },

  activeFilterText: {
    color: "#FFFFFF",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },

  subjectInfo: {
    flex: 1,
  },

  subjectCode: {
    color: Colors.primary,
    fontSize: Typography.caption,
    fontWeight: "700",
  },

  subjectName: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    marginTop: 2,
  },

  topic: {
    color: Colors.text,
    fontSize: Typography.subtitle,
    fontWeight: "700",
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },

  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },

  dateLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
  },

  dateValue: {
    color: Colors.text,
    fontSize: Typography.caption,
    fontWeight: "600",
  },

  notes: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    marginTop: Spacing.sm,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
  },

  viewAction: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: Typography.caption,
  },

  editAction: {
    color: Colors.warning,
    fontWeight: "600",
    fontSize: Typography.caption,
  },

  deleteAction: {
    color: Colors.danger,
    fontWeight: "600",
    fontSize: Typography.caption,
  },

  emptyTitle: {
    color: Colors.text,
    fontSize: Typography.subtitle,
    fontWeight: "700",
    textAlign: "center",
  },

  emptyText: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
});
