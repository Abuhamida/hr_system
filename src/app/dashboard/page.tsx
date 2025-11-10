import { createClient } from '@/lib/supabase/server';
import { BarChart3, Users, TrendingDown, MessageCircle } from 'lucide-react';
import AttritionRiskChart from './components/AttritionRiskChart';
import QuickStats from './components/QuickStats';
import RecentActivities from './components/RecentActivities';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch dashboard data
  const { data: employees } = await supabase
    .from('employees')
    .select('*')
    .eq('status', 'active');

  const { data: attritionData } = await supabase
    .from('attrition_predictions')
    .select('*')
    .order('prediction_date', { ascending: false })
    .limit(10);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome back! Here's your HR overview.
        </div>
      </div>

      <QuickStats employees={employees || []} attritionData={attritionData || []} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttritionRiskChart data={attritionData || []} />
        <RecentActivities />
      </div>
    </div>
  );
}