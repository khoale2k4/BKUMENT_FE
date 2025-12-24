'use client';
import { useAppDispatch } from '@/lib/redux/hooks';
import { login } from '@/lib/redux/features/authSlice'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/text_input';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(login({ name: 'New User', email: 'user@example.com' }));
        console.log("sussesfully signup");
        router.push('/');
    };

    return (
        <div className="min-h-screen flex bg-white">
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
                <div className="w-full max-w-md">
                    <h1 className="text-4xl font-bold mb-8 text-gray-900 font-serif">Get Started Now</h1>

                    <form onSubmit={handleSignup} className="space-y-5">
                        <Input
                            label="Name"
                            type="text"
                            placeholder="Enter your name"
                            required
                        />

                        <Input
                            label="Email address"
                            type="email"
                            placeholder="Enter your email"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Name" 
                            required
                        />

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
                            Signup
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
                            Sign in with Google
                        </Button>
                        <Button variant="outline" type="button" className="flex items-center gap-2 font-semibold">
                            <AppleIcon />
                            Sign in with Apple
                        </Button>
                    </div>

                    <p className="mt-8 text-center text-sm font-semibold text-gray-900">
                        Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Sign In</Link>
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

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
            </g>
        </svg>
    );
}

function AppleIcon() {
    return (
        <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.636 7.64c.267-.624.41-1.3.41-2.004 0-1.285-.503-2.496-1.408-3.402C14.733 1.33 13.522.826 12.237.826c-.168 0-.337.008-.504.025-.566.057-1.127.234-1.637.525-.098.056-.192.115-.285.176l-.014.01-.014-.01c-.092-.06-.187-.12-.284-.175-.51-.292-1.07-.47-1.637-.526-.167-.017-.336-.025-.504-.025-1.285 0-2.496.503-3.402 1.408C3.053 3.14 2.55 4.35 2.55 5.636c0 .17.009.338.026.505.05.502.188 1.002.417 1.498l.004.01.006.012c.79 1.765 2.51 3.25 4.417 3.99.04.015.08.03.118.046.883.33 1.833.504 2.784.504s1.9-.174 2.783-.505c.04-.015.08-.03.12-.046 1.905-.74 3.626-2.225 4.416-3.99l.006-.012.004-.01z" fill="black" />
        </svg>
    );
}