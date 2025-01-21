import { capitalizeFirstChar } from '@/utils';
import { Link, To } from 'react-router-dom';

interface NavbarItemType {
  name: string;
  toPath: To;
}

export const BlueAnchorLink = ({ name, toPath }: NavbarItemType) => {
  return (
    <Link to={toPath}>
      <p className="text-blue-anchor hover:bg-accent hover:text-accent-foreground p-2 rounded-md">
        {capitalizeFirstChar(name)}
      </p>
    </Link>
  );
};
