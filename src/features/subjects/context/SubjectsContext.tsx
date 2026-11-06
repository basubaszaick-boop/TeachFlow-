
import React, {
  createContext,
  useContext,
  useState,
} from "react";

import { Subject } from "../types/subject.types";

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

type SubjectsContextType = {
  subjects: Subject[];
  addSubject: (
    subject: Omit<Subject, "id" | "createdAt">
  ) => void;
  updateSubject: (
    id: string,
    subject: Omit<Subject, "id" | "createdAt">
  ) => void;
  deleteSubject: (id: string) => void;
};

const SubjectsContext = createContext<
  SubjectsContextType | undefined
>(undefined);

export function SubjectsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [subjects, setSubjects] =
    useState<Subject[]>(INITIAL_SUBJECTS);

  const addSubject = (
    newSubject: Omit<Subject, "id" | "createdAt">
  ) => {
    const subject: Subject = {
      ...newSubject,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setSubjects((previous) => [
      ...previous,
      subject,
    ]);
  };

  const updateSubject = (
    id: string,
    updatedData: Omit<Subject, "id" | "createdAt">
  ) => {
    setSubjects((previous) =>
      previous.map((subject) =>
        subject.id === id
          ? { ...subject, ...updatedData }
          : subject
      )
    );
  };

  const deleteSubject = (id: string) => {
    setSubjects((previous) =>
      previous.filter((subject) => subject.id !== id)
    );
  };

  return (
    <SubjectsContext.Provider
      value={{
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
      }}
    >
      {children}
    </SubjectsContext.Provider>
  );
}

export function useSubjects() {
  const context = useContext(SubjectsContext);

  if (!context) {
    throw new Error(
      "useSubjects must be used inside SubjectsProvider."
    );
  }

  return context;
}
