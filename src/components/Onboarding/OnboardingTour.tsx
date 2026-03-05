import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { X, ChevronLeft, ChevronRight, BookOpen, BarChart3, User, Shield, Moon, Sun } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  target?: string;
}

const steps: OnboardingStep[] = [
  {
    title: 'Welcome to Endless Story Engine',
    description: 'Experience a fully deterministic, infinitely scalable narrative platform following Kael\'s journey across two merging worlds - the real world and the VR realm.',
    icon: <BookOpen className="w-12 h-12 text-blue-500" />,
  },
  {
    title: 'Immerse Yourself in the Story',
    description: 'Read chapters with our distraction-free reading interface. Customize font size, line height, and choose from multiple reading modes for the perfect experience.',
    icon: <BookOpen className="w-12 h-12 text-green-500" />,
    target: '/read',
  },
  {
    title: 'Track Character Progress',
    description: 'Monitor 23 character stats including Core Stats, Primary Attributes, Vampire Traits, Combat Stats, and Resources. Watch Kael grow stronger with each chapter.',
    icon: <BarChart3 className="w-12 h-12 text-purple-500" />,
    target: '/stats',
  },
  {
    title: 'Your Personal Dashboard',
    description: 'Track your reading progress, maintain streaks, and access your personalized content. Your journey is saved automatically.',
    icon: <User className="w-12 h-12 text-orange-500" />,
    target: '/dashboard',
  },
  {
    title: 'Dark Mode Support',
    description: 'Switch between light and dark themes for comfortable reading in any environment. Your preference is saved automatically.',
    icon: <Moon className="w-12 h-12 text-indigo-500" />,
  },
  {
    title: 'Admin Control Panel',
    description: 'Access the command box for NLP-powered controls, manage story generation, and monitor system health. Admin users can pause, adjust speed, and fine-tune narrative elements.',
    icon: <Shield className="w-12 h-12 text-red-500" />,
    target: '/admin',
  },
];

const OnboardingTour = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    if (!hasCompletedOnboarding) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 pt-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep
                  ? 'bg-blue-500'
                  : index < currentStep
                  ? 'bg-blue-300 dark:bg-blue-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            {step.icon}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {step.title}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentStep === 0
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={handleSkip}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm transition-colors"
          >
            Skip tour
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;