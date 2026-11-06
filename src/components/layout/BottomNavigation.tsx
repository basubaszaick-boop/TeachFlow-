
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Colors, Spacing, Typography } from "../../theme";

type TabName =
  | "Home"
  | "Schedule"
  | "Preparation"
  | "Tasks"
  | "Profile";

type BottomNavigationProps = {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
};

const tabs: {
  name: TabName;
  icon: string;
}[] = [
  { name: "Home", icon: "🏠" },
  { name: "Schedule", icon: "📅" },
  { name: "Preparation", icon: "📚" },
  { name: "Tasks", icon: "📝" },
  { name: "Profile", icon: "👤" },
];

export default function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => onTabChange(tab.name)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>
              {tab.icon}
            </Text>

            <Text
              style={[
                styles.label,
                isActive && styles.activeLabel,
              ]}
            >
              {tab.name}
            </Text>

            {isActive && (
              <View style={styles.activeIndicator} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xs,
  },
  icon: {
    fontSize: 20,
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  activeLabel: {
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  activeIndicator: {
    width: 20,
    height: 3,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: Spacing.xs,
  },
});