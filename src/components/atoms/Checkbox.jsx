import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = ({ checked, onChange, className, animated = false }) => {
  return (
    <div
      className={cn(
        "task-checkbox",
        checked && "completed",
        animated && "animate-check",
        className
      )}
      onClick={onChange}
    >
      {checked && (
        <ApperIcon 
          name="Check" 
          className="w-3 h-3 text-white animate-scale-in" 
        />
      )}
    </div>
  );
};

export default Checkbox;