import OnboardingPage from '@/screens/auth/onboarding/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Personalize your experience | VBook",
  description: "Select your interests to get started",
};

export default function OnboardingRoute() {
    return <OnboardingPage/>;
}
