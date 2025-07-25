import React, { useState, useEffect } from "react";
import TaskItem from "@/components/molecules/TaskItem";
import AddTaskForm from "@/components/molecules/AddTaskForm";
import SearchBar from "@/components/molecules/SearchBar";
import FilterButtons from "@/components/molecules/FilterButtons";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import { toast } from "react-toastify";
import { isToday, isPast } from "date-fns";

const TaskList = ({ 
  activeCategory, 
  onTaskCountChange, 
  sidebarOpen, 
  onToggleSidebar 
}) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    updateTaskCounts();
  }, [tasks, categories]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load tasks");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskCounts = () => {
    const counts = {};
    categories.forEach(category => {
      const categoryTasks = tasks.filter(task => 
        task.categoryId === category.Id.toString() && !task.completed
      );
      counts[category.Id] = categoryTasks.length;
    });
    onTaskCountChange(counts);
  };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      toast.success("Task added successfully!");
    } catch (err) {
      toast.error("Failed to add task");
      console.error("Error adding task:", err);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      });
      
      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
      
      if (updatedTask.completed) {
        toast.success("Task completed! 🎉");
      }
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Error toggling task:", err);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
      toast.success("Task updated!");
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Error updating task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.Id !== taskId));
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", err);
    }
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    // Filter by category
    if (activeCategory && activeCategory !== "all") {
      filtered = filtered.filter(task => task.categoryId === activeCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    switch (activeFilter) {
      case "active":
        filtered = filtered.filter(task => !task.completed);
        break;
      case "completed":
        filtered = filtered.filter(task => task.completed);
        break;
      case "overdue":
        filtered = filtered.filter(task => 
          !task.completed && 
          task.dueDate && 
          isPast(new Date(task.dueDate)) && 
          !isToday(new Date(task.dueDate))
        );
        break;
      default:
        // "all" - no additional filtering
        break;
    }

    // Sort tasks
    return filtered.sort((a, b) => {
      // Completed tasks go to bottom
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      
      // Sort by priority (high > medium > low)
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Sort by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const getCurrentCategory = () => {
    return categories.find(cat => cat.Id.toString() === activeCategory);
  };

  const filteredTasks = getFilteredTasks();
  const currentCategory = getCurrentCategory();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 bg-surface px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentCategory ? currentCategory.name : "All Tasks"}
              </h2>
              <p className="text-gray-600">
                {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
          />
          <FilterButtons
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Add Task Form */}
        <AddTaskForm
          onAdd={handleAddTask}
          categories={categories}
          defaultCategory={activeCategory}
        />

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <Empty
            title={searchQuery ? "No tasks found" : "No tasks yet"}
            description={
              searchQuery 
                ? "Try adjusting your search or filters"
                : "Get started by adding your first task"
            }
            onAction={searchQuery ? () => setSearchQuery("") : () => {}}
            actionText={searchQuery ? "Clear Search" : "Add Task"}
            icon={searchQuery ? "Search" : "CheckSquare"}
          />
) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.Id}
                task={task}
                category={categories.find(cat => cat.Id.toString() === task.categoryId)}
                categories={categories}
                onToggle={handleToggleTask}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;