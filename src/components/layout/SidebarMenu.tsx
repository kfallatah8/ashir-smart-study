
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';
import { 
  LayoutDashboard, 
  Book, 
  Award, 
  Users, 
  Settings,
  FileText,
  X
} from 'lucide-react';

interface SidebarMenuProps {
  open: boolean;
  toggleSidebar: () => void;
}

export default function SidebarMenu({ open, toggleSidebar }: SidebarMenuProps) {
  const { t, language } = useLanguage();
  const location = useLocation();
  const isRTL = language === 'ar';
  
  const navigationItems = [
    { name: t('Dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('Study Zone'), href: '/study', icon: Book },
    { name: t('My Documents'), href: '/documents', icon: FileText },
    { name: t('Achievements'), href: '/achievements', icon: Award },
    { name: t('Leaderboards'), href: '/leaderboards', icon: Users },
    { name: t('Settings'), href: '/settings', icon: Settings },
  ];

  return (
    <div 
      className={cn(
        "fixed inset-y-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full",
        isRTL && "left-auto right-0",
        isRTL && (open ? "translate-x-0" : "translate-x-full")
      )}
      style={{ overflowY: 'auto' }}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center shadow-lg transform-3d hover:element-3d">
              <span className="text-white font-bold text-lg">SS</span>
            </div>
            <span className="ml-2 font-bold text-lg text-primary">SmartStudy</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
          <div className="px-3 space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href || 
                              (item.href !== '/' && location.pathname.startsWith(item.href));
              const IconComponent = item.icon;
              
              return (
                <Link 
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all transform-3d",
                    isActive
                      ? "bg-primary-100/70 text-primary translate-x-1 shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:translate-x-1 hover:shadow-sm"
                  )}
                >
                  <div className={cn(
                    "mr-3 p-1.5 rounded-md transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-gray-400 group-hover:text-gray-500"
                  )}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  {item.name}
                  
                  {isActive && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-primary"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="bg-muted rounded-lg p-3.5 text-xs transform-3d hover:element-3d">
            <p className="font-semibold text-gray-700">{t('Need help?')}</p>
            <p className="mt-1 text-gray-600">{t('Check our tutorials or contact support.')}</p>
            <button className="mt-2 text-primary hover:text-primary-600 text-xs font-medium transition-colors">
              {t('View tutorials')} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
