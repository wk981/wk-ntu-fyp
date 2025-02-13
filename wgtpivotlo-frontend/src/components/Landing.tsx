import landing from '@/assets/landing.svg';
import { HomeCard, HomeCardInterface } from '@/components/home-card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hook/useAuth';
import { useEffect } from 'react';
// import { useScrollToNextDiv } from '@/hook/useScrollToNextDiv';
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
  // const { sectionsRef } = useScrollToNextDiv();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const handleCLick = () => {
    if (isLoggedIn) {
      void navigate('/questionaire/upload');
    } else {
      void navigate('/auth/login');
    }
  };
  useEffect(() => {
    if (isLoggedIn && user?.isCareerPreferenceSet) {
      void navigate('/dashboard');
    }
  }, [isLoggedIn, navigate, user?.isCareerPreferenceSet]);
  return (
    <div className="relative flex flex-col gap-8 md:gap-16 max-w-[1280px] w-full mx-auto px-4 min-h-screen overflow-y-auto">
      <section className="flex flex-col gap-8 md:gap-16 items-center pt-8 md:pt-16">
        <div className="flex flex-col gap-4 md:gap-6 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl text-[#091133] font-bold">Welcome to WGTPivotLo!</h1>
          <h2 className="text-lg md:text-xl italic">Your Personalized Career Pivot Solution</h2>
          <p className="text-sm md:text-lg lg:text-xl leading-5 text-[#505F98] font-medium md:pt-4">
            WGTPivotLo helps you find new career opportunities with personalized recommendations based on your skills,
            preferences, and goals. Let us guide you through the evolving job market.
          </p>
        </div>
        <img
          src={landing || '/placeholder.svg'}
          alt="Landing illustration"
          className="w-full max-w-[600px] h-auto object-contain"
          width={600}
          height={600}
        />
      </section>
      <section className="flex flex-col items-center gap-12 md:gap-24 px-4 py-8 md:py-16">
        <div className="space-y-8 w-full flex items-center flex-col">
          <h3 className="text-2xl md:text-3xl font-semibold text-center">Why Choose Us?</h3>
          <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-[650px]">
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
        <div className="w-full max-w-[650px]">
          <div className="bg-[#D7E8FF] w-full rounded-lg text-center p-6 space-y-5">
            <div className="space-y-2">
              <h4 className="text-2xl md:text-3xl font-semibold">Ready to Start?</h4>
              <p className="text-base md:text-lg">Join us and take your first step to your new career</p>
            </div>
            <Button size="lg" className="text-base md:text-lg" onClick={handleCLick}>
              Click Here
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
