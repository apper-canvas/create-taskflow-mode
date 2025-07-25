import React, { useState } from "react";
import Sidebar from "@/components/organisms/Sidebar";
import TaskList from "@/components/organisms/TaskList";
import { categoryService } from "@/services/api/categoryService";

const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState("");
  const [taskCounts, setTaskCounts] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
      if (data.length > 0) {
        setActiveCategory(data[0].Id.toString());
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setSidebarOpen(false);
  };

  const handleTaskCountChange = (counts) => {
    setTaskCounts(counts);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        taskCounts={taskCounts}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <TaskList
        activeCategory={activeCategory}
        onTaskCountChange={handleTaskCountChange}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  );
};

export default Dashboard;