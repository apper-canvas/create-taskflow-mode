import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ children, variant = "default", className }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    high: "priority-high",
    medium: "priority-medium", 
    low: "priority-low",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    error: "bg-red-100 text-red-700"
  };
  
  return (
    <span className={cn("priority-badge", variants[variant], className)}>
      {children}
    </span>
  );
};

export default Badge;