
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import {
  Colors,
  Spacing,
  Typography,
} from "../../../theme";

import ScreenContainer from "../../../components/layout/ScreenContainer";
import AppHeader from "../../../components/layout/appheader";
import AppCard from "../../../components/common/appcard";
import StatusBadge from "../../../components/common/statusbadge";

type DashboardScreenProps = {
  onOpenSubjects: () => void;
  onOpenSchedule: () => void;
  onOpenCalendar: () => void;
};

export default function DashboardScreen({
  onOpenSubjects,
  onOpenSchedule,
  onOpenCalendar,
}: DashboardScreenProps) {
  const currentHour = new Date().getHours();

  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
      ? "Good afternoon"
      : "Good evening";

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <ScreenContainer>
      <AppHeader
        title="Dashboard"
        subtitle="Your teaching overview"
      />

      <View style={styles.welcomeSection}>
        <Text style={styles.greeting}>
          {greeting}, Instructor!
        </Text>

        <Text style={styles.welcomeText}>
          Here's your teaching workload for today.
        </Text>

        <Text style={styles.dateText}>
          {currentDate}
        </Text>
      </View>

      {/* DASHBOARD QUICK ACCESS */}

      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={0.7}
          onPress={onOpenSubjects}
        >
          <AppCard style={styles.statCard}>
            <Text style={styles.statIcon}>📚</Text>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>My Subjects</Text>
          </AppCard>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={0.7}
          onPress={onOpenSchedule}
        >
          <AppCard style={styles.statCard}>
            <Text style={styles.statIcon}>📅</Text>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Today's Classes</Text>
          </AppCard>
        </TouchableOpacity>
      </View>

      {/* CALENDAR AND DEADLINES */}

      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={0.7}
          onPress={onOpenCalendar}
        >
          <AppCard style={styles.statCard}>
            <Text style={styles.statIcon}>🗓️</Text>
            <Text style={styles.calendarNumber}>Calendar</Text>
            <Text style={styles.statLabel}>
              Activities and Reminders
            </Text>
          </AppCard>
        </TouchableOpacity>

        <AppCard style={styles.statCard}>
          <Text style={styles.statIcon}>⏰</Text>
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>
            Upcoming Deadlines
          </Text>
        </AppCard>
      </View>

      {/* WORKLOAD PROGRESS */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Workload Progress
        </Text>

        <AppCard>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.itemTitle}>
                Lesson Preparation
              </Text>

              <Text style={styles.itemSubtitle}>
                Your overall preparation progress
              </Text>
            </View>

            <Text style={styles.progressPercentage}>
              65%
            </Text>
          </View>

          <View style={styles.progressBackground}>
            <View style={styles.progressFill} />
          </View>

          <Text style={styles.progressCaption}>
            13 of 20 lessons prepared
          </Text>
        </AppCard>
      </View>

      {/* PREPARATION BREAKDOWN */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Preparation Breakdown
        </Text>

        <View style={styles.breakdownContainer}>
          <AppCard style={styles.breakdownCard}>
            <Text style={styles.breakdownNumber}>8</Text>
            <Text style={styles.breakdownLabel}>
              Completed
            </Text>
          </AppCard>

          <AppCard style={styles.breakdownCard}>
            <Text style={styles.breakdownNumber}>5</Text>
            <Text style={styles.breakdownLabel}>
              In Progress
            </Text>
          </AppCard>

          <AppCard style={styles.breakdownCard}>
            <Text style={styles.breakdownNumber}>7</Text>
            <Text style={styles.breakdownLabel}>
              Not Started
            </Text>
          </AppCard>
        </View>
      </View>

      {/* TODAY'S SCHEDULE */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Today's Schedule
        </Text>

        <AppCard>
          <View style={styles.cardRow}>
            <View>
              <Text style={styles.itemTitle}>
                Mobile Programming
              </Text>

              <Text style={styles.itemSubtitle}>
                8:00 AM - 10:00 AM
              </Text>

              <Text style={styles.itemSubtitle}>
                Room 204
              </Text>
            </View>

            <StatusBadge status="In Progress" />
          </View>
        </AppCard>

        <AppCard>
          <View style={styles.cardRow}>
            <View>
              <Text style={styles.itemTitle}>
                Systems Integration
              </Text>

              <Text style={styles.itemSubtitle}>
                1:00 PM - 3:00 PM
              </Text>

              <Text style={styles.itemSubtitle}>
                Room 305
              </Text>
            </View>

            <StatusBadge status="Upcoming" />
          </View>
        </AppCard>
      </View>

      {/* LESSON PREPARATION */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Lesson Preparation
        </Text>

        <AppCard>
          <View style={styles.cardRow}>
            <Text style={styles.itemTitle}>
              Database Management
            </Text>

            <StatusBadge status="Ready" />
          </View>

          <Text style={styles.itemSubtitle}>
            Topic: Database Normalization
          </Text>
        </AppCard>

        <AppCard>
          <View style={styles.cardRow}>
            <Text style={styles.itemTitle}>
              Mobile Programming
            </Text>

            <StatusBadge status="In Progress" />
          </View>

          <Text style={styles.itemSubtitle}>
            Topic: React Native Components
          </Text>
        </AppCard>
      </View>

      {/* UPCOMING DEADLINES */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Upcoming Deadlines
        </Text>

        <AppCard>
          <View style={styles.deadlineHeader}>
            <View style={styles.deadlineInfo}>
              <Text style={styles.itemTitle}>
                Lesson Plan Submission
              </Text>

              <Text style={styles.itemSubtitle}>
                Mobile Programming
              </Text>

              <Text style={styles.deadlineDate}>
                Due: November 5, 2026
              </Text>
            </View>

            <StatusBadge status="High" />
          </View>
        </AppCard>

        <AppCard>
          <View style={styles.deadlineHeader}>
            <View style={styles.deadlineInfo}>
              <Text style={styles.itemTitle}>
                Instructional Materials
              </Text>

              <Text style={styles.itemSubtitle}>
                Systems Integration
              </Text>

              <Text style={styles.deadlineDate}>
                Due: November 8, 2026
              </Text>
            </View>

            <StatusBadge status="Medium" />
          </View>
        </AppCard>

        <AppCard>
          <View style={styles.deadlineHeader}>
            <View style={styles.deadlineInfo}>
              <Text style={styles.itemTitle}>
                Quarterly Report
              </Text>

              <Text style={styles.itemSubtitle}>
                Database Management
              </Text>

              <Text style={styles.deadlineDate}>
                Due: November 12, 2026
              </Text>
            </View>

            <StatusBadge status="Low" />
          </View>
        </AppCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  deadlineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.sm,
  },

  deadlineInfo: {
    flex: 1,
  },

  deadlineDate: {
    fontSize: Typography.caption,
    color: Colors.primary,
    marginTop: Spacing.sm,
    fontWeight: Typography.medium,
  },

  breakdownContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },

  breakdownCard: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: Spacing.xs,
  },

  breakdownNumber: {
    fontSize: Typography.title,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },

  breakdownLabel: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.xs,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },

  progressPercentage: {
    fontSize: Typography.title,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },

  progressBackground: {
    height: 10,
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    width: "65%",
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },

  progressCaption: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },

  welcomeSection: {
    marginBottom: Spacing.xl,
  },

  dateText: {
    fontSize: Typography.caption,
    color: Colors.primary,
    fontWeight: Typography.semibold,
    marginTop: Spacing.md,
  },

  greeting: {
    fontSize: Typography.title,
    fontWeight: Typography.bold,
    color: Colors.text,
  },

  welcomeText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },

  statsContainer: {
    flexDirection: "row",
    gap: Spacing.md,
  },

  statCard: {
    flex: 1,
    alignItems: "flex-start",
  },

  statIcon: {
    fontSize: 24,
    marginBottom: Spacing.sm,
  },

  statNumber: {
    fontSize: Typography.heading,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },

  calendarNumber: {
    fontSize: Typography.subtitle,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },

  statLabel: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },

  section: {
    marginTop: Spacing.lg,
  },

  sectionTitle: {
    fontSize: Typography.subtitle,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.sm,
  },

  itemTitle: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: Colors.text,
  },

  itemSubtitle: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
