import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const AddTaskForm = ({ onAdd, categories, defaultCategory }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [categoryId, setCategoryId] = useState(defaultCategory || "");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      title: title.trim(),
      priority,
      categoryId: categoryId || categories[0]?.Id?.toString(),
      dueDate: dueDate || null
    };

    onAdd(newTask);
    setTitle("");
    setPriority("medium");
    setDueDate("");
    setIsExpanded(false);
  };

  const handleQuickAdd = (e) => {
    if (e.key === "Enter" && !isExpanded) {
      if (title.trim()) {
        onAdd({
          title: title.trim(),
          priority: "medium",
          categoryId: categoryId || categories[0]?.Id?.toString(),
          dueDate: null
        });
        setTitle("");
      }
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-gray-200 p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Add a new task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleQuickAdd}
              onFocus={() => setIsExpanded(true)}
              className="text-base"
            />
          </div>
          <Button 
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0"
          >
            <ApperIcon name={isExpanded ? "ChevronUp" : "ChevronDown"} className="w-4 h-4" />
          </Button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4 animate-scale-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {categories.map((category) => (
                    <option key={category.Id} value={category.Id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsExpanded(false);
                  setTitle("");
                  setPriority("medium");
                  setDueDate("");
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!title.trim()}>
                <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                Add Task
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddTaskForm;