import { useDownloadResume } from '@/features/resume/hooks/useDownloadResume';

export const DownloadResume = () => {
  const { file, blobUrl } = useDownloadResume();
  // const {isLoading} = downloadQuery;

  return (
    <div>
      DownloadResume
      {file && blobUrl && (
        <a href={blobUrl} download={file.name}>
          {' '}
          Download
        </a>
      )}
    </div>
  );
};
