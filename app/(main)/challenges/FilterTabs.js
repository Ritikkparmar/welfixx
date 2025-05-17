'use client';

import { motion } from 'framer-motion';

export default function FilterTabs({ activeType, activeStatus, onTypeChange, onStatusChange }) {
  const types = [
    { value: 'ALL', label: 'All' },
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' }
  ];
  
  const statuses = [
    { value: 'ALL', label: 'All' },
    { value: 'NOT_STARTED', label: 'Not Started' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' }
  ];
  
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Challenge Type Filter */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Challenge Type</h3>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <motion.button
                key={type.value}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeType === type.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => onTypeChange(type.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {type.label}
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Challenge Status Filter */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <motion.button
                key={status.value}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeStatus === status.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => onStatusChange(status.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {status.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 