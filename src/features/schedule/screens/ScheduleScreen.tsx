
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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

import {
  ClassDay,
  ClassSchedule,
} from "../types/class-schedule.types";

import { useSubjects } from "../../subjects/context/SubjectsContext";
import AddScheduleScreen from "./AddScheduleScreen";

const DAYS: ClassDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const INITIAL_SCHEDULES: ClassSchedule[] = [
  {
    id: "1",
    subjectId: "1",
    subjectCode: "IT313",
    subjectName: "Mobile Programming",
    section: "BSIT 3B",
    day: "Monday",
    startTime: "08:00 AM",
    endTime: "10:00 AM",
    room: "Laboratory 1",
    createdAt: "2026-11-04",
  },
  {
    id: "2",
    subjectId: "2",
    subjectCode: "IT314",
    subjectName: "Web Development",
    section: "BSIT 3B",
    day: "Monday",
    startTime: "01:00 PM",
    endTime: "03:00 PM",
    room: "Room 204",
    createdAt: "2026-11-04",
  },
  {
    id: "3",
    subjectId: "3",
    subjectCode: "ITE104",
    subjectName: "Introduction to Computing",
    section: "BSIT 2D",
    day: "Wednesday",
    startTime: "09:00 AM",
    endTime: "11:00 AM",
    room: "Room 105",
    createdAt: "2026-11-04",
  },
];

type FormSchedule = Omit<ClassSchedule, "id" | "createdAt">;

type ScheduleScreenProps = {
  onBack: () => void;
};

export default function ScheduleScreen({
  onBack,
}: ScheduleScreenProps) {
  const { subjects } = useSubjects();

  const [selectedDay, setSelectedDay] =
    useState<ClassDay>("Monday");

  const [schedules, setSchedules] =
    useState<ClassSchedule[]>(INITIAL_SCHEDULES);

  const [showForm, setShowForm] = useState(false);

  const [editingSchedule, setEditingSchedule] =
    useState<ClassSchedule | null>(null);

  const schedulesWithSubjects = schedules
    .filter((schedule) =>
      subjects.some(
        (subject) => subject.id === schedule.subjectId
      )
    )
    .map((schedule) => {
      const subject = subjects.find(
        (item) => item.id === schedule.subjectId
      );

      return {
        ...schedule,
        subjectCode: subject?.subjectCode ?? schedule.subjectCode,
        subjectName: subject?.subjectName ?? schedule.subjectName,
        section: subject?.section ?? schedule.section,
      };
    });

  const convertTime = (time: string) => {
    const [clock, period] = time.split(" ");
    let [hours, minutes] = clock.split(":").map(Number);

    if (period === "PM" && hours !== 12) {
      hours += 12;
    }

    if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  };

  const filteredSchedules = schedulesWithSubjects
    .filter((item) => item.day === selectedDay)
    .sort(
      (a, b) =>
        convertTime(a.startTime) -
        convertTime(b.startTime)
    );

  const handleAddSchedule = (data: FormSchedule) => {
    const newSchedule: ClassSchedule = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setSchedules((previous) => [
      ...previous,
      newSchedule,
    ]);

    setSelectedDay(data.day);
    setShowForm(false);
  };

  const handleUpdateSchedule = (data: FormSchedule) => {
    if (!editingSchedule) return;

    setSchedules((previous) =>
      previous.map((schedule) =>
        schedule.id === editingSchedule.id
          ? {
              ...schedule,
              ...data,
            }
          : schedule
      )
    );

    setSelectedDay(data.day);
    setEditingSchedule(null);
    setShowForm(false);
  };

  const handleDeleteSchedule = (schedule: ClassSchedule) => {
    Alert.alert(
      "Delete Class Schedule",
      `Are you sure you want to delete ${schedule.subjectCode}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setSchedules((previous) =>
              previous.filter(
                (item) => item.id !== schedule.id
              )
            );
          },
        },
      ]
    );
  };

  const openAddForm = () => {
    setEditingSchedule(null);
    setShowForm(true);
  };

  const openEditForm = (schedule: ClassSchedule) => {
    setEditingSchedule(schedule);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingSchedule(null);
  };

  if (showForm) {
    return (
      <AddScheduleScreen
        key={editingSchedule?.id ?? "new-schedule"}
        initialSchedule={editingSchedule ?? undefined}
        existingSchedules={schedules}
        onSave={
          editingSchedule
            ? handleUpdateSchedule
            : handleAddSchedule
        }
        onCancel={closeForm}
      />
    );
  }

  return (
    <ScreenContainer scrollable={false} padding={0}>
      {/* HEADER */}
<AppHeader
  title="Class Schedule"
  subtitle="Organize your weekly teaching classes"
/>

{/* BACK TO DASHBOARD */}
<View style={styles.backButtonContainer}>
  <TouchableOpacity
    style={styles.backButton}
    activeOpacity={0.7}
    onPress={onBack}
  >
    <Text style={styles.backText}>
      ← Back to Dashboard
    </Text>
  </TouchableOpacity>
</View>

      <View style={styles.container}>
        {/* SUMMARY */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>
            {schedulesWithSubjects.length}
          </Text>

          <Text style={styles.summaryLabel}>
            Total Scheduled Classes
          </Text>
        </View>

        {/* WEEKLY SCHEDULE */}
        <Text style={styles.sectionTitle}>
          Weekly Schedule
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysContainer}
        >
          {DAYS.map((day) => {
            const isSelected = selectedDay === day;

            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  isSelected && styles.selectedDayButton,
                ]}
                onPress={() => setSelectedDay(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    isSelected && styles.selectedDayText,
                  ]}
                >
                  {day.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* SELECTED DAY */}
        <View style={styles.scheduleHeader}>
          <Text style={styles.sectionTitle}>
            {selectedDay}
          </Text>

          <Text style={styles.classCount}>
            {filteredSchedules.length} classes
          </Text>
        </View>

        {/* SCHEDULE LIST */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scheduleList}
        >
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((item) => (
              <AppCard
                key={item.id}
                style={styles.scheduleCard}
              >
                <View style={styles.cardContent}>
                  <View style={styles.timeContainer}>
                    <Text style={styles.startTime}>
                      {item.startTime}
                    </Text>

                    <Text style={styles.timeSeparator}>
                      to
                    </Text>

                    <Text style={styles.endTime}>
                      {item.endTime}
                    </Text>
                  </View>

                  <View style={styles.verticalLine} />

                  <View style={styles.subjectInfo}>
                    <Text style={styles.subjectCode}>
                      {item.subjectCode}
                    </Text>

                    <Text style={styles.subjectName}>
                      {item.subjectName}
                    </Text>

                    <Text style={styles.subjectDetail}>
                      {item.section}
                    </Text>

                    <Text style={styles.subjectDetail}>
                      📍 {item.room}
                    </Text>
                  </View>
                </View>

                {/* EDIT AND DELETE */}
                <View style={styles.actionContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditForm(item)}
                  >
                    <Text style={styles.editText}>
                      ✏️ Edit
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteSchedule(item)}
                  >
                    <Text style={styles.deleteText}>
                      🗑 Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </AppCard>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📅</Text>

              <Text style={styles.emptyTitle}>
                No Classes Scheduled
              </Text>

              <Text style={styles.emptyDescription}>
                You don't have any classes scheduled for {selectedDay}.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* ADD SCHEDULE BUTTON */}
        <AppButton
          title="+ Add Class Schedule"
          onPress={openAddForm}
          style={styles.addButton}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backButtonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
  },

  backText: {
    color: Colors.primary,
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
  },

  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },

  summaryCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
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

  sectionTitle: {
    fontSize: Typography.subtitle,
    fontWeight: Typography.bold,
    color: Colors.text,
  },

  daysContainer: {
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },

  dayButton: {
    width: 48,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedDayButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  dayText: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
  },

  selectedDayText: {
    color: "#FFFFFF",
  },

  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },

  classCount: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
  },

  scheduleList: {
    paddingBottom: Spacing.lg,
  },

  scheduleCard: {
    marginBottom: Spacing.md,
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  timeContainer: {
    width: 85,
  },

  startTime: {
    color: Colors.text,
    fontSize: Typography.body,
    fontWeight: Typography.bold,
  },

  timeSeparator: {
    color: Colors.textSecondary,
    fontSize: Typography.small,
    marginVertical: 3,
  },

  endTime: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
  },

  verticalLine: {
    width: 3,
    height: 65,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.md,
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
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    marginTop: Spacing.xs,
  },

  subjectDetail: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    marginTop: Spacing.xs,
  },

  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  editButton: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
  },

  editText: {
    color: Colors.primary,
    fontSize: Typography.caption,
    fontWeight: Typography.semibold,
  },

  deleteButton: {
    backgroundColor: Colors.dangerLight,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
  },

  deleteText: {
    color: Colors.danger,
    fontSize: Typography.caption,
    fontWeight: Typography.semibold,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xxxl,
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },

  emptyIcon: {
    fontSize: 36,
    marginBottom: Spacing.md,
  },

  emptyTitle: {
    color: Colors.text,
    fontSize: Typography.subtitle,
    fontWeight: Typography.bold,
  },

  emptyDescription: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    textAlign: "center",
    marginTop: Spacing.sm,
  },

  addButton: {
    width: "100%",
    marginVertical: Spacing.md,
  },
});
