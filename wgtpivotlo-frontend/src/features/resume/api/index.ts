import { ErrorResponse } from '@/types';
import { backendURL } from '@/utils';
import { DownloadFileType } from '../types';

export const postResumeDownload = async () => {
  const res: DownloadFileType = {
    blob: undefined,
    file: undefined,
  };
  const url = backendURL + '/v1/resume/download';
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorBody = (await response.json()) as ErrorResponse; // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong'; // Extract the error message
    throw new Error(errorMessage); // Throw a new Error with the message
  }
  const blob = await response.blob();
  res.blob = blob;
  const file = new File([blob], 'resume.docx', {
    type: blob.type || 'application/octet-stream',
    lastModified: new Date().getTime(),
  });
  res.file = file;
  return res;
};
