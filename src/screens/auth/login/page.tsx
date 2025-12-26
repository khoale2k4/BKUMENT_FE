"use client";
import { useState } from "react"; // Import useState
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { login, loginUser } from "@/lib/redux/features/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/button";
import AppleIcon from "@/components/icons/apple";
import GoogleIcon from "@/components/icons/google";
import { showToast } from "@/lib/redux/features/toastSlice";
import { API_ENDPOINTS } from "../../../lib/apiEndPoints";
import { AppRoute } from "@/lib/appRoutes";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { status } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const isReduxLoading = status === 'loading';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(loginUser({ username, password })).unwrap();

      dispatch(
        showToast({
          type: "success",
          title: "Success!",
          message: "Successfully logged in!",
        })
      );

      setTimeout(() => router.push(AppRoute.home), 1500);

    } catch (errorMsg) {
      console.error("Login failed:", errorMsg);
      dispatch(
        showToast({
          type: "error",
          title: "Login Failed",
          message: (errorMsg as string) || "Invalid credentials",
        })
      );
    }
  };

  const inputClassName = "text-gray-900 font-medium placeholder:text-gray-400";

  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 font-serif">
            Welcome back!
          </h1>
          <h2 className="text-2xl mb-8 text-gray-900 font-serif">
            Enter your Credentials to access your account
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Username / Email"
              type="text"
              placeholder="Enter your username"
              required
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              className={inputClassName}
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-900">
                  Password
                </label>

                <Link
                  href={AppRoute.forgot_password}
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Input
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className={inputClassName}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 rounded border-gray-300 text-[#3F5D38] focus:ring-[#3F5D38]"
                required
              />
              <label
                htmlFor="terms"
                className="text-xs font-semibold text-gray-900"
              >
                I agree to the{" "}
                <Link href="#" className="underline">
                  terms & policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="bg-[#3F5D38] hover:bg-[#2d4228] w-full"
              disabled={isReduxLoading}
            >
              {isReduxLoading ? "Logging in..." : "Login"}
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
            <Button
              variant="outline"
              type="button"
              className="flex items-center gap-2 font-semibold"
            >
              <GoogleIcon />
              Log in with Google
            </Button>
            <Button
              variant="outline"
              type="button"
              className="flex items-center gap-2 font-semibold"
            >
              <AppleIcon />
              Log in with Apple
            </Button>
          </div>

          <p className="mt-8 text-center text-sm font-semibold text-gray-900">
            Don't have an account?{" "}
            <Link href={AppRoute.register} className="text-blue-600 hover:underline">
              Sign Up
            </Link>
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
