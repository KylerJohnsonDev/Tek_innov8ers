import { prismaClient } from "./db";
import { Prisma, TaskStatus } from "@prisma/client";
import { removeUndefinedProperties } from "./utils";

export async function searchProjects(userId: string, searchQuery: string): Promise<ProjectWithTaskCount[]> {
  // VULNERABLE CODE: prone to SQL injection
  // const sql = `
  //   SELECT id, title, description, createdAt, updatedAt, userId 
  //   FROM Project 
  //   WHERE userId = '${userId}' AND title LIKE '%${searchQuery}%'
  // `;
  // const results = await prismaClient.$queryRawUnsafe(sql);
  // return results as Project[];

  // SOLUTION 1: parameterized queries to prevent SQL injection
  // type QueryResult = Project & { tasks: bigint };
  
  // const safeResults = await prismaClient.$queryRaw<QueryResult[]>`
  //   SELECT 
  //     p.id, 
  //     p.title, 
  //     p.description, 
  //     p.createdAt, 
  //     p.updatedAt, 
  //     p.userId,
  //     COUNT(t.id) as tasks
  //   FROM Project p
  //   LEFT JOIN Task t ON p.id = t.projectId
  //   WHERE p.userId = ${userId} AND p.title LIKE ${`%${searchQuery}%`}
  //   GROUP BY p.id, p.title, p.description, p.createdAt, p.updatedAt, p.userId`;
  
  // return safeResults.map(project => ({
  //   id: project.id,
  //   title: project.title,
  //   description: project.description,
  //   createdAt: project.createdAt,
  //   updatedAt: project.updatedAt,
  //   userId: project.userId,
  //   _count: { tasks: Number(project.tasks) }
  // }));

  // SOLUTION 2: Using Prisma's ORM capabilities to avoid raw SQL
  const projects = await prismaClient.project.findMany({
    where: {
      userId,
      title: {
        contains: searchQuery,
      }
    },
    include: {
      _count: {
        select: { tasks: true }
      }
    }
  });
  return projects; 
  
}

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
  
  // Update parent project's updatedAt timestamp
  await prismaClient.project.update({
    where: { id: data.projectId },
    data: { updatedAt: new Date() }
  });
  
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
 
 // Update parent project's updatedAt timestamp
 await prismaClient.project.update({
   where: { id: updatedTask.projectId },
   data: { updatedAt: new Date() }
 });

 return updatedTask;
}

export async function deleteTask(taskId: string): Promise<void> {
  // Get task to access projectId before deleting
  const task = await prismaClient.task.findUnique({
    where: { id: taskId },
    select: { projectId: true }
  });
  
  if (!task) {
    throw new Error('Task not found');
  }
  
  await prismaClient.task.delete({
    where: { id: taskId }
  });
  
  // Update parent project's updatedAt timestamp
  await prismaClient.project.update({
    where: { id: task.projectId },
    data: { updatedAt: new Date() }
  });
}
