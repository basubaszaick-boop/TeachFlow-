
import React, {
  createContext,
  useContext,
  useState,
} from "react";

import {
  LessonPreparation,
} from "../types/lesson-preparation.types";

import {
  PreparationStatus,
} from "../types/lesson-preparation.types";

const INITIAL_PREPARATIONS: LessonPreparation[] = [
  {
    id: "1",
    subjectId: "1",
    subjectCode: "IT313",
    subjectName: "Mobile Programming",
    topic: "React Native Components",
    teachingDate: "2026-11-10",
    preparationDeadline: "2026-11-08",
    notes: "Prepare examples about View, Text, and Pressable.",
    status: "In Progress",
    createdAt: "2026-11-04",
  },
  {
    id: "2",
    subjectId: "2",
    subjectCode: "IT314",
    subjectName: "Web Development",
    topic: "Angular Components",
    teachingDate: "2026-11-12",
    preparationDeadline: "2026-11-10",
    notes: "Prepare discussion and practical activities.",
    status: "Not Started",
    createdAt: "2026-11-04",
  },
  {
    id: "3",
    subjectId: "3",
    subjectCode: "ITE104",
    subjectName: "Introduction to Computing",
    topic: "Computer Fundamentals",
    teachingDate: "2026-11-14",
    preparationDeadline: "2026-11-12",
    notes: "Review the lesson materials.",
    status: "Completed",
    createdAt: "2026-11-04",
  },
];

type FormPreparation = Omit<
  LessonPreparation,
  "id" | "createdAt"
>;

type LessonPreparationContextType = {
  preparations: LessonPreparation[];

  addPreparation: (
    preparation: FormPreparation
  ) => void;

  updatePreparation: (
    id: string,
    preparation: FormPreparation
  ) => void;

  deletePreparation: (id: string) => void;

  updateStatus: (
    id: string,
    status: PreparationStatus
  ) => void;
};

const LessonPreparationContext =
  createContext<
    LessonPreparationContextType | undefined
  >(undefined);

export function LessonPreparationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preparations, setPreparations] =
    useState<LessonPreparation[]>(INITIAL_PREPARATIONS);

  const addPreparation = (
    preparation: FormPreparation
  ) => {
    const newPreparation: LessonPreparation = {
      ...preparation,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setPreparations((previous) => [
      ...previous,
      newPreparation,
    ]);
  };

  const updatePreparation = (
    id: string,
    updatedData: FormPreparation
  ) => {
    setPreparations((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, ...updatedData }
          : item
      )
    );
  };

  const deletePreparation = (id: string) => {
    setPreparations((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  const updateStatus = (
    id: string,
    status: PreparationStatus
  ) => {
    setPreparations((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, status }
          : item
      )
    );
  };

  return (
    <LessonPreparationContext.Provider
      value={{
        preparations,
        addPreparation,
        updatePreparation,
        deletePreparation,
        updateStatus,
      }}
    >
      {children}
    </LessonPreparationContext.Provider>
  );
}

export function useLessonPreparation() {
  const context = useContext(
    LessonPreparationContext
  );

  if (!context) {
    throw new Error(
      "useLessonPreparation must be used inside LessonPreparationProvider."
    );
  }

  return context;
}
