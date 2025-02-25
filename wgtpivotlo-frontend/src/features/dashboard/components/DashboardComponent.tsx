import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardQuery } from '../hook/useDashboardQuery';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { capitalizeEveryFirstChar, capitalizeFirstChar } from '@/utils';
import { ProgressCircle } from './ProgressCircle';
import { SkillsToImproveProgressItem } from './SkillsToImproveProgressItem';
import { LoadingSpinnerWrapper } from '@/components/loading-spinner';
import { BadgeWithTooltip } from '@/components/BadgeWithPopUpInfo';

export const DashboardComponent = () => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Profile */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <Avatar className="h-[100px] w-[100px] my-4">
              <AvatarImage src={avatarImage} alt={dashboardData?.username} />
              <AvatarFallback>{dashboardData?.username && capitalizeFirstChar(dashboardData?.username)}</AvatarFallback>
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

        {/* Skills to Improve */}
        <Card className="col-span-1 md:col-span-2">
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
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Current Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-60 overflow-y-auto">
              {dashboardData?.userSkills.map((skill, index) => (
                <BadgeWithTooltip key={index} badgeStyle={{className: "h-[40px] rounded-full py-2 px-4 mx-1 my-1 text-sm"}} text={capitalizeEveryFirstChar(skill.name)} tooltipContent={capitalizeEveryFirstChar(skill.profiency)}/>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
};
