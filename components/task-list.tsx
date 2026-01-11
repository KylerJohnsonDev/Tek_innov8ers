"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskWithStatus } from "@/lib/services";
import { EditTaskDialog } from "./edit-task-dialog";
import { Circle, CircleDot, CheckCircle2 } from "lucide-react";
import { sanitizeHtml } from "@/lib/utils";

interface TaskListProps {
  tasks: TaskWithStatus[];
}

export function TaskList({ tasks }: TaskListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Progress":
        return (
          <Badge>
            <CircleDot className="mr-1 h-3 w-3" />
            In Progress
          </Badge>
        );
      case "Incomplete":
        return (
          <Badge>
            <Circle className="mr-1 h-3 w-3" />
            Incomplete
          </Badge>
        );
      case "Done":
        return (
          <Badge>
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Done
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="py-8">
        No tasks yet. Add your first task to get started!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card key={task.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                  <CardTitle className="">{task.title}</CardTitle>
                  {task.description && (
                    <CardDescription className="">
                      <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(task.description) }} />
                    </CardDescription>
                  )}
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(task.status.name)}
                <EditTaskDialog task={task} />
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
