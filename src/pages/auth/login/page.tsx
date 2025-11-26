'use client';
import { useAppDispatch } from '@/lib/redux/hooks';
import { login } from '@/lib/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/text_input';
import { Button } from '@/components/ui/button';
import AppleIcon from '@/components/icons/apple';
import GoogleIcon from '@/components/icons/google';
import { showToast } from '@/lib/redux/features/toastSlice';

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(login({ name: 'New User', email: 'user@example.com' }));

        dispatch(showToast({
            type: 'success',
            title: 'Success!',
            message: 'Successfully login!'
        }));

        setTimeout(() => router.push('/'), 1500);
    };

    const toSignUp = () => {
        router.push('/register');
    }

    return (
        <div className="min-h-screen flex bg-white">
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
                <div className="w-full max-w-md">
                    <h1 className="text-4xl font-bold mb-8 text-gray-900 font-serif">Wellcome back!</h1>
                    <h2 className="text-2xl mb-8 text-gray-900 font-serif">Enter your Credentials to access your account</h2>

                    <form onSubmit={handleSignup} className="space-y-5">
                        <Input
                            label="Email address"
                            type="email"
                            placeholder="Enter your email"
                            required
                        />

                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-gray-900">
                                    Password
                                </label>

                                <Link href="/forgot-password" className="text-sm text-blue-600 font-medium hover:underline">
                                    Forgot password?
                                </Link>
                            </div>

                            <Input
                                type="password"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="terms"
                                className="w-4 h-4 rounded border-gray-300 text-[#3F5D38] focus:ring-[#3F5D38]"
                                required
                            />
                            <label htmlFor="terms" className="text-xs font-semibold text-gray-900">
                                I agree to the <Link href="#" className="underline">terms & policy</Link>
                            </label>
                        </div>

                        <Button type="submit" className="bg-[#3F5D38] hover:bg-[#2d4228]">
                            Login
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-900 font-bold">Or</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" type="button" className="flex items-center gap-2 font-semibold">
                            <GoogleIcon />
                            Log in with Google
                        </Button>
                        <Button variant="outline" type="button" className="flex items-center gap-2 font-semibold">
                            <AppleIcon />
                            Log in with Apple
                        </Button>
                    </div>

                    <p className="mt-8 text-center text-sm font-semibold text-gray-900">
                        Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Sign Up</Link>
                    </p>
                </div>
            </div>

            <div className="hidden lg:block w-1/2 relative overflow-hidden">
                <img
                    src="/svgs/login_background.svg"
                    alt="Decoration"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
            </div>
        </div>
    );
}