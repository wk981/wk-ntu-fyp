import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hook/useAuth';

export const FirstTimeUserDialog = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (
      user &&
      !user.isCareerPreferenceSet && // User hasn't set career preference
      !location.pathname.startsWith('/questionaire') && // Not already on the questionnaire page
      !user.role.some((role) => ['ROLE_ADMIN'].includes(role)) // User is NOT an admin
    ) {
      setOpen(true); // THEN open the modal/dialog/etc.
    }
  }, [user, location.pathname]);

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
