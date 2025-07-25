import React, { useState } from 'react'
import { toast } from 'react-toastify'
import EditTaskModal from '@/components/molecules/EditTaskModal'
import RecurringModal from '@/components/molecules/RecurringModal'
import { format, isPast, isToday, isTomorrow } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import Checkbox from '@/components/atoms/Checkbox'

const TaskItem = ({ task, category, categories, onToggle, onUpdate, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showRecurringModal, setShowRecurringModal] = useState(false)

  const getDueDateInfo = () => {
    if (!task.dueDate) return null
    
    const date = new Date(task.dueDate)
    const isPastDue = isPast(date) && !isToday(date)
    
    let label = format(date, 'MMM d')
    if (isToday(date)) label = 'Today'
    else if (isTomorrow(date)) label = 'Tomorrow'
    
    const className = isPastDue 
      ? 'text-red-600 bg-red-50 border-red-200' 
      : 'text-gray-500'
    
    return { label, className, isPastDue }
  }

  const handleRecurringClick = () => {
    setShowRecurringModal(true)
  }

  const handleRecurringSave = (recurringData) => {
    onUpdate(task.Id, { 
      recurring: recurringData,
      isRecurring: true
    })
    setShowRecurringModal(false)
    toast.success('Recurring settings saved!')
  }

  const dueDateInfo = getDueDateInfo()

  return (
    <>
      <div className={`task-card ${task.completed ? 'completed' : ''}`}>
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onChange={() => onToggle(task.Id)}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              
              <div className="flex items-center gap-2">
                {task.priority && (
                  <Badge className={`priority-badge priority-${task.priority}`}>
                    {task.priority}
                  </Badge>
                )}
                
                {dueDateInfo && (
                  <Badge className={dueDateInfo.className}>
                    <ApperIcon name="Calendar" size={12} className="mr-1" />
                    {dueDateInfo.label}
                  </Badge>
                )}
                
                {category && (
                  <Badge 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${category.color}20`,
                      color: category.color,
                      border: `1px solid ${category.color}40`
                    }}
                  >
                    {category.name}
                  </Badge>
                )}
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRecurringClick}
                    className="p-1 h-6 w-6"
                  >
                    <ApperIcon name="Repeat" size={14} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEditModal(true)}
                    className="p-1 h-6 w-6"
                  >
                    <ApperIcon name="Edit2" size={14} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(task.Id)}
                    className="p-1 h-6 w-6 text-red-600 hover:text-red-700"
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            </div>
            
            {task.description && (
              <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}
            
            {task.isRecurring && (
              <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                <ApperIcon name="Repeat" size={12} />
                <span>Recurring task</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        task={task}
        categories={categories}
        onSave={(updates) => {
          onUpdate(task.Id, updates)
          setShowEditModal(false)
        }}
      />

      <RecurringModal
        isOpen={showRecurringModal}
        onClose={() => setShowRecurringModal(false)}
        onSave={handleRecurringSave}
        initialData={task.recurring}
      />
    </>
  )
}

export default TaskItem