import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import RecurringModal from "@/components/molecules/RecurringModal";
const AddTaskForm = ({ onAdd, categories, defaultCategory }) => {
const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [categoryId, setCategoryId] = useState(defaultCategory || "");
  const [dueDate, setDueDate] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringData, setRecurringData] = useState(null);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      title: title.trim(),
      priority,
      categoryId: categoryId || categories[0]?.Id?.toString(),
      dueDate: dueDate || null,
      recurring: isRecurring ? recurringData : null
    };

    onAdd(newTask);
    setTitle("");
    setPriority("medium");
    setDueDate("");
    setIsRecurring(false);
    setRecurringData(null);
    setIsExpanded(false);
  };

  const handleRecurringSave = (data) => {
    setRecurringData(data);
    setIsRecurring(true);
  };

  const handleRecurringToggle = () => {
    if (isRecurring) {
      setIsRecurring(false);
      setRecurringData(null);
    } else {
      setShowRecurringModal(true);
    }
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

            {/* Recurring Task Toggle */}
            <div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRecurringToggle}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    isRecurring
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <ApperIcon name="Repeat" className="w-4 h-4" />
                  Make Recurring
                </button>
                {isRecurring && recurringData && (
                  <div className="text-sm text-gray-600">
                    {recurringData.pattern === "daily" && `Every ${recurringData.frequency} day${recurringData.frequency !== 1 ? 's' : ''}`}
                    {recurringData.pattern === "weekly" && `Weekly on ${recurringData.selectedDays.map(d => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d]).join(", ")}`}
                    {recurringData.pattern === "monthly" && `Monthly on ${recurringData.selectedDates.join(", ")}`}
                  </div>
                )}
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
                  setIsRecurring(false);
                  setRecurringData(null);
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

      <RecurringModal
        isOpen={showRecurringModal}
        onClose={() => setShowRecurringModal(false)}
        onSave={handleRecurringSave}
        initialData={recurringData}
      />
    </div>
  );
};

export default AddTaskForm;