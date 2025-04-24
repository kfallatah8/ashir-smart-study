
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Book, 
  Award, 
  Users, 
  Settings,
  FileText
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Study Zone', href: '/study', icon: Book },
  { name: 'My Documents', href: '/documents', icon: FileText },
  { name: 'Achievements', href: '/achievements', icon: Award },
  { name: 'Leaderboards', href: '/leaderboards', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const currentPath = window.location.pathname;

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-center">
          <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">SS</span>
          </div>
          <span className="ml-2 font-bold text-lg text-dark">SmartStudy</span>
        </div>
      </div>
      
      <nav className="flex-1 pt-4 pb-4">
        <ul className="space-y-1 px-2">
          {navigationItems.map((item) => {
            const isActive = currentPath === item.href;
            const IconComponent = item.icon;
            
            return (
              <li key={item.name}>
                <Link 
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-primary-100 text-primary"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <IconComponent className={cn(
                    "mr-3 h-5 w-5",
                    isActive ? "text-primary" : "text-gray-400"
                  )} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="bg-muted rounded-lg p-3 text-xs text-gray-600">
          <p className="font-semibold">Need help?</p>
          <p className="mt-1">Check our tutorials or contact support.</p>
          <button className="mt-2 text-primary hover:text-primary-600 text-xs font-medium">
            View tutorials →
          </button>
        </div>
      </div>
    </div>
  );
}
