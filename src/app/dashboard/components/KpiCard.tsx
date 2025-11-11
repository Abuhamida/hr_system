import React from 'react';
import { motion } from 'framer-motion';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, subtitle, icon, trend }) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'stable':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-md p-6 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
            {title}
          </p>
          <p className={`text-3xl font-bold ${getTrendColor()} mb-2`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl flex items-center justify-center shadow-sm ml-4">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default KpiCard;