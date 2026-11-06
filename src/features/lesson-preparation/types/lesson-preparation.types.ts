
export type PreparationStatus =
  | "Not Started"
  | "In Progress"
  | "Completed";

export type LessonPreparation = {
  id: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  topic: string;
  teachingDate: string;
  preparationDeadline: string;
  notes: string;
  status: PreparationStatus;
  createdAt: string;
};
