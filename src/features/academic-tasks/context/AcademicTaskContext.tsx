import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import {
  AcademicTask,
  TaskStatus,
} from "../types/academic-task.types";

type NewAcademicTask = Omit<AcademicTask, "id" | "createdAt">;

type AcademicTaskContextType = {
  tasks: AcademicTask[];
  addTask: (task: NewAcademicTask) => void;
  updateTask: (id: string, updatedTask: NewAcademicTask) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
};

const AcademicTaskContext = createContext<
  AcademicTaskContextType | undefined
>(undefined);

export const AcademicTaskProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [tasks, setTasks] = useState<AcademicTask[]>([]);

  const addTask = (task: NewAcademicTask) => {
    const newTask: AcademicTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setTasks((previousTasks) => [...previousTasks, newTask]);
  };

  const updateTask = (
    id: string,
    updatedTask: NewAcademicTask
  ) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, ...updatedTask }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  };

  const updateTaskStatus = (
    id: string,
    status: TaskStatus
  ) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, status }
          : task
      )
    );
  };

  return (
    <AcademicTaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
      }}
    >
      {children}
    </AcademicTaskContext.Provider>
  );
};

export const useAcademicTasks = () => {
  const context = useContext(AcademicTaskContext);

  if (!context) {
    throw new Error(
      "useAcademicTasks must be used inside AcademicTaskProvider"
    );
  }

  return context;
};