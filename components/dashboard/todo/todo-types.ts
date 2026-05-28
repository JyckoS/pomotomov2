export type TodoTask = {
  id: string;
  title: string;
  notes: string;
  parentId: string | null;
  color: string;
  iconName: string;
  deadline: Date;
  isFinished: boolean;
  updatedAt: Date;
  sortOrder: number;
};

export type TodoTaskApiRecord = {
  id: string;
  userId: string;
  parentId: string | null;
  title: string;
  notes: string | null;
  color: string;
  iconName: string;
  deadline: string;
  isFinished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type TodoTaskFormValues = {
  title: string;
  notes: string;
  parentId: string | null;
  color: string;
  iconName: string;
  deadlineDate: string;
  deadlineTime: string;
};

export type TodoTaskRow = {
  task: TodoTask;
  depth: number;
};

export type TodoTaskGroup = {
  passedTime: TodoTask[];
  todayTasks: TodoTask[];
  tomorrowTasks: TodoTask[];
  upcomingTasks: TodoTask[];
  completedTasks: TodoTask[];
};
