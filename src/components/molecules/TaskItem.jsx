import React, { useState } from "react";
import { toast } from "react-toastify";
import EditTaskModal from "@/components/molecules/EditTaskModal";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
const TaskItem = ({ task, onToggle, onUpdate, onDelete, category, categories = [] }) => {
const [showEditModal, setShowEditModal] = useState(false);

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
    <React.Fragment>
      <div className={`task-card ${task.completed ? "completed" : ""} group`}>
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onChange={() => onToggle(task.Id)}
            animated={true}
          />
          
          <div className="flex-1 min-w-0">
            <div
              className={`text-base font-medium ${
                task.completed ? "line-through text-gray-500" : "text-gray-900"
              }`}
            >
              {task.title}
            </div>
            
            <div className="flex items-center gap-3 mt-2">
              {/* Category indicator */}
              {category && (
                <div className="flex items-center gap-1">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-xs text-gray-500">{category.name}</span>
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
              onClick={() => setShowEditModal(true)}
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

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        task={task}
        categories={categories}
        onUpdate={onUpdate}
      />
    </React.Fragment>
  );
};

export default TaskItem;