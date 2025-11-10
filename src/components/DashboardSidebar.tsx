'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  BarChart3,
  AlertTriangle,
  MessageSquare,
  FileText,
  TrendingUp,
  Settings,
  Menu,
  X
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Employees', href: '/dashboard/employees', icon: Users },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Predictions', href: '/dashboard/predictions', icon: AlertTriangle },
  { name: 'AI Chat', href: '/dashboard/chat', icon: MessageSquare },
  { name: 'Surveys', href: '/dashboard/surveys', icon: FileText },
  { name: 'Training', href: '/dashboard/training', icon: TrendingUp },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 m-4 fixed z-50 bg-white rounded-lg shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="shrink-0 flex items-center px-4">
                  <h1 className="text-xl font-bold text-gray-900">HR Analytics</h1>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="ml-auto p-2 rounded-md text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                          isActive
                            ? 'bg-primary-100 text-primary-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon className={`mr-4 shrink-0 h-6 w-6 ${
                          isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`} />
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">HR Analytics</h1>
            </div>
            <nav className="mt-5 flex-1 flex flex-col divide-y divide-gray-200 overflow-y-auto">
              <div className="px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-primary-100 text-primary-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className={`mr-3 shrink-0 h-6 w-6 ${
                        isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`} />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}