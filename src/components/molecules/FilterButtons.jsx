import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FilterButtons = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { key: "all", label: "All", icon: "List" },
    { key: "active", label: "Active", icon: "Circle" },
    { key: "completed", label: "Completed", icon: "CheckCircle" },
    { key: "overdue", label: "Overdue", icon: "AlertTriangle" }
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={activeFilter === filter.key ? "primary" : "secondary"}
          size="sm"
          onClick={() => onFilterChange(filter.key)}
          className="inline-flex items-center gap-1"
        >
          <ApperIcon name={filter.icon} className="w-3 h-3" />
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default FilterButtons;