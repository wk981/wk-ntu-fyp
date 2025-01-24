import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hook/useAuth';

export const FirstTimeUserDialog = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    if (user && isLoggedIn && !user.isCareerPreferenceSet) {
      setOpen(true);
    }
  }, [user, isLoggedIn]);

  return (
    <Dialog open={open}>
      <DialogContent className="[&>button:last-child]:hidden">
        <DialogHeader>
          <DialogTitle>First Time User</DialogTitle>
          <DialogDescription className="leading-tight mt-8">
            Look like you have not set a career preference yet, please complete the questionaire to continue.
          </DialogDescription>
        </DialogHeader>
        <Button
          className="mt-5"
          onClick={() => {
            void navigate('/questionaire/upload');
            setOpen(false);
          }}
        >
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
};
