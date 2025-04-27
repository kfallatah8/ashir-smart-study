
import React, { useState, useEffect } from 'react';
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
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          
          // Get profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('avatar_url, full_name')
            .eq('id', user.id)
            .single();
          
          if (profile?.avatar_url) {
            setProfileImage(profile.avatar_url);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    
    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: t('Error'),
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: t('Signed Out'),
        description: t('You have been signed out successfully'),
      });
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
  
  // Get the user's initials for avatar fallback
  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((name: string) => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    
    return 'ST'; // Default: Student
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
            <Button variant="ghost" size="icon" className="transform-3d hover:element-3d">
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
        
        <Button variant="ghost" size="icon" className="relative transform-3d hover:element-3d">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full transform-3d hover:element-3d overflow-visible ring-2 ring-primary-100/50 ring-offset-2">
              <Avatar className="h-9 w-9 border-2 border-white shadow-lg">
                <AvatarImage 
                  src={profileImage || '/placeholder.svg'} 
                  alt={user?.email || "User"} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align={isRTL ? "start" : "end"} forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || t('Student')}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || ""}
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
