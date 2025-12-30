import { prismaClient } from "./db";
import { TaskStatus } from "@prisma/client";
import { removeUndefinedProperties } from "./utils";

export type Project = {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  statusId: string
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
};

export type ProjectWithTasks = Project & {
  tasks: Task[];
};

export type ProjectWithTaskCount = Project & {
  _count: {
    tasks: number;
  };
}

export type TaskWithStatus = Task & {
  status: TaskStatus;
}

// Task Status operations
export async function getAllTaskStatuses(): Promise<TaskStatus[]> {
  return await prismaClient.taskStatus.findMany({
    orderBy: { sortOrder: "asc" }
  });
}

// Project operations
export async function getAllProjects(userId: string): Promise<ProjectWithTaskCount[]> {
  const projects = await prismaClient.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      _count: {
        select: { tasks: true }
      }
    }
  })
  
  return projects;
}

export async function getProjectById(projectId: string) {
  const project = await prismaClient.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: {
        include: {
          status: true
        },
        orderBy: [
          { status: { sortOrder: 'asc' } },
          { createdAt: 'desc' }
        ]
      }
    }
  })
  
  return project;
}

export async function createProject(data: {
  title: string;
  description?: string;
  userId: string;
}): Promise<Project> {
  const newProject = await prismaClient.project.create({
    data
  })
  return newProject;
}

export async function updateProject(
  projectId: string,
  data: { title?: string; description?: string }
): Promise<Project> {
  const now = new Date().toISOString();

  const projectDataToUpdate = removeUndefinedProperties(data);
  
  const updatedProject = await prismaClient.project.update({
    where: { id: projectId },
    data: {
      ...projectDataToUpdate,
      updatedAt: new Date(now),
    }
  })
  return updatedProject;
}

export async function deleteProject(projectId: string): Promise<void> {
  await prismaClient.project.delete({
    where: { id: projectId }
  })
}

export async function createTask(data: {
  title: string;
  description?: string;
  statusId: string;
  projectId: string;
}): Promise<TaskWithStatus> {
  const newTask = await prismaClient.task.create({
    data,
    include: { status: true },
  })
  return newTask;
}

export async function updateTask(
  taskId: string,
  data: { title?: string; description?: string; statusId?: string }
): Promise<TaskWithStatus> {
  const now = new Date().toISOString();
  // remove undefined values
  const taskDataToUpdate = removeUndefinedProperties(data);

 const updatedTask = await prismaClient.task.update({
  where: { id: taskId },
  data: {
    ...taskDataToUpdate,
    updatedAt: new Date(now),
  },
  include: { status: true }
 })

 return updatedTask;
}

export async function deleteTask(taskId: string): Promise<void> {
  await prismaClient.task.delete({
    where: { id: taskId }
  });
}
