"use client";

import { useState } from "react";
import { TaskStatus } from "@prisma/client";
import { Task } from "@/lib/services";
import { TaskList } from "@/components/task-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskFilterProps {
  tasks: Task[];
  taskStatuses: TaskStatus[];
}

export function TaskFilter({ tasks, taskStatuses }: TaskFilterProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === "all") return true;
    return task.status.id === statusFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="font-medium">Filter by status:</label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            {taskStatuses.map((taskStatus) => (
              <SelectItem key={taskStatus.id} value={taskStatus.id}>
                {taskStatus.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <TaskList tasks={filteredTasks} />
    </div>
  );
}
