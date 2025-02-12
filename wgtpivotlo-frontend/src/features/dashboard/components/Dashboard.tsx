import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BookOpen, GraduationCap, Trophy } from 'lucide-react';
import { useDashboardQuery } from '../hook/useDashboardQuery';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { capitalizeEveryFirstChar, capitalizeFirstChar } from '@/utils';
import { ProgressCircle } from './ProgressCircle';
import { SkillsToImproveProgressItem } from './SkillsToImproveProgressItem';
import { LoadingSpinnerWrapper } from '@/components/loading-spinner';

export const Dashboard = () => {
  const { dashboardData, isDashBoardSuccess, isDashboardLoading } = useDashboardQuery();
  const avatarImage = dashboardData?.pic || 'https://github.com/shadcn.png';
  if (isDashboardLoading) {
    return (
      <div className="min-h-[calc(100vh-65px)]">
        <LoadingSpinnerWrapper width={50} height={50}>
          <h1 className="mt-2 text-xl">Fetching your information</h1>
        </LoadingSpinnerWrapper>
      </div>
    );
  } else if (isDashBoardSuccess && dashboardData) {
    return (
      <div className="container py-4 max-w-[1280px] w-full mx-auto px-4 min-h-[calc(100vh-65px)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <Avatar className="h-[100px] w-[100px] my-4">
                <AvatarImage src={avatarImage} alt={dashboardData?.username} />
                <AvatarFallback>
                  {dashboardData?.username && capitalizeFirstChar(dashboardData?.username)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">
                {dashboardData?.username && capitalizeFirstChar(dashboardData?.username)}
              </h2>
              <p className="text-muted-foreground">
                Aspiring {dashboardData?.career.title && capitalizeEveryFirstChar(dashboardData?.career.title)}
              </p>
            </CardContent>
          </Card>

          {/* Progress Circle */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ProgressCircle percentage={Math.ceil(dashboardData?.careerProgression * 100)} />
            </CardContent>
          </Card>

          {/* Quick Access */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Learning Path</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Achievements</span>
                </li>
                <li className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>Certifications</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Skills Assessment</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Skills to Improve */}
          <Card className="col-span-1 md:col-span-3">
            <CardHeader>
              <CardTitle>Skills to Improve</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {dashboardData?.skillGap.map((skill, index) => {
                  if (skill.skillFlow[0] !== skill.skillFlow[skill.skillFlow.length - 1]) {
                    return (
                      <li key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{capitalizeEveryFirstChar(skill.skillDTO.name)}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {skill.skillFlow[0]} → {skill.skillFlow[skill.skillFlow.length - 1]}
                          </span>
                        </div>
                        <SkillsToImproveProgressItem skillFlowList={skill.skillFlow} />
                      </li>
                    );
                  }
                  return null; // Ensures no undefined elements in the list
                })}
              </ul>
            </CardContent>
          </Card>

          {/* Current Skills */}
          <Card className="col-span-1 md:col-span-3">
            <CardHeader>
              <CardTitle>Current Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-60 overflow-y-auto">
                {dashboardData?.userSkills.map((skill, index) => (
                  <Badge key={index} className="h-[40px] rounded-full py-2 px-4 mx-1 my-1 text-sm">
                    {capitalizeEveryFirstChar(skill.name)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Completed Advanced JavaScript Course</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Built First React Application</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Contributed to Open Source Project</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Recommended Courses */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recommended Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-sm">Advanced React Patterns</li>
                <li className="text-sm">Node.js Microservices</li>
                <li className="text-sm">GraphQL Mastery</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
};
