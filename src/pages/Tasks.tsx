"use client";

import { TaskList } from "@/components/TaskList";

const Tasks = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_44%,#f0fdf4_100%)]">
      <div className="container mx-auto py-8">
        <TaskList />
      </div>
    </div>
  );
};

export default Tasks;
