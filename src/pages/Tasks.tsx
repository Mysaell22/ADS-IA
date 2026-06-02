"use client";

import { TaskList } from "@/components/TaskList";

const Tasks = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto py-8">
        <TaskList />
      </div>
    </div>
  );
};

export default Tasks;