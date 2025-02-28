import { ChangePasswordForm } from '@/features/auth/components/ChangePasswordForm';
import { SettingsLayout } from '@/features/auth/components/SettingsLayout';
export const Security = () => {
  return (
    <>
      <SettingsLayout title={'Security'} description="Update your account security.">
        <ChangePasswordForm />
      </SettingsLayout>
    </>
  );
};
