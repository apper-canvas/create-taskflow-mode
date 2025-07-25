import React from "react";
import CategoryItem from "@/components/molecules/CategoryItem";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ 
  categories, 
  activeCategory, 
  onCategoryChange, 
  taskCounts,
  isOpen,
  onClose 
}) => {
  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 p-4">
        <div className="space-y-1">
          {categories.map((category) => (
            <CategoryItem
              key={category.Id}
              category={category}
              isActive={activeCategory === category.Id.toString()}
              onClick={() => {
                onCategoryChange(category.Id.toString());
                onClose();
              }}
              taskCount={taskCounts[category.Id] || 0}
            />
          ))}
        </div>
      </div>

      {/* Footer stats */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {Object.values(taskCounts).reduce((a, b) => a + b, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-surface border-r border-gray-200 h-screen">
        {sidebarContent}
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="absolute left-0 top-0 h-full w-80 bg-surface transform transition-transform duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;