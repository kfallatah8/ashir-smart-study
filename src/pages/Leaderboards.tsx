
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Trophy, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const Leaderboards = () => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'semester'>('week');
  
  // Sample leaderboard data
  const leaderboardData = [
    { id: 1, name: 'Ahmed Mohammed', points: 1250, rank: 1, avatar: '😀' },
    { id: 2, name: 'Sara Khalid', points: 980, rank: 2, avatar: '😊' },
    { id: 3, name: 'Yousef Abdullah', points: 910, rank: 3, avatar: '😎' },
    { id: 4, name: 'Fatima Omar', points: 850, rank: 4, avatar: '🤓' },
    { id: 5, name: 'Mohammed Ali', points: 820, rank: 5, avatar: '😃' },
    { id: 6, name: 'Nora Salem', points: 780, rank: 6, avatar: '🙂' },
    { id: 7, name: 'Khalid Ibrahim', points: 750, rank: 7, avatar: '😄' },
    { id: 8, name: 'Layla Fahad', points: 720, rank: 8, avatar: '😁' },
    { id: 9, name: 'Abdulrahman Saeed', points: 690, rank: 9, avatar: '🥰' },
    { id: 10, name: 'Aisha Mohammed', points: 650, rank: 10, avatar: '😇' },
  ];

  const getTimeFrameLabel = () => {
    if (language === 'en') {
      switch (timeFrame) {
        case 'week': return 'This Week';
        case 'month': return 'This Month';
        case 'semester': return 'This Semester';
      }
    } else {
      switch (timeFrame) {
        case 'week': return 'هذا الأسبوع';
        case 'month': return 'هذا الشهر';
        case 'semester': return 'هذا الفصل الدراسي';
      }
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <h1 className={cn(
          "text-2xl font-bold mb-6",
          isRTL && "text-right"
        )}>{t('Leaderboards')}</h1>

        <Tabs defaultValue="university" className="space-y-4">
          <div className={cn(
            "flex justify-between items-center",
            isRTL && "flex-row-reverse"
          )}>
            <TabsList>
              <TabsTrigger value="university" className={isRTL ? "order-3" : ""}>
                {language === 'en' ? 'University' : 'الجامعة'}
              </TabsTrigger>
              <TabsTrigger value="major" className={isRTL ? "order-2" : ""}>
                {language === 'en' ? 'Major' : 'التخصص'}
              </TabsTrigger>
              <TabsTrigger value="friends" className={isRTL ? "order-1" : ""}>
                {language === 'en' ? 'Friends' : 'الأصدقاء'}
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button 
                variant={timeFrame === 'week' ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setTimeFrame('week')}
              >
                {language === 'en' ? 'Week' : 'أسبوع'}
              </Button>
              <Button 
                variant={timeFrame === 'month' ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setTimeFrame('month')}
              >
                {language === 'en' ? 'Month' : 'شهر'}
              </Button>
              <Button 
                variant={timeFrame === 'semester' ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setTimeFrame('semester')}
              >
                {language === 'en' ? 'Semester' : 'فصل دراسي'}
              </Button>
            </div>
          </div>

          <TabsContent value="university" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className={cn(
                  "text-lg font-medium flex items-center",
                  isRTL && "flex-row-reverse justify-end"
                )}>
                  <Trophy className={cn(
                    "h-5 w-5 text-highlight",
                    isRTL ? "ml-2" : "mr-2"
                  )} />
                  <span>{language === 'en' ? 'Top Students' : 'أفضل الطلاب'} - {getTimeFrameLabel()}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboardData.map((user, index) => (
                    <div 
                      key={user.id} 
                      className={cn(
                        "flex items-center p-3 rounded-lg",
                        index < 3 ? "bg-primary-100" : "hover:bg-gray-50",
                        isRTL && "flex-row-reverse"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full",
                        index === 0 ? "bg-amber-200" : 
                        index === 1 ? "bg-gray-200" : 
                        index === 2 ? "bg-amber-700/70" : "bg-gray-100",
                        isRTL ? "ml-4" : "mr-4"
                      )}>
                        {index < 3 ? (
                          <Award className="h-5 w-5 text-dark" />
                        ) : (
                          <span className="font-medium text-dark">#{user.rank}</span>
                        )}
                      </div>
                      
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full bg-primary-200 text-primary-700",
                        isRTL ? "ml-3" : "mr-3"
                      )}>
                        <span>{user.avatar}</span>
                      </div>
                      
                      <div className={cn("flex-1", isRTL && "text-right")}>
                        <p className="font-medium">{user.name}</p>
                      </div>
                      
                      <div className={cn(
                        "flex items-center",
                        isRTL && "flex-row-reverse"
                      )}>
                        <span className="font-bold text-primary">{user.points}</span>
                        <span className="text-xs text-gray-500 ml-1">
                          {language === 'en' ? 'pts' : 'نقاط'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="major">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className={isRTL ? "text-right" : ""}>
                  {language === 'en' ? 'Computer Science Major - Top Students' : 'تخصص علوم الحاسب - أفضل الطلاب'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-10">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'Coming soon! Major-specific leaderboards will be available in the next update.'
                    : 'قريبًا! ستكون لوحات المتصدرين الخاصة بالتخصص متاحة في التحديث القادم.'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="friends">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className={isRTL ? "text-right" : ""}>
                  {language === 'en' ? 'Friends Circle' : 'دائرة الأصدقاء'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-10">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  {language === 'en'
                    ? 'Add friends to see how you rank among them!'
                    : 'أضف أصدقاء لترى كيف تصنف بينهم!'}
                </p>
                <Button className="mt-4">
                  {language === 'en' ? 'Connect with Friends' : 'تواصل مع الأصدقاء'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Leaderboards;
