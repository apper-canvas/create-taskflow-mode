import React, { useState } from "react";
import { toast } from "react-toastify";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { format, isToday, isTomorrow, isPast } from "date-fns";

const TaskItem = ({ task, onToggle, onUpdate, onDelete, category, categories = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

const handleSave = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      onUpdate(task.Id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const handleCategoryChange = (newCategoryId) => {
    const newCategory = categories.find(cat => cat.Id.toString() === newCategoryId);
    onUpdate(task.Id, { categoryId: newCategoryId });
    setShowCategoryDropdown(false);
    toast.success(`Task moved to ${newCategory?.name || 'category'}`);
  };

  const getDueDateInfo = () => {
    if (!task.dueDate) return null;
    
    const date = new Date(task.dueDate);
    const isPastDue = isPast(date) && !isToday(date);
    
    let label = format(date, "MMM d");
    let className = "text-gray-500";
    
    if (isToday(date)) {
      label = "Today";
      className = "text-blue-600 font-medium";
    } else if (isTomorrow(date)) {
      label = "Tomorrow";
      className = "text-green-600 font-medium";
    } else if (isPastDue) {
      label = `Overdue (${label})`;
      className = "text-red-600 font-medium";
    }
    
    return { label, className, isPastDue };
  };

  const dueDateInfo = getDueDateInfo();

  return (
    <div className={`task-card ${task.completed ? "completed" : ""} group`}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onChange={() => onToggle(task.Id)}
          animated={true}
        />
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              className="text-base font-medium"
              autoFocus
            />
          ) : (
            <div
              className={`text-base font-medium cursor-pointer hover:text-primary transition-colors ${
                task.completed ? "line-through text-gray-500" : "text-gray-900"
              }`}
              onClick={() => setIsEditing(true)}
            >
              {task.title}
            </div>
          )}
          
          <div className="flex items-center gap-3 mt-2">
{/* Category indicator with dropdown */}
            {category && (
              <div className="relative">
                <div 
                  className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-xs text-gray-500">{category.name}</span>
                  <ApperIcon name="ChevronDown" className="w-3 h-3 text-gray-400" />
                </div>
{showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
                    {categories.map((cat) => (
                      <div
                        key={cat.Id}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer first:rounded-t-lg last:rounded-b-lg"
                        onClick={() => handleCategoryChange(cat.Id.toString())}
                      >
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-xs text-gray-700">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Priority badge */}
            <Badge variant={task.priority}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            
            {/* Due date */}
            {dueDateInfo && (
              <div className={`text-xs ${dueDateInfo.className} flex items-center gap-1`}>
                <ApperIcon 
                  name={dueDateInfo.isPastDue ? "AlertTriangle" : "Calendar"} 
                  className="w-3 h-3" 
                />
                {dueDateInfo.label}
              </div>
            )}
            
            {/* Completion date */}
            {task.completed && task.completedAt && (
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <ApperIcon name="CheckCircle" className="w-3 h-3" />
                Completed {format(new Date(task.completedAt), "MMM d")}
              </div>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="p-1 h-auto"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.Id)}
            className="p-1 h-auto text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;