import React from 'react';
import { PreviewItemProps } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import stockItemImg from '@/assets/stock-item.png';
import { capitalizeEveryFirstChar, capitalizeFirstChar } from '@/utils';
import { HeartBadge } from '@/components/heart-badge';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CareerDialog } from './career-dialog';

export const CareerCard = React.forwardRef<HTMLDivElement, PreviewItemProps>(
  ({ item, heartBadgeOnClick, heartBadgeCheckedId }, ref) => {
    const career = item.career;
    const similarityScore = Math.ceil(Number(item.similarityScore) * 100);

    return (
      <Card
        className="overflow-hidden h-auto flex flex-col flex-grow flex-1 transition-all duration-200 hover:shadow-md"
        ref={ref}
      >
        <img
          src={stockItemImg}
          alt={`${career.title} preview image`}
          width={332}
          height={200}
          className="w-full h-[100px] object-cover rounded-t-xl"
        />
        <div className="flex flex-col flex-grow">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xl font-semibold leading-6 flex items-center justify-between">
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
              <h2 className="font-medium text-sm mb-1">Match Score</h2>
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
            <CareerDialog careerId={career.careerId} />
          </CardContent>
        </div>
      </Card>
    );
  }
);
