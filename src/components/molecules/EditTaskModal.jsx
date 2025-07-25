import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const EditTaskModal = ({ 
  isOpen, 
  onClose, 
  task, 
  categories, 
  onUpdate 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    priority: 'medium',
    dueDate: '',
    recurring: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        categoryId: task.categoryId || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate || '',
        recurring: task.recurring || null
      });
      setErrors({});
    }
  }, [task]);

  // Close modal on escape key
useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    const handleOutsideClick = (e) => {
      if (isOpen && e.target.classList.contains('modal-backdrop')) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);

const handleClose = () => {
    if (isSubmitting) return;
    onClose();
    setFormData({
      title: '',
      categoryId: '',
      priority: 'medium',
      dueDate: '',
      recurring: null
    });
    setErrors({});
  };

  // Handle escape key and click outside
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent body scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setIsSubmitting(true);

    try {
      const updates = {
        title: formData.title.trim(),
        categoryId: formData.categoryId,
        priority: formData.priority,
        dueDate: formData.dueDate || null,
        recurring: formData.recurring
      };

      await onUpdate(task.Id, updates);
      toast.success('Task updated successfully!');
      handleClose();
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleRemoveRecurring = () => {
    setFormData(prev => ({
      ...prev,
      recurring: null
    }));
  };

  const getCurrentCategory = () => {
    return categories.find(cat => cat.Id.toString() === formData.categoryId);
  };

  if (!isOpen) return null;

  const currentCategory = getCurrentCategory();

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[9998] transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Edit Task</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-1 h-auto"
              disabled={isSubmitting}
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title"
                className={`w-full ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.categoryId ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.Id} value={category.Id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>
              )}
              {currentCategory && (
                <div className="flex items-center gap-2 mt-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: currentCategory.color }}
                  />
                  <span className="text-sm text-gray-600">{currentCategory.name}</span>
                </div>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                disabled={isSubmitting}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            {/* Recurring */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recurring
              </label>
              <div className="space-y-2">
                {formData.recurring ? (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Repeat" className="w-4 h-4 text-primary" />
                      <span className="text-sm text-gray-700">
                        {formData.recurring.type.charAt(0).toUpperCase() + formData.recurring.type.slice(1)}
                        {formData.recurring.interval > 1 && ` (every ${formData.recurring.interval})`}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveRecurring}
                      className="p-1 h-auto text-red-600 hover:text-red-700"
                      disabled={isSubmitting}
                    >
                      <ApperIcon name="X" className="w-4 h-4" />
</Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No recurring pattern set</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Recurring Modal */}
    </>
  );
};

export default EditTaskModal;