
import React, { useState } from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import DashboardScreen from "./src/features/dashboard/screens/DashboardScreen";
import LoginScreen from "./src/features/authentication/screens/LoginScreen";
import RegisterScreen from "./src/features/authentication/screens/RegisterScreen";
import ForgotPasswordScreen from "./src/features/authentication/screens/ForgotPasswordScreen";

import SubjectsScreen from "./src/features/subjects/screens/SubjectsScreen";
import ScheduleScreen from "./src/features/schedule/screens/ScheduleScreen";
import LessonPreparationScreen from "./src/features/lesson-preparation/screens/LessonPreparationScreen";
import CalendarScreen from "./src/features/calendar/screens/CalendarScreen";

import AcademicTasksScreen from "./src/features/academic-tasks/screens/AcademicTasksScreen";
import AddAcademicTaskScreen from "./src/features/academic-tasks/screens/AddAcademicTaskScreen";
import EditAcademicTaskScreen from "./src/features/academic-tasks/screens/EditAcademicTaskScreen";
import ViewAcademicTaskScreen from "./src/features/academic-tasks/screens/ViewAcademicTaskScreen";

import ProfileScreen from "./src/features/profile/screens/ProfileScreen";

import { AcademicTask } from "./src/features/academic-tasks/types/academic-task.types";

import BottomNavigation from "./src/components/layout/BottomNavigation";

import {
  SubjectsProvider,
} from "./src/features/subjects/context/SubjectsContext";

import {
  LessonPreparationProvider,
} from "./src/features/lesson-preparation/context/LessonPreparationContext";

import {
  AcademicTaskProvider,
} from "./src/features/academic-tasks/context/AcademicTaskContext";

import { Colors } from "./src/theme";

type ScreenName =
  | "login"
  | "register"
  | "forgot"
  | "dashboard"
  | "subjects"
  | "schedule"
  | "preparation"
  | "calendar"
  | "tasks"
  | "addTask"
  | "viewTask"
  | "editTask"
  | "profile";

type TabName =
  | "Home"
  | "Schedule"
  | "Preparation"
  | "Tasks"
  | "Profile";

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<ScreenName>("login");

  const [activeTab, setActiveTab] =
    useState<TabName>("Home");

  const [selectedTask, setSelectedTask] =
    useState<AcademicTask | null>(null);

  const handleTabChange = (tab: TabName) => {
    setActiveTab(tab);

    switch (tab) {
      case "Home":
        setCurrentScreen("dashboard");
        break;

      case "Schedule":
        setCurrentScreen("schedule");
        break;

      case "Preparation":
        setCurrentScreen("preparation");
        break;

      case "Tasks":
        setCurrentScreen("tasks");
        break;

      case "Profile":
        setCurrentScreen("profile");
        break;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return (
          <LoginScreen
            onLogin={() => {
              setCurrentScreen("dashboard");
              setActiveTab("Home");
            }}
            onRegister={() => setCurrentScreen("register")}
            onForgotPassword={() => setCurrentScreen("forgot")}
          />
        );

      case "register":
        return (
          <RegisterScreen
            onRegisterSuccess={() => setCurrentScreen("login")}
            onLogin={() => setCurrentScreen("login")}
          />
        );

      case "forgot":
        return (
          <ForgotPasswordScreen
            onBackToLogin={() => setCurrentScreen("login")}
          />
        );

      case "dashboard":
        return (
          <DashboardScreen
            onOpenSubjects={() => setCurrentScreen("subjects")}
            onOpenSchedule={() => {
              setActiveTab("Schedule");
              setCurrentScreen("schedule");
            }}
            onOpenCalendar={() => {
              setCurrentScreen("calendar");
            }}
          />
        );

      case "subjects":
        return (
          <SubjectsScreen
            onBack={() => setCurrentScreen("dashboard")}
          />
        );

      case "schedule":
        return (
          <ScheduleScreen
            onBack={() => {
              setActiveTab("Home");
              setCurrentScreen("dashboard");
            }}
          />
        );

      case "preparation":
        return (
          <LessonPreparationScreen
            onBack={() => {
              setActiveTab("Home");
              setCurrentScreen("dashboard");
            }}
          />
        );

      case "calendar":
        return (
          <CalendarScreen
            onBack={() => {
              setActiveTab("Home");
              setCurrentScreen("dashboard");
            }}
          />
        );

      case "tasks":
        return (
          <AcademicTasksScreen
            onBack={() => {
              setActiveTab("Home");
              setCurrentScreen("dashboard");
            }}
            onAddTask={() => setCurrentScreen("addTask")}
            onViewTask={(task) => {
              setSelectedTask(task);
              setCurrentScreen("viewTask");
            }}
            onEditTask={(task) => {
              setSelectedTask(task);
              setCurrentScreen("editTask");
            }}
          />
        );

      case "addTask":
        return (
          <AddAcademicTaskScreen
            onBack={() => setCurrentScreen("tasks")}
          />
        );

      case "viewTask":
        return selectedTask ? (
          <ViewAcademicTaskScreen
            task={selectedTask}
            onBack={() => setCurrentScreen("tasks")}
            onEdit={() => setCurrentScreen("editTask")}
          />
        ) : null;

      case "editTask":
        return selectedTask ? (
          <EditAcademicTaskScreen
            task={selectedTask}
            onBack={() => setCurrentScreen("tasks")}
          />
        ) : null;

      case "profile":
        return (
          <ProfileScreen
            onLogout={() => {
              setCurrentScreen("login");
              setActiveTab("Home");
            }}
          />
        );

      default:
        return null;
    }
  };

  const showBottomNavigation =
    currentScreen === "dashboard" ||
    currentScreen === "schedule" ||
    currentScreen === "preparation" ||
    currentScreen === "tasks" ||
    currentScreen === "profile";

  return (
    <SubjectsProvider>
      <LessonPreparationProvider>
        <AcademicTaskProvider>
          <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.screen}>
              {renderScreen()}
            </View>

            {showBottomNavigation && (
              <BottomNavigation
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            )}
          </View>
        </AcademicTaskProvider>
      </LessonPreparationProvider>
    </SubjectsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  screen: {
    flex: 1,
  },
});
