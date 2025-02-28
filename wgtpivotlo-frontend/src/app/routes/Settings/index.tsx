import { ProfileForm } from '@/features/auth/components/ProfileForm';
import { SettingsLayout } from '@/features/auth/components/SettingsLayout';

export const AccountSettings = () => {
  return (
    <>
      <SettingsLayout title={'Account'} description="Update your account settings.">
        <ProfileForm />
      </SettingsLayout>
    </>
  );
};
