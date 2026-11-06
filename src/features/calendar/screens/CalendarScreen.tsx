
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import ScreenContainer from "../../../components/layout/ScreenContainer";
import AppHeader from "../../../components/layout/appheader";
import AppCard from "../../../components/common/appcard";

import { Colors, Spacing, Typography } from "../../../theme";

type CalendarEvent = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
};

type CalendarScreenProps = {
  onBack?: () => void;
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const initialEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Prepare Lesson Plan",
    category: "Academic Task",
    date: "2026-11-10",
    time: "09:00 AM",
  },
  {
    id: "2",
    title: "Create Presentation Slides",
    category: "Academic Task",
    date: "2026-11-12",
    time: "10:00 AM",
  },
  {
    id: "3",
    title: "Submit Class Report",
    category: "Deadline",
    date: "2026-11-15",
    time: "04:00 PM",
  },
  {
    id: "4",
    title: "IT313 Mobile Programming",
    category: "Class Schedule",
    date: "2026-11-09",
    time: "08:00 AM",
  },
];

const CalendarScreen = ({ onBack }: CalendarScreenProps) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1));

  const [selectedDate, setSelectedDate] = useState(
    "2026-11-06"
  );

  const [events] = useState<CalendarEvent[]>(initialEvents);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("en-US", {
    month: "long",
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  const formatDate = (day: number) => {
    const formattedMonth = String(month + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");

    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const selectedEvents = events.filter(
    (event) => event.date === selectedDate
  );

  const upcomingEvents = events
    .filter((event) => event.date >= selectedDate)
    .sort((a, b) => a.date.localeCompare(b.date));

  const changeMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
    setSelectedDate(
      `${year + (month + direction < 0 ? -1 : month + direction > 11 ? 1 : 0)}-${String((month + direction + 12) % 12 + 1).padStart(2, "0")}-01`
    );
  };

  const getEventColor = (category: string) => {
    switch (category) {
      case "Class Schedule":
        return Colors.primary;
      case "Deadline":
        return Colors.danger;
      default:
        return Colors.warning;
    }
  };

  return (
    <ScreenContainer>
      <AppHeader title="Calendar" />

      {onBack && (
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      )}

      <View style={styles.heading}>
        <Text style={styles.headingTitle}>
          Academic Calendar
        </Text>
        <Text style={styles.subtitle}>
          Manage your classes, deadlines, and reminders.
        </Text>
      </View>

      <AppCard>
        <View style={styles.monthHeader}>
          <TouchableOpacity
            onPress={() => changeMonth(-1)}
            style={styles.monthArrow}
          >
            <Text style={styles.arrowText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.monthTitle}>
            {monthName} {year}
          </Text>

          <TouchableOpacity
            onPress={() => changeMonth(1)}
            style={styles.monthArrow}
          >
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.calendarGrid}>
          {weekDays.map((day) => (
            <View key={day} style={styles.weekDay}>
              <Text style={styles.weekDayText}>{day}</Text>
            </View>
          ))}

          {calendarDays.map((day, index) => {
            if (day === null) {
              return (
                <View
                  key={`empty-${index}`}
                  style={styles.dayCell}
                />
              );
            }

            const dateString = formatDate(day);

            const hasEvent = events.some(
              (event) => event.date === dateString
            );

            const isSelected = selectedDate === dateString;

            return (
              <TouchableOpacity
                key={dateString}
                style={styles.dayCell}
                onPress={() => setSelectedDate(dateString)}
              >
                <View
                  style={[
                    styles.dayCircle,
                    isSelected && styles.selectedDay,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.selectedDayText,
                    ]}
                  >
                    {day}
                  </Text>
                </View>

                {hasEvent && (
                  <View
                    style={[
                      styles.eventDot,
                      {
                        backgroundColor: isSelected
                          ? "#FFFFFF"
                          : Colors.primary,
                      },
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
            <Text style={styles.legendText}>Activities</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.danger }]} />
            <Text style={styles.legendText}>Deadlines</Text>
          </View>
        </View>
      </AppCard>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Activities for {selectedDate}
        </Text>
        <Text style={styles.countText}>
          {selectedEvents.length} activities
        </Text>
      </View>

      {selectedEvents.length > 0 ? (
        selectedEvents.map((event) => (
          <AppCard key={event.id}>
            <View style={styles.eventRow}>
              <View
                style={[
                  styles.eventIndicator,
                  { backgroundColor: getEventColor(event.category) },
                ]}
              />

              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>
                  {event.title}
                </Text>
                <Text style={styles.eventCategory}>
                  {event.category}
                </Text>
                <Text style={styles.eventTime}>
                  {event.time}
                </Text>
              </View>
            </View>
          </AppCard>
        ))
      ) : (
        <AppCard>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No activities scheduled
            </Text>
            <Text style={styles.subtitle}>
              You have no activities for this date.
            </Text>
          </View>
        </AppCard>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Upcoming Reminders
        </Text>
      </View>

      <FlatList
        data={upcomingEvents.slice(0, 3)}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <AppCard>
            <View style={styles.reminderRow}>
              <View style={styles.reminderInfo}>
                <Text style={styles.eventTitle}>
                  {item.title}
                </Text>
                <Text style={styles.eventCategory}>
                  {item.category}
                </Text>
                <Text style={styles.eventTime}>
                  {item.date} • {item.time}
                </Text>
              </View>

              <View
                style={[
                  styles.reminderDot,
                  { backgroundColor: getEventColor(item.category) },
                ]}
              />
            </View>
          </AppCard>
        )}
        ListEmptyComponent={
          <Text style={styles.subtitle}>
            No upcoming reminders.
          </Text>
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

  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },

  monthTitle: {
    fontSize: Typography.subtitle,
    fontWeight: "700",
    color: Colors.text,
  },

  monthArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  arrowText: {
    fontSize: 26,
    color: Colors.primary,
    lineHeight: 30,
  },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  weekDay: {
    width: "14.2857%",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },

  weekDayText: {
    fontSize: Typography.caption,
    fontWeight: "700",
    color: Colors.textSecondary,
  },

  dayCell: {
    width: "14.2857%",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedDay: {
    backgroundColor: Colors.primary,
  },

  dayText: {
    fontSize: Typography.body,
    color: Colors.text,
  },

  selectedDayText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 1,
  },

  legend: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginTop: Spacing.lg,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  legendText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },

  sectionTitle: {
    fontSize: Typography.subtitle,
    fontWeight: "700",
    color: Colors.text,
  },

  countText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },

  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },

  eventIndicator: {
    width: 5,
    height: 48,
    borderRadius: 5,
  },

  eventInfo: {
    flex: 1,
  },

  eventTitle: {
    fontSize: Typography.body,
    fontWeight: "700",
    color: Colors.text,
  },

  eventCategory: {
    fontSize: Typography.caption,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },

  eventTime: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },

  emptyContainer: {
    alignItems: "center",
    padding: Spacing.lg,
  },

  emptyTitle: {
    fontSize: Typography.body,
    fontWeight: "700",
    color: Colors.text,
  },

  reminderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  reminderInfo: {
    flex: 1,
  },

  reminderDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default CalendarScreen;
