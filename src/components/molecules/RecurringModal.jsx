import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const RecurringModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [pattern, setPattern] = useState(initialData?.pattern || "daily");
  const [frequency, setFrequency] = useState(initialData?.frequency || 1);
  const [selectedDays, setSelectedDays] = useState(initialData?.selectedDays || []);
  const [selectedDates, setSelectedDates] = useState(initialData?.selectedDates || []);

  const weekDays = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" }
  ];

  const monthDates = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleDayToggle = (dayValue) => {
    setSelectedDays(prev => 
      prev.includes(dayValue) 
        ? prev.filter(d => d !== dayValue)
        : [...prev, dayValue].sort((a, b) => a - b)
    );
  };

  const handleDateToggle = (date) => {
    setSelectedDates(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date].sort((a, b) => a - b)
    );
  };

  const handleSave = () => {
    const recurringData = {
      pattern,
      frequency,
      selectedDays: pattern === "weekly" ? selectedDays : [],
      selectedDates: pattern === "monthly" ? selectedDates : []
    };
    onSave(recurringData);
    onClose();
  };

  const isValid = () => {
    if (pattern === "daily") return frequency > 0;
    if (pattern === "weekly") return selectedDays.length > 0;
    if (pattern === "monthly") return selectedDates.length > 0;
    return false;
  };

  if (!isOpen) return null;

return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Configure Recurring</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Pattern Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Recurring Pattern
              </label>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                {[
                  { value: "daily", label: "Daily" },
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPattern(value)}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                      pattern === value
                        ? "bg-primary text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Pattern */}
            {pattern === "daily" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repeat every
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={frequency}
                    onChange={(e) => setFrequency(parseInt(e.target.value) || 1)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-center"
                  />
                  <span className="text-gray-700">
                    {frequency === 1 ? "day" : "days"}
                  </span>
                </div>
              </div>
            )}

            {/* Weekly Pattern */}
            {pattern === "weekly" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Repeat on
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {weekDays.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleDayToggle(value)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        selectedDays.includes(value)
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {selectedDays.length === 0 && (
                  <p className="text-red-500 text-sm mt-2">
                    Please select at least one day
                  </p>
                )}
              </div>
            )}

            {/* Monthly Pattern */}
            {pattern === "monthly" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Repeat on dates
                </label>
                <div className="grid grid-cols-7 gap-1 max-h-32 overflow-y-auto">
                  {monthDates.map(date => (
                    <button
                      key={date}
                      type="button"
                      onClick={() => handleDateToggle(date)}
                      className={`w-8 h-8 text-xs rounded border transition-colors ${
                        selectedDates.includes(date)
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
                {selectedDates.length === 0 && (
                  <p className="text-red-500 text-sm mt-2">
                    Please select at least one date
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isValid()}
            >
              <ApperIcon name="Check" className="w-4 h-4 mr-1" />
              Save Recurring
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecurringModal;