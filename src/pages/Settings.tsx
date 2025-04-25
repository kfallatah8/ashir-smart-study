
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Globe, Bell, Shield, User } from 'lucide-react';

const Settings = () => {
  const { language, setLanguage, t } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <h1 className={cn("text-2xl font-bold mb-6", isRTL && "text-right")}>{t('Settings')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar navigation */}
          <div className="col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="flex flex-col p-2">
                  <Button variant="ghost" className={cn(
                    "justify-start my-1",
                    isRTL && "flex-row-reverse text-right"
                  )}>
                    <User className={cn("h-5 w-5", isRTL ? "ml-2" : "mr-2")} />
                    {t('Profile')}
                  </Button>
                  <Button variant="ghost" className={cn(
                    "justify-start my-1 bg-primary-100 text-primary",
                    isRTL && "flex-row-reverse text-right"
                  )}>
                    <Globe className={cn("h-5 w-5", isRTL ? "ml-2" : "mr-2")} />
                    {t('Language & Region')}
                  </Button>
                  <Button variant="ghost" className={cn(
                    "justify-start my-1",
                    isRTL && "flex-row-reverse text-right"
                  )}>
                    <Bell className={cn("h-5 w-5", isRTL ? "ml-2" : "mr-2")} />
                    {t('Notifications')}
                  </Button>
                  <Button variant="ghost" className={cn(
                    "justify-start my-1",
                    isRTL && "flex-row-reverse text-right"
                  )}>
                    <Shield className={cn("h-5 w-5", isRTL ? "ml-2" : "mr-2")} />
                    {t('Security')}
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main settings content */}
          <div className="col-span-1 md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className={isRTL ? "text-right" : ""}>
                  {t('Language & Region')}
                </CardTitle>
                <CardDescription className={isRTL ? "text-right" : ""}>
                  {language === 'en' 
                    ? 'Choose your preferred language and region settings.'
                    : 'اختر لغتك المفضلة وإعدادات المنطقة.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={isRTL ? "text-right" : ""}>
                  <Label htmlFor="language" className="block mb-2">
                    {language === 'en' ? 'Application Language' : 'لغة التطبيق'}
                  </Label>
                  <RadioGroup 
                    defaultValue={language}
                    onValueChange={(value) => setLanguage(value as 'en' | 'ar')}
                    className="flex flex-col space-y-1"
                  >
                    <div className={cn(
                      "flex items-center space-x-2",
                      isRTL && "flex-row-reverse justify-end space-x-reverse"
                    )}>
                      <RadioGroupItem value="en" id="en" />
                      <Label htmlFor="en">English</Label>
                    </div>
                    <div className={cn(
                      "flex items-center space-x-2",
                      isRTL && "flex-row-reverse justify-end space-x-reverse"
                    )}>
                      <RadioGroupItem value="ar" id="ar" />
                      <Label htmlFor="ar">العربية</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator className="my-6" />
                
                <div className={isRTL ? "text-right" : ""}>
                  <Label className="block mb-4">
                    {language === 'en' ? 'Regional Settings' : 'إعدادات إقليمية'}
                  </Label>
                  {/* Example regional settings would go here */}
                  <p className="text-sm text-gray-500">
                    {language === 'en' 
                      ? 'Additional regional settings will be available in a future update.' 
                      : 'ستتوفر إعدادات إقليمية إضافية في تحديث مستقبلي.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;

// Import cn from utils
import { cn } from '@/lib/utils';
