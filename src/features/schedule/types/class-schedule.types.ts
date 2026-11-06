
export type ClassDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type ClassSchedule = {
  id: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  section: string;
  day: ClassDay;
  startTime: string;
  endTime: string;
  room: string;
  createdAt: string;
};
