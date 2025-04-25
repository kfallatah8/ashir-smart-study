
import React from 'react';
import { Bell, Menu, User, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/hooks/use-language';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <header className={cn(
      "bg-white shadow-sm py-2 px-4 flex items-center justify-between",
      isRTL && "flex-row-reverse"
    )}>
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
          <Menu className="h-5 w-5 text-gray-600" />
        </Button>
        <h1 className={cn(
          "text-lg font-bold text-primary",
          isRTL ? "mr-2" : "mr-2"
        )}>SmartStudy</h1>
        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">Beta</span>
      </div>

      <div className={cn(
        "flex items-center space-x-4",
        isRTL && "flex-row-reverse space-x-reverse"
      )}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="h-5 w-5 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-primary-100' : ''}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('ar')} className={language === 'ar' ? 'bg-primary-100' : ''}>
              العربية
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-highlight rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="@user" />
                <AvatarFallback className="bg-primary-200 text-primary-700">US</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{t('Ahmed Mohammed')}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  ahmed.m@university.sa
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {t('Profile')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {t('Settings')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {t('Help & Support')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {t('Log out')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// Import cn from utils
import { cn } from '@/lib/utils';
