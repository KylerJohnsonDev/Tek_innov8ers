import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectById, getAllTaskStatuses } from "@/lib/services";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import { EditProjectDialog } from "@/components/edit-project-dialog";
import { TaskFilter } from "@/components/task-filter";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Proxy handles auth redirect, so session should exist
  if (!session) {
    return null;
  }

  const { id } = await params;
  const [project, taskStatuses] = await Promise.all([
    getProjectById(id),
    getAllTaskStatuses()
  ]);

  if (!project) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-3xl">{project.title}</CardTitle>
                <CardDescription className="text-base">
                  {project.description || "No description provided"}
                </CardDescription>
              </div>
              <EditProjectDialog project={project} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Created {formatDate(project.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Last updated {formatDate(project.updatedAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Tasks</h2>
            <CreateTaskDialog projectId={project.id} taskStatuses={taskStatuses} />
          </div>

          <TaskFilter tasks={project.tasks} taskStatuses={taskStatuses} />
        </div>
      </div>
    </div>
  );
}
