import RegisterPage from '@/pages/auth/register/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "SignUp | VBook",
//   description: "Social media for education",
};

export default function LoginApp() {
    return <RegisterPage/>;
}