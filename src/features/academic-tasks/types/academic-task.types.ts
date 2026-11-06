export type TaskCategory =
  | "Lesson Plan"
  | "Instructional Materials"
  | "Reports"
  | "Syllabus";

export type TaskPriority = "Low" | "Medium" | "High";

export type TaskStatus = "Pending" | "In Progress" | "Completed";

export type AcademicTask = {
  id: string;
  title: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  category: TaskCategory;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  description: string;
  createdAt: string;
};
