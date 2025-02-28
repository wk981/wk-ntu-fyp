import { useContext } from 'react';
import { EditAccountContext } from '../provider/EditAccountSettingsProvider';

// Create a custom hook to use the context
export const useEditAccountSettings = () => {
  const context = useContext(EditAccountContext);
  if (context === undefined) {
    throw new Error('useEditAccountContext must be used within a MyProvider');
  }
  return context;
};
