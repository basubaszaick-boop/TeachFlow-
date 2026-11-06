
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
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
import EmptyState from "../../../components/common/emptystate";

import AddSubjectScreen from "./AddSubjectScreen";
import { Subject } from "../types/subject.types";

type SubjectsScreenProps = {
  onBack: () => void;
};

const INITIAL_SUBJECTS: Subject[] = [
  {
    id: "1",
    subjectCode: "IT313",
    subjectName: "Mobile Programming",
    section: "BSIT 3B",
    units: 3,
    description: "Mobile application development.",
    color: "#2563EB",
    createdAt: "2026-11-03",
  },
  {
    id: "2",
    subjectCode: "IT314",
    subjectName: "Web Development",
    section: "BSIT 3B",
    units: 3,
    description: "Modern web application development.",
    color: "#7C3AED",
    createdAt: "2026-11-03",
  },
  {
    id: "3",
    subjectCode: "ITE104",
    subjectName: "Introduction to Computing",
    section: "BSIT 2D",
    units: 3,
    description: "Fundamental concepts of computing.",
    color: "#059669",
    createdAt: "2026-11-03",
  },
];

export default function SubjectsScreen({
  onBack,
}: SubjectsScreenProps) {
  const [subjects, setSubjects] = useState<Subject[]>(
    INITIAL_SUBJECTS
  );

  const [showAddScreen, setShowAddScreen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const handleAddSubject = (
    newSubject: Omit<Subject, "id" | "createdAt">
  ) => {
    const subject: Subject = {
      ...newSubject,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setSubjects((previousSubjects) => [
      ...previousSubjects,
      subject,
    ]);

    setShowAddScreen(false);
  };

  const handleUpdateSubject = (
    updatedData: Omit<Subject, "id" | "createdAt">
  ) => {
    if (!editingSubject) return;

    setSubjects((previousSubjects) =>
      previousSubjects.map((subject) =>
        subject.id === editingSubject.id
          ? {
              ...subject,
              ...updatedData,
            }
          : subject
      )
    );

    setEditingSubject(null);
    setSelectedSubject(null);
  };

  const handleDeleteSubject = (subject: Subject) => {
    Alert.alert(
      "Delete Subject",
      `Are you sure you want to delete ${subject.subjectName}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setSubjects((previousSubjects) =>
              previousSubjects.filter(
                (item) => item.id !== subject.id
              )
            );

            setSelectedSubject(null);
          },
        },
      ]
    );
  };

  const openEditScreen = (subject: Subject) => {
    setEditingSubject(subject);
    setShowAddScreen(true);
  };

  const closeForm = () => {
    setShowAddScreen(false);
    setEditingSubject(null);
  };

  if (showAddScreen) {
    return (
      <AddSubjectScreen
        initialSubject={editingSubject ?? undefined}
        onSave={
          editingSubject
            ? handleUpdateSubject
            : handleAddSubject
        }
        onCancel={closeForm}
      />
    );
  }

  if (selectedSubject) {
    const currentSubject =
      subjects.find(
        (subject) => subject.id === selectedSubject.id
      ) ?? selectedSubject;

    return (
      <ScreenContainer scrollable={false} padding={0}>
        <AppHeader
          title="Subject Details"
          subtitle="View your subject information"
        />

        <View style={styles.detailContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedSubject(null)}
          >
            <Text style={styles.backButtonText}>
              ← Back to Subjects
            </Text>
          </TouchableOpacity>

          <AppCard style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <View
                style={[
                  styles.colorIndicator,
                  {
                    backgroundColor: currentSubject.color,
                  },
                ]}
              />

              <View style={styles.subjectInfo}>
                <Text style={styles.subjectCode}>
                  {currentSubject.subjectCode}
                </Text>

                <Text style={styles.detailSubjectName}>
                  {currentSubject.subjectName}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.detailLabel}>Section</Text>
            <Text style={styles.detailValue}>
              {currentSubject.section}
            </Text>

            <View style={styles.detailSpacing} />

            <Text style={styles.detailLabel}>Number of Units</Text>
            <Text style={styles.detailValue}>
              {currentSubject.units} Units
            </Text>

            <View style={styles.detailSpacing} />

            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.description}>
              {currentSubject.description || "No description provided."}
            </Text>

            <View style={styles.detailSpacing} />

            <Text style={styles.detailLabel}>Date Added</Text>
            <Text style={styles.detailValue}>
              {new Date(currentSubject.createdAt).toLocaleDateString()}
            </Text>
          </AppCard>

          <AppButton
            title="Edit Subject"
            onPress={() => openEditScreen(currentSubject)}
            style={styles.actionButton}
          />

          <AppButton
            title="Delete Subject"
            onPress={() => handleDeleteSubject(currentSubject)}
            variant="outline"
            style={styles.deleteButton}
          />
        </View>
      </ScreenContainer>
    );
  }

  const renderSubject = ({ item }: { item: Subject }) => (
    <AppCard style={styles.subjectCard}>
      <View style={styles.subjectHeader}>
        <View
          style={[
            styles.colorIndicator,
            { backgroundColor: item.color },
          ]}
        />

        <View style={styles.subjectInfo}>
          <Text style={styles.subjectCode}>
            {item.subjectCode}
          </Text>

          <Text style={styles.subjectName}>
            {item.subjectName}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.subjectDetails}>
        <View>
          <Text style={styles.detailLabel}>Section</Text>
          <Text style={styles.detailValue}>
            {item.section}
          </Text>
        </View>

        <View>
          <Text style={styles.detailLabel}>Units</Text>
          <Text style={styles.detailValue}>
            {item.units} Units
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => setSelectedSubject(item)}
        >
          <Text style={styles.viewButtonText}>
            View Details
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openEditScreen(item)}
        >
          <Text style={styles.editButtonText}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>
    </AppCard>
  );

  return (
    <ScreenContainer scrollable={false} padding={0}>
      <AppHeader
        title="My Subjects"
        subtitle="Manage your teaching subjects"
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <Text style={styles.backButtonText}>
          ← Back to Dashboard
        </Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>
            {subjects.length}
          </Text>

          <Text style={styles.summaryLabel}>
            Total Subjects
          </Text>
        </View>

        <AppButton
          title="+ Add New Subject"
          onPress={() => setShowAddScreen(true)}
          style={styles.addButton}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Subject List
          </Text>

          <Text style={styles.sectionCount}>
            {subjects.length} subjects
          </Text>
        </View>

        <FlatList
          data={subjects}
          renderItem={renderSubject}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              title="No Subjects Yet"
              description="Add your first subject to get started."
            />
          }
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  detailContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  summaryCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
  },
  summaryNumber: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: Typography.bold,
  },
  summaryLabel: {
    color: "#DBEAFE",
    fontSize: Typography.body,
    marginTop: Spacing.xs,
  },
  addButton: {
    width: "100%",
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.subtitle,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  sectionCount: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingBottom: Spacing.xxxl,
  },
  subjectCard: {
    marginBottom: Spacing.md,
  },
  subjectHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorIndicator: {
    width: 5,
    height: 48,
    borderRadius: 5,
    marginRight: Spacing.md,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectCode: {
    color: Colors.primary,
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
  },
  subjectName: {
    color: Colors.text,
    fontSize: Typography.subtitle,
    fontWeight: Typography.semibold,
    marginTop: Spacing.xs,
  },
  detailSubjectName: {
    color: Colors.text,
    fontSize: Typography.title,
    fontWeight: Typography.bold,
    marginTop: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  subjectDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  description: {
    fontSize: Typography.body,
    color: Colors.text,
    marginTop: Spacing.xs,
    lineHeight: 21,
  },
  cardActions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  viewButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
  },
  viewButtonText: {
    color: Colors.primary,
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
  },
  editButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderRadius: 10,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editButtonText: {
    color: Colors.text,
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
  },
  detailCard: {
    marginBottom: Spacing.xl,
  },
  detailSpacing: {
    height: Spacing.lg,
  },
  actionButton: {
    width: "100%",
    marginBottom: Spacing.md,
  },
  deleteButton: {
    width: "100%",
    borderColor: Colors.danger,
  },
});
