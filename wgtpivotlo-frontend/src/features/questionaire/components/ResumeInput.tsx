import { useState, useRef, type DragEvent } from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileIcon, UploadIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useUploadResume } from '../hook/useUploadResume';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useQuestionaire } from '../hook/useQuestionaire';

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  'application/vnd.ms-word.document.macroEnabled.12',
  'application/vnd.ms-word.template.macroEnabled.12',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ResumeInput = () => {
  const { setUserSkillsList } = useQuestionaire();
  const { uploadResumeMutation } = useUploadResume();
  const { isPending, mutateAsync, isError, error: mutationError } = uploadResumeMutation;
  const [file, setFile] = useState<File | undefined>();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload a PDF or Word document.');
      toast.error('Invalid file type. Please upload a PDF or Word document.');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum size is 5MB.');
      toast.error('File is too large. Maximum size is 5MB.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    try {
      if (file) {
        // Implement your upload logic here
        toast.info('Uploading file:' + file.name);
        const skillsDTOList = await mutateAsync(file);
        if (isError) {
          setError(mutationError.message);
        }
        skillsDTOList.map((skillsDTO) => {
          setUserSkillsList((prev) => [
            ...prev,
            {
              name: skillsDTO.name,
              description: skillsDTO.description,
              profiency: 'Beginner',
              pic: skillsDTO.pic,
              skillId: skillsDTO.skillId,
            },
          ]);
        });
        // Reset the file state after successful upload
        setFile(undefined);
        await navigate('/questionaire/questions');
      } else {
        setError('Please upload a file first');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSkip = () => {
    void navigate('/questionaire/questions');
  };
  return (
    <Card className={`w-full max-w-md mx-auto ${isPending ? 'opacity-50 relative' : ''}`}>
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <LoadingSpinner />
        </div>
      )}
      <CardContent className="p-6 space-y-4">
        <div
          className={`border-2 h-[250px] border-dashed rounded-lg flex flex-col gap-1 p-6 items-center justify-center cursor-pointer transition-colors ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <FileIcon className={`w-12 h-12 ${error ? 'text-red-500' : 'text-gray-400'}`} />
          <span className={`text-sm font-medium text-center ${error ? 'text-red-500' : 'text-gray-500'}`}>
            {error || 'Drag and drop a file or click to browse'}
          </span>
          <span className="text-xs text-gray-500">PDF, DOC, DOCX, DOTX, DOTM, or DOCM (Max 5MB)</span>
        </div>
        <div className="space-y-2 text-sm">
          <Label htmlFor="file" className="text-sm font-medium">
            File
          </Label>
          <input
            ref={fileInputRef}
            type="file"
            id="file"
            className="hidden"
            accept=".doc,.docx,.dotx,.dotm,.pdf,.docm"
            onChange={handleFileChange}
          />
          <div className="flex gap-5 items-center border-2 rounded-lg border-accent px-4 py-2">
            <Button size="sm" onClick={() => fileInputRef.current?.click()}>
              Choose File
            </Button>
            <span className="text-sm text-gray-600 truncate">{file ? file.name : 'No file uploaded'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button size="lg" variant={'destructive'} className="w-[100px]" onClick={handleSkip}>
          Skip
        </Button>
        <Button size="lg" className="w-full" onClick={() => void handleUpload()} disabled={!file}>
          <UploadIcon className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </CardFooter>
    </Card>
  );
};
