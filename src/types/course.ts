// Đường dẫn gợi ý: src/lib/types/course.type.ts

export interface Topic {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Schedule {
  dayOfWeek: string;
  startTime: string; // HH:MM:SS
  endTime: string; // HH:MM:SS
}

export interface Course {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  schedules: Schedule[];
  status: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  topicName: string;
  subjectName: string;
  coverImageUrl: string;
  userStatus?: string; // Có thể có hoặc không tùy API
  numberOfStudent?: number; // Có thể có hoặc không tùy API
}
