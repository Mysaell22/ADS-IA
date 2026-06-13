import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabase';
import { Button, Input, List, Card } from 'shadcn/ui';
import { showSuccess, showError } from '@/utils/toast';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from('tasks').select('*');
      if (error) showError('Failed to load tasks');
      setTasks(data);
    };
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    const { error } = await supabase.from('tasks').insert({ task: newTask });
    if (error) showError('Failed to add task');
    else {
      setTasks([...tasks, { id: Date.now(), task: newTask }]);
      setNewTask('');
      showSuccess('Task added');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setEditText(task.task);
  };

  const handleUpdate = async () => {
    if (!editText.trim()) return;
    const { error } = await supabase.from('tasks').update({ task: editText }).eq('id', editingTask.id);
    if (error) showError('Failed to update task');
    else {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, task: editText } : t));
      setEditingTask(null);
      setEditText('');
      showSuccess('Task updated');
    }
  };

  const handleDelete = async (taskId) => {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) showError('Failed to delete task');
    else {
      setTasks(tasks.filter(t => t.id !== taskId));
      showSuccess('Task deleted');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task List</h1>
      
      <form className="mb-6">
        <Input 
          type="text" 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="New task"
          className="w-full mb-2"
        />
        <Button 
          onClick={handleAddTask} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Task
        </Button>
      </form>

      {editingTask ? (
        <form className="mb-6">
          <Input 
            type="text" 
            value={editText} 
            onChange={(e) => setEditText(e.target.value)} 
            placeholder="Edit task"
            className="w-full mb-2"
          />
          <Button 
            onClick={handleUpdate} 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Update
          </Button>
          <Button 
            onClick={() => { setEditingTask(null); setEditText(''); }} 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded ml-2"
          >
            Cancel
          </Button>
        </form>
      ) : null}

      <List className="space-y-4">
        {tasks.map(task => (
          <Card key={task.id} className="p-3 border rounded">
            <p className="text-lg font-medium">{task.task}</p>
            <div className="flex items-center justify-end">
              <Button 
                onClick={() => handleEdit(task)} 
                className="bg-yellow-600 hover:bg-yellow-700 text-black px-3 py-1 rounded"
              >
                Edit
              </Button>
              <Button 
                onClick={() => handleDelete(task.id)} 
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded ml-2"
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </List>
    </div>
  );
};

export default HomePage;