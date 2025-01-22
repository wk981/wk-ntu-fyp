import landing from '@/assets/landing.svg';
import { HomeCard, HomeCardInterface } from '@/components/home-card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hook/useAuth';
import { useScrollToNextDiv } from '@/hook/useScrollToNextDiv';
import { useNavigate } from 'react-router-dom';

const landingCardObj: HomeCardInterface[] = [
  {
    icon: '🎯',
    title: 'Personalized Recommendations',
    description: 'Get career suggestions tailored to your unique profile and goals.',
  },
  {
    icon: '📊',
    title: 'Skill Gap Analysis',
    description: 'Identify the skills you need to acquire for your dream job.',
  },
  {
    icon: '📚',
    title: 'Learning Resources',
    description: 'Access curated courses and materials to support your career transition.',
  },
];

export const Landing = () => {
  const { sectionsRef } = useScrollToNextDiv();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const handleCLick = () => {
    if (isLoggedIn) {
      void navigate('/questionaire/upload');
    } else {
      void navigate('/auth/login');
    }
  };
  return (
    <div className="h-full max-w-[1280px] mx-auto">
      <div
        className="flex flex-col gap-6 sm:gap-8 md:gap-16 lg:gap-28 xl:gap-40 h-screen pt-28 items-center"
        ref={(el) => (sectionsRef.current[0] = el as HTMLDivElement)}
      >
        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-6xl text-[#091133] font-bold">Welcome to WGTPivotLo! </h1>
          <h2 className="text-xl italic">Your Personalized Career Pivot Solution</h2>
          <big className="text-2xl text-[#505F98] font-medium pt-4">
            WGTPivotLo helps you find new career opportunities with personalized recommendations based on your skills,
            preferences, and goals. Let us guide you through the evolving job market
          </big>
        </div>
        <img src={landing} className="w-[600px] h-[600px] object-contain"></img>
      </div>
      <div
        className="flex flex-col items-center pt-40 gap-24 h-screen px-4"
        ref={(el) => (sectionsRef.current[1] = el as HTMLDivElement)}
      >
        <div className="space-y-8 w-full flex items-center flex-col">
          <h3 className="text-3xl font-semibold text-center">Why Choose us?</h3>
          <div className="flex flex-col sm:flex-row items-center gap-5 w-[650px]">
            {landingCardObj.map((landingCard, index) => (
              <HomeCard
                key={index}
                icon={landingCard.icon}
                title={landingCard.title}
                description={landingCard.description}
              />
            ))}
          </div>
        </div>
        <div className="sm:w-[650px] ">
          <div className="bg-[#D7E8FF] w-full rounded-lg text-center p-6 py-6 space-y-5">
            <div className="space-y-2">
              <h4 className="text-3xl font-semibold">Ready to Start?</h4>
              <p className="text-xl">Join us and take your first step to your new career</p>
            </div>
            <Button size={'lg'} className="text-lg" onClick={handleCLick}>
              Click Here
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
