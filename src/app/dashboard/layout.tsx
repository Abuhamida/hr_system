'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  Brain, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Loader2,
  Shield,
  User,
  PieChart
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { UserRole } from '@/lib/auth-utils';

// Define navigation items with role restrictions
const navigationItems = [
  { icon: Home, label: 'Overview', href: '/dashboard', roles: ['admin', 'employee'] },
  { icon: Users, label: 'Employees', href: '/dashboard/employees', roles: ['admin'] },
  { icon: MessageSquare, label: 'Prediction', href: '/dashboard/prediction', roles: ['admin', ] },
  { icon: MessageSquare, label: 'AI Chat', href: '/dashboard/chat', roles: ['admin', 'employee'] },
  { icon: User, label: 'My Profile', href: '/dashboard/profile', roles: ['admin', 'employee'] },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings', roles: ['admin', 'employee'] },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole>('employee');
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const initializeUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      setUser(user);

      // Get user role from API or determine it
      try {
        // Try to get role from headers first (set by middleware)
        const roleFromHeaders = await getUserRoleFromServer();
        if (roleFromHeaders) {
          setUserRole(roleFromHeaders);
        } else {
          // Fallback: determine role from database
          const role = await determineUserRole(user.id);
          setUserRole(role);
        }
      } catch (error) {
        console.error('Error getting user role:', error);
        setUserRole('employee');
      }

      setLoading(false);
    };

    initializeUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  // Function to get user role from server (via API)
  const getUserRoleFromServer = async (): Promise<UserRole | null> => {
    try {
      const response = await fetch('/api/auth/role', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.role;
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
    
    return null;
  };

  // Fallback role determination
  const determineUserRole = async (userId: string): Promise<UserRole> => {
    const { data: employee } = await supabase
      .from('employees')
      .select('role')
      .eq('id', userId)
      .single();

    return employee?.role || 'employee';
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Filter navigation items based on user role
  const getFilteredNavigationItems = () => {
    return navigationItems.filter(item => item.roles.includes(userRole));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const filteredItems = getFilteredNavigationItems();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-900">PeopleInsight</span>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredItems.map((item) => {
              const isActive = pathname === item.href;
              const isAdminOnly = item.roles.length === 1 && item.roles[0] === 'admin';
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors group ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${isAdminOnly ? 'border-l-4 border-l-blue-500' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span className="font-medium">{item.label}</span>
                      {isAdminOnly && (
                        <Shield className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                userRole === 'admin' 
                  ? 'bg-blue-100 border-2 border-blue-300' 
                  : 'bg-primary-100'
              }`}>
                {userRole === 'admin' ? (
                  <Shield className="w-4 h-4 text-blue-600" />
                ) : (
                  <span className="text-sm font-medium text-primary-700">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.user_metadata?.first_name || user.email?.split('@')[0]}
                    </p>
                    {userRole === 'admin' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {userRole === 'admin' ? 'HR Administrator' : 'Employee'}
                  </p>
                </div>
              )}
              <button 
                onClick={handleSignOut}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Role indicator in header */}
        <div className="bg-white border-b border-gray-200 px-6 py-[17px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-gray-900">
                {pathname === '/dashboard' && 'Overview'}
                {pathname === '/dashboard/employees' && 'Employee Management'}
                {pathname === '/dashboard/analytics' && 'HR Analytics'}
                {pathname === '/dashboard/prediction' && 'HR Prediction'}
                {pathname === '/dashboard/chat' && 'AI Assistant'}
                {pathname === '/dashboard/profile' && 'My Profile'}
                {pathname === '/dashboard/settings' && 'Settings'}
              </h1>
              {userRole === 'admin' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Administrator
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {userRole === 'admin' ? 'Full Access' : 'Limited Access'}
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}