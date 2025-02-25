import { CareerWithSimilarityScoreDTO } from '@/features/careers/types';
import { useCareers } from '@/features/careers/hooks/useCareers';
import { LoadingSpinnerComponent } from './loading-spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
// import { Progress } from './ui/progress';
import { capitalizeEveryFirstChar, capitalizeFirstChar } from '@/utils';
import stockItemImg from '@/assets/stock-item.png';

import React from 'react';
import { Button } from './ui/button';
import { HeartBadge } from './heart-badge';
import { Progress } from './ui/progress';

interface PreviewItemProps {
  item: CareerWithSimilarityScoreDTO;
  ref?: React.RefObject<HTMLDivElement> | null;
  heartBadgeOnClick?: (id: string) => Promise<void>;
  heartBadgeCheckedId?: string | null;
}

interface PreviewDialogProps {
  careerId: number;
}

export const PreviewItem = React.forwardRef<HTMLDivElement, PreviewItemProps>(
  ({ item, heartBadgeOnClick, heartBadgeCheckedId }, ref) => {
    const career = item.career;
    const similarityScore = Math.ceil(Number(item.similarityScore) * 100);

    return (
      <Card className="w-[332px] h-[410px] flex flex-col" ref={ref}>
        <img
          src={stockItemImg}
          alt={`${career.title} preview image`}
          width={332}
          height={200}
          className="w-full h-[100px] object-cover rounded-t-xl"
        />
        <div className="flex flex-col flex-grow">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xl font-bold leading-6 flex items-center justify-between">
              {capitalizeEveryFirstChar(career.title)}
              <HeartBadge
                variant="secondary"
                checked={heartBadgeCheckedId === item.career.careerId.toString()}
                onClick={() => {
                  heartBadgeOnClick?.(item.career.careerId.toString()).catch((err) => {
                    console.error('Error handling heart badge click:', err);
                  });
                }}
                text="Prefer"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex flex-col flex-grow">
            <div>
              <h2 className="font-medium mb-1">Match Score</h2>
              <Progress value={similarityScore} className="h-2" />
              <p className="text-sm text-muted-foreground mt-1">{similarityScore}% match</p>
            </div>
            <p className="text-sm text-muted-foreground leading-5 mb-auto h-full">
              {capitalizeFirstChar(career.responsibility)}
            </p>
            <div className="flex gap-2 flex-wrap mt-2">
              <Badge className="rounded-full">{capitalizeEveryFirstChar(career.sector)}</Badge>
              <Badge variant="outline" className="rounded-full">
                {career.careerLevel}
              </Badge>
            </div>
            <PreviewDialog careerId={career.careerId} />
          </CardContent>
        </div>
      </Card>
    );
  }
);

const PreviewDialog = ({ careerId }: PreviewDialogProps) => {
  const { careerQuery, careerWithSkills } = useCareers(careerId);
  if (careerQuery.isLoading) {
    return <LoadingSpinnerComponent />;
  }
  if (careerQuery.isSuccess && careerWithSkills !== undefined) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4 w-full">Learn More</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold leading-6">
              {capitalizeEveryFirstChar(careerWithSkills.title)}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Badge className="rounded-full col-span-2 flex justify-center cursor-default">
                {capitalizeEveryFirstChar(careerWithSkills.sector)}
              </Badge>
              <Badge variant="outline" className="rounded-full col-span-2 flex justify-center cursor-default">
                {careerWithSkills?.careerLevel}
              </Badge>
            </div>
            <div>
              <h2 className="font-medium mb-1">Responsibility</h2>
              <p className="text-sm">{capitalizeEveryFirstChar(careerWithSkills?.responsibility)}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Key Skills</h3>
              <ul className="list-disc list-inside text-sm">
                {careerWithSkills?.skillsWithProfiency.map((skill, index) => (
                  <li key={index}>
                    {capitalizeEveryFirstChar(skill.name)}, {skill.profiency}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
};
