"use server";

import {
  getAllProjects,
  createProject,
  deleteProject,
  createTask,
  updateTask,
  deleteTask,
  updateProject,
  getAllTaskStatuses,
} from "@/lib/services";
import { revalidatePath } from "next/cache";

export async function getProjectsAction(userId: string) {
  return await getAllProjects(userId);
}

export async function getTaskStatusesAction() {
  return await getAllTaskStatuses();
}

export async function createProjectAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const userId = formData.get("userId") as string;

  if (!title || !userId) {
    throw new Error("Title and userId are required");
  }

  const project = await createProject({
    title,
    description: description || undefined,
    userId,
  });

  revalidatePath("/");
  return project;
}

export async function updateProjectAction(projectId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  const project = await updateProject(projectId, {
    title: title || undefined,
    description: description || undefined,
  });

  revalidatePath("/");
  revalidatePath(`/projects/${projectId}`);
  return project;
}

export async function deleteProjectAction(projectId: string) {
  await deleteProject(projectId);
  revalidatePath("/");
}

export async function createTaskAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const statusId = formData.get("status") as string;
  const projectId = formData.get("projectId") as string;

  if (!title || !projectId || !statusId) {
    throw new Error("Title, projectId, and statusId are required");
  }

  const task = await createTask({
    title,
    description: description || undefined,
    statusId,
    projectId,
  });

  revalidatePath(`/projects/${projectId}`);
  return task;
}

export async function updateTaskAction(taskId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const statusId = formData.get("status") as string;

  const task = await updateTask(taskId, {
    title: title || undefined,
    description: description || undefined,
    statusId: statusId || undefined,
  });

  revalidatePath(`/projects/${task.projectId}`);
  return task;
}

export async function deleteTaskAction(taskId: string, projectId: string) {
  await deleteTask(taskId);
  revalidatePath(`/projects/${projectId}`);
}
