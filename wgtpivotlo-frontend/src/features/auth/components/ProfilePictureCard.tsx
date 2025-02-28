import { useState, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { User } from 'lucide-react';
interface ProfilePlaceholderIconProps {
  className?: string;
  size?: number;
}

const ProfilePlaceholderIcon: React.FC<ProfilePlaceholderIconProps> = ({ className, size = 24 }) => {
  return (
    <div
      className={`rounded-full bg-muted flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <User size={size * 0.6} className="text-muted-foreground" />
    </div>
  );
};

export function ProfilePictureCard() {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    // Here you would typically upload the file to your server
    // For this example, we'll just show a success message
    toast.success('Submitted');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-40 h-40 mb-4 rounded-full border-2">
          {profilePicture ? (
            <img src={profilePicture} alt="Profile picture" className="object-fill w-full h-full rounded-full" />
          ) : (
            <ProfilePlaceholderIcon size={160} className="w-full h-full" />
          )}
        </div>
        <Input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
        <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
          Choose New Picture
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" className="border-2" onClick={() => setProfilePicture(null)}>
          Remove Picture
        </Button>
        <Button onClick={handleUpload}>Upload New Picture</Button>
      </CardFooter>
    </Card>
  );
}
