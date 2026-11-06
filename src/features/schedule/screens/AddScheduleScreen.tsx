
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
import AppButton from "../../../components/common/appbutton";

import { useSubjects } from "../../subjects/context/SubjectsContext";
import {
  ClassDay,
  ClassSchedule,
} from "../types/class-schedule.types";

type AddScheduleScreenProps = {
  onSave: (
    schedule: Omit<ClassSchedule, "id" | "createdAt">
  ) => void;
  onCancel: () => void;
  existingSchedules?: ClassSchedule[];
  initialSchedule?: ClassSchedule;
};

const DAYS: ClassDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TIME_PATTERN = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;

function convertTimeToMinutes(time: string): number {
  const [clock, period] = time.split(" ");
  let [hours, minutes] = clock.split(":").map(Number);

  if (period.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

export default function AddScheduleScreen({
  onSave,
  onCancel,
  existingSchedules = [],
  initialSchedule,
}: AddScheduleScreenProps) {
  const { subjects } = useSubjects();

  const [selectedSubjectId, setSelectedSubjectId] =
  useState(initialSchedule?.subjectId ?? "");

const [selectedDay, setSelectedDay] =
  useState<ClassDay | null>(
    initialSchedule?.day ?? null
  );

const [startTime, setStartTime] =
  useState(initialSchedule?.startTime ?? "");

const [endTime, setEndTime] =
  useState(initialSchedule?.endTime ?? "");

const [room, setRoom] =
  useState(initialSchedule?.room ?? "");

const [errors, setErrors] = useState<{
  subject?: string;
  day?: string;
  startTime?: string;
  endTime?: string;
  room?: string;
}>({});

  const handleSave = () => {
    const newErrors: typeof errors = {};

    if (!selectedSubjectId) {
      newErrors.subject = "Please select a subject.";
    }

    if (!selectedDay) {
      newErrors.day = "Please select a class day.";
    }

    const formattedStart = startTime.trim().toUpperCase();
    const formattedEnd = endTime.trim().toUpperCase();

    if (!TIME_PATTERN.test(formattedStart)) {
      newErrors.startTime = "Use format 08:00 AM.";
    }

    if (!TIME_PATTERN.test(formattedEnd)) {
      newErrors.endTime = "Use format 10:00 AM.";
    }

    if (
      TIME_PATTERN.test(formattedStart) &&
      TIME_PATTERN.test(formattedEnd)
    ) {
      const startMinutes =
        convertTimeToMinutes(formattedStart);

      const endMinutes =
        convertTimeToMinutes(formattedEnd);

      if (endMinutes <= startMinutes) {
        newErrors.endTime =
          "End time must be later than start time.";
      }
    }

    if (!room.trim()) {
      newErrors.room = "Please enter a room.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const selectedSubject = subjects.find(
      (subject) => subject.id === selectedSubjectId
    );

    if (!selectedSubject || !selectedDay) {
      Alert.alert(
        "Invalid Selection",
        "Please select an existing subject and class day."
      );
      return;
    }

    const newStart = convertTimeToMinutes(formattedStart);
    const newEnd = convertTimeToMinutes(formattedEnd);

    const hasConflict = existingSchedules.some((schedule) => {
      if (schedule.day !== selectedDay) {
        return false;
      }

      const existingStart = convertTimeToMinutes(
        schedule.startTime
      );

      const existingEnd = convertTimeToMinutes(
        schedule.endTime
      );

      return (
        newStart < existingEnd &&
        newEnd > existingStart
      );
    });

    if (hasConflict) {
      Alert.alert(
        "Schedule Conflict",
        "This time overlaps with another class schedule. Please choose a different time."
      );
      return;
    }

    onSave({
      subjectId: selectedSubject.id,
      subjectCode: selectedSubject.subjectCode,
      subjectName: selectedSubject.subjectName,
      section: selectedSubject.section,
      day: selectedDay,
      startTime: formattedStart,
      endTime: formattedEnd,
      room: room.trim(),
    });
  };

  return (
    <ScreenContainer scrollable={false} padding={0}>
      <AppHeader
        title="Add Class Schedule"
        subtitle="Create a new teaching schedule"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.sectionTitle}>
          Select Subject
        </Text>

        {subjects.length > 0 ? (
          subjects.map((subject) => {
            const isSelected =
              selectedSubjectId === subject.id;

            return (
              <TouchableOpacity
                key={subject.id}
                activeOpacity={0.8}
                style={[
                  styles.subjectOption,
                  isSelected && styles.selectedSubject,
                ]}
                onPress={() => {
                  setSelectedSubjectId(subject.id);
                  setErrors((previous) => ({
                    ...previous,
                    subject: undefined,
                  }));
                }}
              >
                <View style={styles.subjectInfo}>
                  <Text style={styles.subjectCode}>
                    {subject.subjectCode}
                  </Text>

                  <Text style={styles.subjectName}>
                    {subject.subjectName}
                  </Text>

                  <Text style={styles.subjectSection}>
                    {subject.section}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radio,
                    isSelected && styles.radioSelected,
                  ]}
                >
                  {isSelected && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptySubjects}>
            <Text style={styles.emptyText}>
              No subjects available.
            </Text>

            <Text style={styles.emptySubtext}>
              Please add a subject before creating a class schedule.
            </Text>
          </View>
        )}

        {errors.subject && (
          <Text style={styles.errorText}>
            {errors.subject}
          </Text>
        )}

        <Text style={styles.sectionTitle}>
          Select Class Day
        </Text>

        <View style={styles.daysContainer}>
          {DAYS.map((day) => {
            const isSelected = selectedDay === day;

            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  isSelected && styles.selectedDayButton,
                ]}
                onPress={() => {
                  setSelectedDay(day);
                  setErrors((previous) => ({
                    ...previous,
                    day: undefined,
                  }));
                }}
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
        </View>

        {errors.day && (
          <Text style={styles.errorText}>
            {errors.day}
          </Text>
        )}

        <Text style={styles.sectionTitle}>
          Class Time
        </Text>

        <Text style={styles.inputLabel}>
          Start Time
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Example: 08:00 AM"
          placeholderTextColor={Colors.textSecondary}
          value={startTime}
          onChangeText={(value) => {
            setStartTime(value);
            setErrors((previous) => ({
              ...previous,
              startTime: undefined,
            }));
          }}
          autoCapitalize="characters"
        />

        {errors.startTime && (
          <Text style={styles.errorText}>
            {errors.startTime}
          </Text>
        )}

        <Text style={styles.inputLabel}>
          End Time
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Example: 10:00 AM"
          placeholderTextColor={Colors.textSecondary}
          value={endTime}
          onChangeText={(value) => {
            setEndTime(value);
            setErrors((previous) => ({
              ...previous,
              endTime: undefined,
            }));
          }}
          autoCapitalize="characters"
        />

        {errors.endTime && (
          <Text style={styles.errorText}>
            {errors.endTime}
          </Text>
        )}

        <Text style={styles.sectionTitle}>
          Classroom Information
        </Text>

        <Text style={styles.inputLabel}>
          Room / Classroom
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Example: Room 204"
          placeholderTextColor={Colors.textSecondary}
          value={room}
          onChangeText={(value) => {
            setRoom(value);
            setErrors((previous) => ({
              ...previous,
              room: undefined,
            }));
          }}
        />

        {errors.room && (
          <Text style={styles.errorText}>
            {errors.room}
          </Text>
        )}

        <View style={styles.buttonContainer}>
          <AppButton
            title="Save Class Schedule"
            onPress={handleSave}
            style={styles.saveButton}
          />

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
          >
            <Text style={styles.cancelText}>
              Cancel
            </Text>
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
  sectionTitle: {
    color: Colors.text,
    fontSize: Typography.subtitle,
    fontWeight: Typography.bold,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  subjectOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  selectedSubject: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
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
  subjectSection: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    marginTop: Spacing.xs,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.md,
  },
  radioSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  emptySubjects: {
    padding: Spacing.lg,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.text,
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
  },
  emptySubtext: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  dayButton: {
    width: 68,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedDayButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayText: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    fontWeight: Typography.semibold,
  },
  selectedDayText: {
    color: "#FFFFFF",
  },
  inputLabel: {
    color: Colors.text,
    fontSize: Typography.body,
    fontWeight: Typography.medium,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    color: Colors.text,
    fontSize: Typography.body,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: Colors.danger,
    fontSize: Typography.caption,
    marginBottom: Spacing.sm,
  },
  buttonContainer: {
    marginTop: Spacing.xl,
  },
  saveButton: {
    width: "100%",
  },
  cancelButton: {
    alignItems: "center",
    padding: Spacing.lg,
    marginTop: Spacing.sm,
  },
  cancelText: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
  },
});