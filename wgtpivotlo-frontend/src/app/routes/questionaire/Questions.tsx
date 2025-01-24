import { LoadingSpinner } from '@/components/loading-spinner';
import { Card } from '@/components/ui/card';
import { QuestionForm } from '@/features/questionaire/components/QuestionForm';
import { useQuestionaire } from '@/features/questionaire/hook/useQuestionaire';

export const Questions = () => {
  const { resultPostMutation } = useQuestionaire();
  const { isPending } = resultPostMutation;
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6 sm:py-12 min-h-[calc(100vh-65px)]">
      <Card className={`w-full max-w-md mx-auto py-9 ${isPending ? 'opacity-50 relative' : ''}`}>
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
            <LoadingSpinner />
          </div>
        )}
        <QuestionForm />
      </Card>
    </div>
  );
};
