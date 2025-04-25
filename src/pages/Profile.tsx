
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRound, Settings, FileText, Award, Book, Star, Edit3, Mail, School, Calendar } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/hooks/use-language';

export default function Profile() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  return (
    <MainLayout>
      <div className="animate-fade-in max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Summary */}
          <div className="w-full md:w-1/3">
            <Card className="mb-6 transform-3d hover:element-3d">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="w-24 h-24 mb-4 border-4 border-white shadow-lg">
                      <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" />
                      <AvatarFallback className="bg-primary-200 text-primary-700 text-2xl">AM</AvatarFallback>
                    </Avatar>
                    <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full w-8 h-8 bg-white">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-bold mt-2">{t('Ahmed Mohammed')}</h2>
                  <p className="text-gray-500 mb-4">@ahmed_m</p>
                  
                  <Button className="mb-4 w-full">
                    <Edit3 className="mr-2 h-4 w-4" />
                    {t('Edit Profile')}
                  </Button>
                  
                  <div className="w-full space-y-4">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>ahmed.m@university.sa</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <School className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{t('Computer Science Major')}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{t('3rd Year Student')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="transform-3d hover:element-3d">
              <CardHeader>
                <CardTitle className="text-lg">{t('Learning Stats')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>{t('Study Hours')}</span>
                    <span className="font-medium">120h</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>{t('Documents Processed')}</span>
                    <span className="font-medium">24/30</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>{t('Current Streak')}</span>
                    <span className="font-medium">7 {t('Days')}</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="achievements" className="w-full">
              <TabsList className="mb-6 grid grid-cols-3 w-full">
                <TabsTrigger value="achievements">
                  <Award className="mr-2 h-4 w-4" />
                  {t('Achievements')}
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileText className="mr-2 h-4 w-4" />
                  {t('Documents')}
                </TabsTrigger>
                <TabsTrigger value="courses">
                  <Book className="mr-2 h-4 w-4" />
                  {t('Courses')}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="achievements" className="space-y-6">
                <Card className="transform-3d hover:element-3d">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="mr-2 h-5 w-5 text-yellow-500" />
                      {t('Recent Achievements')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="mr-4 h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <Award className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{t(`Achievement ${i}`)}</h4>
                            <p className="text-sm text-gray-500">{t('Earned 3 days ago')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="transform-3d hover:element-3d">
                  <CardHeader>
                    <CardTitle>{t('Learning Path')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex">
                          <div className="mr-4 flex flex-col items-center">
                            <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                              {i}
                            </div>
                            {i < 3 && <div className="h-full w-0.5 bg-gray-200 my-1"></div>}
                          </div>
                          <div className="pb-6">
                            <h4 className="font-medium">{t(`Milestone ${i}`)}</h4>
                            <p className="text-sm text-gray-500">{t(`Complete ${i * 10} study sessions`)}</p>
                            <Progress value={i * 33} className="h-2 mt-2 w-full max-w-xs" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('My Documents')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="w-10 h-10 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-medium">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="ml-3 flex-1">
                            <h4 className="text-sm font-medium">{t(`Document ${i}`)}</h4>
                            <p className="text-xs text-gray-500">{t('Updated 2 days ago')}</p>
                          </div>
                          <Button variant="outline" size="sm">{t('View')}</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="courses" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('Enrolled Courses')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map(i => (
                        <Card key={i}>
                          <CardContent className="p-4">
                            <div className="flex">
                              <div className="mr-4 w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-300 rounded flex items-center justify-center">
                                <Book className="h-8 w-8 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">{t(`Course ${i}`)}</h4>
                                <p className="text-sm text-gray-500">{t('Progress')}: {i * 20}%</p>
                                <Progress value={i * 20} className="h-2 mt-2 max-w-[150px]" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
