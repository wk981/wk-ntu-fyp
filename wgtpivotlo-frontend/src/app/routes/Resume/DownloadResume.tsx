import { LoadingSpinner } from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { useDownloadResume } from '@/features/resume/hooks/useDownloadResume';
import { useRef } from 'react';

export const DownloadResume = () => {
  const { isLoading, file, blobUrl } = useDownloadResume();
  const anchorRef = useRef<HTMLAnchorElement | null>(null);
  const handleClick = () => {
    if (anchorRef.current) {
      anchorRef.current.click();
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <section className="text-center space-y-5 bg-white rounded-lg md:px-12 px-4 py-8 md:py-12 border border-grey drop-shadow-lg">
        <h1 className="text-2xl md:text-4xl font-bold">Thank you for using WGTPivotLo!</h1>
        {isLoading === true ? (
          <div className="flex flex-col gap-6 items-center justify-center">
            <h2 className="text-[#505F98]">We are crafting a resume based on your skillsets now!</h2>
            <LoadingSpinner width={40} height={40} />
          </div>
        ) : (
          <>
            <h2 className="text-sm md:text-md text-[#505F98]">
              Your resume can be obtained by clicking the button below
            </h2>
            {file && blobUrl && (
              <Button onClick={handleClick}>
                Download Now
                <a className="hidden" href={blobUrl} download={file.name} ref={anchorRef}></a>
              </Button>
            )}
            <p className="text-sm text-gray-500 italic mt-8">
              Note: We've done our best to map skills to categories accurately. Thank you for understanding!
            </p>
          </>
        )}
      </section>
    </div>
  );
};
