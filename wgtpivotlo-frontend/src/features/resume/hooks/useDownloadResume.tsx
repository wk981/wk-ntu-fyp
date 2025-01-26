import { useQuery } from '@tanstack/react-query';
import { postResumeDownload } from '../api';
import { useEffect, useRef, useState } from 'react';

export const useDownloadResume = () => {
  const [blobUrl, setBlobUrl] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | undefined>(undefined);
  const lastBlobUrl = useRef<string | null>(null);
  const downloadQuery = useQuery({
    queryKey: ['download-file'],
    queryFn: postResumeDownload,
  });

  useEffect(() => {
    if (downloadQuery.isSuccess && downloadQuery.data?.blob) {
      const newBlobUrl = window.URL.createObjectURL(downloadQuery.data.blob);
      setBlobUrl(newBlobUrl);
      lastBlobUrl.current = newBlobUrl; // Track the last Blob URL
    }
    if (downloadQuery.isSuccess && downloadQuery.data?.file) {
      setFile(downloadQuery.data.file);
    }

    return () => {
      if (lastBlobUrl.current) {
        window.URL.revokeObjectURL(lastBlobUrl.current); // clear url to free up memory
        lastBlobUrl.current = null; // Clear the ref
      }
    };
  }, [downloadQuery.isSuccess, downloadQuery.data]);

  return { isLoading: downloadQuery.isLoading, file, blobUrl };
};
