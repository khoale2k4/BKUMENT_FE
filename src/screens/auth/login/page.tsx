"use client";
import { useState } from "react"; // Import useState
import { useAppDispatch } from "@/lib/redux/hooks";
import { login } from "@/lib/redux/features/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";
import AppleIcon from "@/components/icons/apple";
import GoogleIcon from "@/components/icons/google";
import { showToast } from "@/lib/redux/features/toastSlice";
import { API_ENDPOINTS } from "../../../lib/apiEndPoints";
import { AppRoute } from "@/lib/appRoutes";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const inputClassName = "text-gray-900 font-medium placeholder:text-gray-400";
  // 1. State for form inputs and loading status
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      // 2. Make the API request
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      console.log("response", response);

      const data = await response.json();
      console.log("data", data);

      // 3. Check for success code 1000
      if (data.code === 1000) {
        // Dispatch login to Redux (saving token and username)
        // Note: You might need to update your authSlice to accept a 'token'
        dispatch(
          login({
            name: username,
            email: username,
            token: data.result.token,
          })
        );

        dispatch(
          showToast({
            type: "success",
            title: "Success!",
            message: "Successfully logged in!",
          })
        );

        // Redirect after a short delay
        setTimeout(() => router.push("/home"), 1500);
      } else {
        // Handle API specific errors (e.g., wrong password)
        dispatch(
          showToast({
            type: "error",
            title: "Login Failed",
            message: data.message || "Invalid credentials",
          })
        );
      }
    } catch (error) {
      // Handle network errors
      console.error("Login error:", error);
      dispatch(
        showToast({
          type: "error",
          title: "Error",
          message: "Something went wrong. Please try again.",
        })
      );
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

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
            {/* Username Input */}
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

              {/* Password Input */}
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

            {/* Submit Button with Loading State */}
            <Button
              type="submit"
              className="bg-[#3F5D38] hover:bg-[#2d4228] w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
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
