import { Outlet } from 'react-router-dom';
import { AdminCareerProvider } from '../../context/AdminCareerProvider';

export const AdminProvidersWrapper = () => {
  return (
    <>
      <AdminCareerProvider>
        <Outlet />
      </AdminCareerProvider>
    </>
  );
};
