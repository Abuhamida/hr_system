import { createClient } from '@/lib/supabase/server';
import AnalyticsDashboard from './components/AnalyticsDashboard';

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const { data: employees } = await supabase
    .from('employees')
    .select('*');

  const { data: attritionData } = await supabase
    .from('attrition_predictions')
    .select('*');

  const { data: departments } = await supabase
    .from('departments')
    .select('*');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Advanced HR analytics and insights</p>
      </div>

      <AnalyticsDashboard 
        employees={employees || []}
        attritionData={attritionData || []}
        departments={departments || []}
      />
    </div>
  );
}