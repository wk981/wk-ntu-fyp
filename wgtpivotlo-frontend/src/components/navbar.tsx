import HomeIcon from '@/assets/WGTPivotLo.svg';
import { BlueAnchorLink } from '@/components/blue-anchor-link';
import { useAuth } from '@/features/auth/hook/useAuth';
import { Button } from './ui/button';
import { Profile } from './profile';
import { Link, useNavigate } from 'react-router-dom';
import { NavItemDropdown } from './navbar-dropdown';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const exploreMoreItems = [
  { label: 'Career', href: '/career' },
  { label: 'Learning Timeline', href: '/timeline' },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

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
    <nav className="h-[65px] sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={'/'}>
              <img src={HomeIcon}></img>{' '}
            </Link>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <BlueAnchorLink toPath="questionaire/upload" name="Questionnaire" />
                <NavItemDropdown label="Explore" items={exploreMoreItems} />
                <BlueAnchorLink toPath="resume" name="Resume" />
              </div>
            </div>
            <div className="md:hidden">
              <Button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                variant="ghost"
                size="icon"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>

          <div>
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
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 z-50 bg-white border ">
            <BlueAnchorLink toPath="questionaire/upload" name="Questionnaire" />
            <NavItemDropdown label="Explore" items={exploreMoreItems} />
            <BlueAnchorLink toPath="resume" name="Resume" />
          </div>
        </div>
      )}
    </nav>
  );
};
