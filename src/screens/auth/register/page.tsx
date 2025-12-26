"use client";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { registerUser } from "@/lib/redux/features/authSlice"; 
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/redux/features/toastSlice";
import GoogleIcon from "@/components/icons/google";
import AppleIcon from "@/components/icons/apple";
import { AppRoute } from "@/lib/appRoutes";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { status } = useAppSelector((state) => state.auth);
  const isReduxLoading = status === 'loading';

  const inputClassName = "text-gray-900 font-medium placeholder:text-gray-400";
  
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    university: "",
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.firstName &&
      formData.lastName &&
      formData.dob &&
      formData.university
    ) {
      setStep(2);
    } else {
      dispatch(
        showToast({
          type: "error",
          title: "Missing Info",
          message: "Please fill in all fields.",
        })
      );
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      account: {
        username: formData.username,
        password: formData.password,
        role: "STUDENT",
      },
      firstName: formData.firstName,
      lastName: formData.lastName,
      dob: formData.dob,
      university: formData.university,
    };

    try {
      await dispatch(registerUser(payload)).unwrap();

      dispatch(
        showToast({
          type: "success",
          title: "Registration Successful!",
          message: "Account created. Redirecting to login...",
        })
      );

      setTimeout(() => router.push(AppRoute.login), 1500);

    } catch (errorMsg) {
      console.error("Register error:", errorMsg);
      dispatch(
        showToast({
          type: "error",
          title: "Registration Failed",
          message: (errorMsg as string) || "Could not create account",
        })
      );
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 font-serif">
            Create Account
          </h1>
          <p className="text-gray-900 mb-8">
            Step {step} of 2: {step === 1 ? "Personal Info" : "Account Setup"}
          </p>

          <form
            onSubmit={step === 1 ? handleNextStep : handleSignUp}
            className="space-y-5"
          >
            {/* --- STEP 1: Personal Information --- */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={inputClassName}
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className={inputClassName}
                  />
                </div>

                <Input
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                />

                <Input
                  label="University"
                  name="university"
                  type="text"
                  placeholder="University"
                  value={formData.university}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                />

                <Button
                  type="submit"
                  className="bg-[#3F5D38] hover:bg-[#2d4228] w-full"
                >
                  Next
                </Button>
              </>
            )}

            {/* --- STEP 2: Account Information --- */}
            {step === 2 && (
              <>
                <Input
                  label="Username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                />

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

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-1/3"
                    onClick={handlePrevStep}
                  >
                    Back
                  </Button>
                  {/* Sử dụng isReduxLoading để disable nút */}
                  <Button
                    type="submit"
                    disabled={isReduxLoading}
                    className="bg-[#3F5D38] hover:bg-[#2d4228] w-2/3"
                  >
                    {isReduxLoading ? "Signing up..." : "Signup"}
                  </Button>
                </div>
              </>
            )}
          </form>

          {/* Social & Footer */}
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
              <GoogleIcon /> Google
            </Button>
            <Button
              variant="outline"
              type="button"
              className="flex items-center gap-2 font-semibold"
            >
              <AppleIcon /> Apple
            </Button>
          </div>

          <p className="mt-8 text-center text-sm font-semibold text-gray-900">
            Already have an account?{" "}
            <Link href={AppRoute.login} className="text-blue-600 hover:underline">
              Sign In
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