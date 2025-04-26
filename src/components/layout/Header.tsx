import React from 'react';
import { Bell, Menu, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: t('Error'),
        description: error.message,
        variant: 'destructive',
      });
    } else {
      navigate('/auth');
    }
  };

  const handleLanguageChange = (lang: 'en' | 'ar') => {
    setLanguage(lang);
    toast({
      title: lang === 'en' ? 'Language Changed' : 'تم تغيير اللغة',
      description: lang === 'en' ? 'English language selected' : 'تم اختيار اللغة العربية',
    });
  };

  return (
    <header className={cn(
      "bg-white shadow-sm py-2 px-4 flex items-center justify-between",
      isRTL && "flex-row-reverse"
    )}>
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className={cn("mr-2", isRTL && "ml-2 mr-0")}>
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
          <DropdownMenuContent align={isRTL ? "start" : "end"}>
            <DropdownMenuItem 
              onClick={() => handleLanguageChange('en')} 
              className={language === 'en' ? 'bg-primary-100' : ''}
            >
              English
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleLanguageChange('ar')} 
              className={language === 'ar' ? 'bg-primary-100' : ''}
            >
              العربية
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="@user" />
                <AvatarFallback className="bg-primary-200 text-primary-700">AM</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align={isRTL ? "start" : "end"} forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{t('Ahmed Mohammed')}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  ahmed.m@university.sa
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              {t('Profile')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              {t('Settings')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {t('Help & Support')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              {t('Log out')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
