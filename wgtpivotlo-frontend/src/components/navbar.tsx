import HomeIcon from '@/assets/WGTPivotLo.svg';
import { BlueAnchorLink } from '@/components/blue-anchor-link';
import { useAuth } from '@/features/auth/hook/useAuth';
import { Button } from './ui/button';
import { Profile } from './profile';
import { Link, useNavigate } from 'react-router-dom';
import { NavItemDropdown } from './navbar-dropdown';

export const Navbar = () => {
  const exploreMoreItems = [
    { label: 'Career', href: '/career' },
    { label: 'Learning Timeline', href: '/timeline' },
  ];

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      await navigate('/auth/login');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <nav className="flex h-[60px] w-full bg-white text-lg gap-2 drop-shadow-xl items-center justify-between px-3">
      <div className="flex gap-6 items-center">
        <Link to={'/'}>
          <img src={HomeIcon}></img>
        </Link>
        <BlueAnchorLink toPath={'questionaire'} name="questionaire" />
        <NavItemDropdown label="Explore" items={exploreMoreItems} />
        <BlueAnchorLink toPath={'resume'} name="resume" />
      </div>
      {isLoggedIn ? (
        <Profile />
      ) : (
        <Button
          onClick={(e) => {
            e.preventDefault();
            onClick().catch((error) => {
              console.error('Error in onClick:', error);
            });
          }}
          className="w-24 text-lg"
        >
          Login
        </Button>
      )}
    </nav>
  );
};
