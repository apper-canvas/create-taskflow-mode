import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CategoryItem = ({ category, isActive, onClick, taskCount }) => {
  return (
    <div
      className={cn("category-item", isActive && "active")}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 flex-1">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <ApperIcon name={category.icon} className="w-4 h-4" />
        <span className="font-medium">{category.name}</span>
      </div>
      <span className={cn(
        "text-sm px-2 py-0.5 rounded-full min-w-[20px] text-center",
        isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
      )}>
        {taskCount}
      </span>
    </div>
  );
};

export default CategoryItem;