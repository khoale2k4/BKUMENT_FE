import { Metadata } from 'next';
import OnboardingPage from '@/screens/onboarding/page';

export const metadata: Metadata = {
  title: "Home | VBook",
  description: "Social media for education",
};

export default function HomeApp() {
  return (
    <OnboardingPage/>
  );
}