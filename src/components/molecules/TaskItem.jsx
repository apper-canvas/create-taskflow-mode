import React, { useState } from "react";
import { toast } from "react-toastify";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import EditTaskModal from "@/components/molecules/EditTaskModal";
import RecurringModal from "@/components/molecules/RecurringModal";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";

function TaskItem({ task, category, categories, onUpdate, onToggle, onDelete }) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showRecurringModal, setShowRecurringModal] = useState(false)

  // Validate required props
  if (!task) {
    console.warn('TaskItem: task prop is required')
    return null
  }

  const getDueDateInfo = () => {
    if (!task.dueDate) return null
    
    const date = new Date(task.dueDate)
    const isPastDue = isPast(date) && !task.completed
    
    let label
    let className = 'text-sm '
    
    if (isToday(date)) {
      label = 'Today'
      className += isPastDue ? 'text-red-600 font-medium' : 'text-blue-600 font-medium'
    } else if (isTomorrow(date)) {
      label = 'Tomorrow'
      className += 'text-green-600'
    } else if (isPastDue) {
      label = `Overdue (${format(date, 'MMM d')})`
      className += 'text-red-600 font-medium'
    } else {
      label = format(date, 'MMM d, yyyy')
      className += 'text-gray-500'
    }
    
    return { label, className, isPastDue }
  }

  const handleRecurringSave = (recurringData) => {
    if (typeof onUpdate !== 'function') {
      console.error('TaskItem: onUpdate prop must be a function')
      return
    }
    
    onUpdate(task.id || task.Id, { 
      recurring: recurringData,
      isRecurring: true
    })
    setShowRecurringModal(false)
    toast.success('Recurring settings saved!')
  }

  const handleRecurringClick = () => {
    setShowRecurringModal(true)
  }

  const handleEditClick = () => {
    setShowEditModal(true)
  }

  const handleToggleComplete = () => {
    if (typeof onToggle !== 'function') {
      console.error('TaskItem: onToggle prop must be a function')
      return
    }
    onToggle(task.id || task.Id)
  }

  const handleDeleteClick = () => {
    if (typeof onDelete !== 'function') {
      console.error('TaskItem: onDelete prop must be a function')
      return
    }
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id || task.Id)
    }
  }

  const dueDateInfo = getDueDateInfo()
  const taskId = task.id || task.Id
  const taskCategory = category || categories?.find(cat => cat.id === task.categoryId)

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''} ${dueDateInfo?.isPastDue ? 'border-red-200' : ''}`}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed || false}
          onChange={handleToggleComplete}
          className="task-checkbox mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium text-gray-900 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title || 'Untitled Task'}
              </h3>
              
              {task.description && (
                <p className={`text-sm text-gray-600 mt-1 ${task.completed ? 'line-through' : ''}`}>
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {task.priority && (
                  <Badge variant={task.priority} className={`priority-badge priority-${task.priority}`}>
                    {task.priority}
                  </Badge>
                )}
                
                {taskCategory && (
                  <Badge variant="outline" className="text-xs">
                    <ApperIcon name={taskCategory.icon} size={12} className="mr-1" />
                    {taskCategory.name}
                  </Badge>
                )}
                
                {task.isRecurring && (
                  <Badge variant="secondary" className="text-xs">
                    <ApperIcon name="RotateCcw" size={12} className="mr-1" />
                    Recurring
                  </Badge>
                )}
                
                {dueDateInfo && (
                  <span className={dueDateInfo.className}>
                    {dueDateInfo.label}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRecurringClick}
                className="p-1 h-8 w-8"
                title="Set recurring"
              >
                <ApperIcon name="RotateCcw" size={14} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditClick}
                className="p-1 h-8 w-8"
                title="Edit task"
              >
                <ApperIcon name="Edit2" size={14} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteClick}
                className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                title="Delete task"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
{showEditModal && (
        <EditTaskModal
          isOpen={showEditModal}
          task={task}
          category={taskCategory}
          categories={categories || []}
          onClose={() => setShowEditModal(false)}
          onSave={(updates) => {
            if (typeof onUpdate === 'function') {
              onUpdate(task.id || task.Id, updates)
              setShowEditModal(false)
            } else {
              console.error('TaskItem: onUpdate prop must be a function')
            }
          }}
        />
      )}
      
    </div>
  )
}

export default TaskItem