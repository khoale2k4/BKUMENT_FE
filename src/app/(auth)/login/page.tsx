import LoginPage from '@/pages/auth/login/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Login | VBook",
//   description: "Social media for education",
};

export default function LoginApp() {
    return <LoginPage/>;
}