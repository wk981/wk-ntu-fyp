import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useCareers } from '../hooks/useCareers';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { capitalizeEveryFirstChar } from '@/utils';
import { Badge } from '@/components/ui/badge';

interface PreviewDialogProps {
  careerId: number;
}

export const CareerDialog = ({ careerId }: PreviewDialogProps) => {
  const { careerQuery, careerWithSkills, refetch } = useCareers(careerId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4 w-full" onClick={() => void refetch()}>
          Learn More
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold leading-6">
            {careerWithSkills ? capitalizeEveryFirstChar(careerWithSkills.title) : 'Loading...'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {careerQuery.isLoading && <LoadingSpinnerComponent />}
          {careerQuery.isError && <div>Error loading career data.</div>}
          {careerWithSkills && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Badge className="rounded-full col-span-2 flex justify-center cursor-default">
                  {capitalizeEveryFirstChar(careerWithSkills.sector)}
                </Badge>
                <Badge variant="outline" className="rounded-full col-span-2 flex justify-center cursor-default">
                  {careerWithSkills.careerLevel}
                </Badge>
              </div>
              <div>
                <h2 className="font-medium mb-1">Responsibility</h2>
                <p className="text-sm">{capitalizeEveryFirstChar(careerWithSkills.responsibility)}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Key Skills</h3>
                <ul className="list-disc list-inside text-sm">
                  {careerWithSkills.skillsWithProfiency.map((skill, index) => (
                    <li key={index}>
                      {capitalizeEveryFirstChar(skill.name)}, {skill.profiency}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
