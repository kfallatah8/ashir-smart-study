
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Book, 
  Award, 
  Users, 
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/hooks/use-language';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface SidebarMenuProps {
  open: boolean;
  toggleSidebar: () => void;
}

export default function SidebarMenu({ open, toggleSidebar }: SidebarMenuProps) {
  const currentPath = useLocation().pathname;
  const isMobile = useIsMobile();
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  const navigationItems = [
    { name: t('Dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('Study Zone'), href: '/study', icon: Book },
    { name: t('My Documents'), href: '/documents', icon: FileText },
    { name: t('Achievements'), href: '/achievements', icon: Award },
    { name: t('Leaderboards'), href: '/leaderboards', icon: Users },
    { name: t('Settings'), href: '/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className={cn(
      "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out",
      open ? "w-64" : "w-20",
      isRTL ? "border-l border-r-0" : "border-r border-l-0"
    )}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className={cn("flex items-center", !open && "justify-center w-full")}>
          <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">SS</span>
          </div>
          {open && <span className={cn("ml-2 font-bold text-lg text-dark", isRTL && "mr-2 ml-0")}>SmartStudy</span>}
        </div>
        {!isMobile && (
          <button 
            onClick={toggleSidebar} 
            className="rounded-full p-1 hover:bg-gray-100 text-gray-500"
          >
            {open ? 
              isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" /> : 
              isRTL ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />
            }
          </button>
        )}
      </div>
      
      <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
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
                    open ? "justify-start" : "justify-center",
                    isActive
                      ? "bg-primary-100 text-primary"
                      : "text-gray-600 hover:bg-gray-100",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  <IconComponent className={cn(
                    "h-5 w-5",
                    isActive ? "text-primary" : "text-gray-400",
                    open ? (isRTL ? "ml-3" : "mr-3") : "mx-0"
                  )} />
                  {open && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {open && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-muted rounded-lg p-3 text-xs text-gray-600">
            <p className="font-semibold">{t('Need help?')}</p>
            <p className="mt-1">{t('Check our tutorials or contact support.')}</p>
            <button className="mt-2 text-primary hover:text-primary-600 text-xs font-medium">
              {t('View tutorials')} →
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={toggleSidebar}>
        <SheetContent side={isRTL ? "right" : "left"} className="p-0 w-[280px]">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  return sidebarContent;
}
