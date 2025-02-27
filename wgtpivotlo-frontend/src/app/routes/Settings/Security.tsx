import { ChangePasswordForm } from '@/features/auth/components/ChangePasswordForm';
import { SettingsLayout } from '@/features/auth/components/SettingsLayout';
export const Security = () => {
  return (
    <>
      <SettingsLayout title={'Account'} description="Update your account settings.">
        <ChangePasswordForm />
      </SettingsLayout>
    </>
  );
};
