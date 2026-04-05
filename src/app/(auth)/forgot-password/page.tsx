import ForgotPasswordPage from '@/screens/auth/forgotPassword/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Login | VBook",
//   description: "Social media for education",
};

export default function LoginApp() {
   return <ForgotPasswordPage/>;
}