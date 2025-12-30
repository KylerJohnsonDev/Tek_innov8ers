"use client";

import { useState } from "react";
import { TaskStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTaskAction } from "@/app/actions";
import { Plus } from "lucide-react";

interface CreateTaskDialogProps {
  projectId: string;
  taskStatuses: TaskStatus[];
}

export function CreateTaskDialog({ projectId, taskStatuses }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const defaultStatus = taskStatuses.find(s => s.name === "Incomplete");
  const [status, setStatus] = useState(defaultStatus?.id || taskStatuses[0]?.id || "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("projectId", projectId);
    formData.append("status", status);

    try {
      await createTaskAction(formData);
      setOpen(false);
      setStatus(defaultStatus?.id || taskStatuses[0]?.id || "");
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to this project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="font-medium">
                Title
              </label>
              <Input
                id="title"
                name="title"
                placeholder="Task title"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Task description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="status" className="font-medium">
                Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {taskStatuses.map((taskStatus) => (
                    <SelectItem key={taskStatus.id} value={taskStatus.id}>
                      {taskStatus.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
