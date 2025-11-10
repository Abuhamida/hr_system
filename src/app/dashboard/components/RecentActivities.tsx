'use client';

import { Calendar, UserPlus, UserMinus, Award } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'new_hire',
    description: 'New employee joined',
    person: 'Sarah Johnson',
    role: 'Software Engineer',
    time: '2 hours ago',
    icon: UserPlus,
    color: 'text-green-600 bg-green-50',
  },
  {
    id: 2,
    type: 'attrition_risk',
    description: 'High attrition risk detected',
    person: 'Mike Chen',
    role: 'Product Manager',
    time: '5 hours ago',
    icon: Award,
    color: 'text-red-600 bg-red-50',
  },
  {
    id: 3,
    type: 'performance_review',
    description: 'Performance review completed',
    person: 'Emily Davis',
    role: 'UX Designer',
    time: '1 day ago',
    icon: Award,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    id: 4,
    type: 'termination',
    description: 'Employee terminated',
    person: 'John Smith',
    role: 'Marketing Specialist',
    time: '2 days ago',
    icon: UserMinus,
    color: 'text-gray-600 bg-gray-50',
  },
];

export default function RecentActivities() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg ${activity.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {activity.description}
                </p>
                <p className="text-sm text-gray-600">
                  {activity.person} • {activity.role}
                </p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}