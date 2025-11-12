export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  id_user_creator: number;
  creator_name?: string;
  assigned_users?: AssignedUser[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AssignedUser {
  id: number;
  name: string;
  surname: string;
}

export enum TaskStatus {
  BACKLOG = 0,
  TODO = 1,
  DOING = 2,
  TESTING = 3,
  DONE = 4
}

export interface TaskColumn {
  name: string;
  status: TaskStatus;
  tasks: Task[];
}
