import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { capitalizeEveryFirstChar, capitalizeFirstChar } from '@/utils';
import stockItemImg from '@/assets/stock-item.png';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { useCareers } from '@/features/careers/hooks/useCareers';
import { LoadingSpinner } from './loading-spinner';
import { CareerWithSimilarityScoreDTO } from '@/features/careers/types';
import { ArrowLeft } from 'lucide-react';
import useInViewPort from '@/hook/useInViewPort';
import React, { useEffect } from 'react';

interface PreviewProps extends PreviewListProps {
  category: string;
  onClick: (category: string) => Promise<void>;
  backButtonOnClick: () => void;
  back?: boolean;
  seeMore?: boolean;
  layout?: 'flex' | 'grid';
}

interface PreviewListProps {
  data: CareerWithSimilarityScoreDTO[];
  intersectionAction?: () => void;
  layout?: 'flex' | 'grid';
}

interface PreviewItemProps {
  item: CareerWithSimilarityScoreDTO;
  ref?: React.RefObject<HTMLDivElement> | null;
}

interface PreviewDialogProps {
  careerId: number;
}

const previewTitleMap: { [key: string]: string } = {
  aspiration: 'Career Matches Based on Aspirations',
  pathway: 'Career Pathway Recommendations',
  direct: 'Direct Career Suggestions',
};

export const Preview = ({
  category,
  data,
  onClick,
  backButtonOnClick,
  intersectionAction,
  back = false,
  seeMore = true,
  layout = 'flex',
}: PreviewProps) => {
  // eslint-disable-next-line no-unused-vars
  return (
    <div className="w-full">
      <div className={`flex ${seeMore ? 'justify-between' : 'gap-16'} items-center`}>
        {back && (
          <Button onClick={() => backButtonOnClick()} aria-label="Go back" className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h1 className="text-lg font-bold mb-2">{previewTitleMap[category]}</h1>
        {seeMore && (
          <p
            className="cursor-pointer text-blue-anchor hover:text-blue-800 transition-colors"
            onClick={() => {
              onClick(category).catch((error) => console.log(error));
            }}
          >
            See More
          </p>
        )}
      </div>
      <PreviewList data={data} layout={layout} intersectionAction={intersectionAction} />
    </div>
  );
};

const PreviewList = ({ data, intersectionAction, layout = 'flex' }: PreviewListProps) => {
  const { inViewport, targetRef } = useInViewPort();

  useEffect(() => {
    if (intersectionAction && inViewport) {
      intersectionAction(); // Call the function if it exists
    }
  }, [intersectionAction, inViewport]); // Dependency array includes the function prop

  return (
    <ScrollArea className="w-full pb-4">
      <div
        className={`${
          layout === 'flex'
            ? 'flex flex-col md:flex-row items-center gap-4'
            : 'grid grid-cols-[repeat(auto-fit,minmax(332px,332px))] items-center justify-center'
        } gap-4 `}
      >
        {Array.isArray(data) &&
          data.map((d, index) => (
            <PreviewItem key={index} item={d} ref={data.length === index + 1 && layout === 'grid' ? targetRef : null} />
          ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

const PreviewItem = React.forwardRef<HTMLDivElement, PreviewItemProps>(({ item }, ref) => {
  const career = item.career;
  const similarityScore = Number(item.similarityScore) * 100;

  return (
    <Card className="w-[332px] min-h-[360px] flex flex-col" ref={ref}>
      <img
        src={stockItemImg}
        alt={`${career.title} preview image`}
        width={332}
        height={200}
        className="w-full h-[100px] object-cover rounded-t-xl"
      />
      <div className="flex flex-col flex-grow">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xl font-bold leading-6">{capitalizeEveryFirstChar(career.title)}</CardTitle>
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
});

const PreviewDialog = ({ careerId }: PreviewDialogProps) => {
  const { careerQuery, careerWithSkills } = useCareers(careerId);
  if (careerQuery.isLoading) {
    return <LoadingSpinner />;
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
