"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { registerUser, getUniversities } from "@/lib/redux/features/authSlice"; 
import { showToast } from "@/lib/redux/features/toastSlice";
import { AppRoute } from "@/lib/appRoutes";

import PersonalInfoForm from "./components/PersonalInfoForm";
import AccountSetupForm from "./components/AccountSetupForm";
import SocialAuthButtons from "./components/SocialAuthButtons";

export default function RegisterPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // Lấy danh sách Universities từ Redux
  const { status, universities, isUniversitiesLoading } = useAppSelector((state) => state.auth);
  const isReduxLoading = status === 'loading';

  const inputClassName = "text-gray-900 font-medium placeholder:text-gray-400 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#3F5D38] focus:border-transparent outline-none rounded-xl py-3 px-4 transition-all w-full";
  
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    universityId: 0, 
    email: "",      
    phone: "",      
    address: "",    
    bio: "",        
    username: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  // LẤY DANH SÁCH TRƯỜNG KHI LOAD TRANG
  useEffect(() => {
    if (universities.length === 0) {
      dispatch(getUniversities());
    }
  }, [dispatch, universities.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as any;
    
    // Ép kiểu number cho ID trường Đại học
    let value = target.type === 'checkbox' ? target.checked : target.value;
    if (target.name === 'universityId') {
       value = Number(value); 
    }

    setFormData((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.firstName && 
      formData.lastName && 
      formData.email &&     
      formData.phone &&     
      formData.dob && 
      formData.universityId > 0 
    ) {
      setStep(2);
    } else {
      dispatch(showToast({ 
        type: "error", 
        title: t('auth.register.missingInfoTitle', 'Missing Info'), 
        message: t('auth.register.missingInfoMsg', 'Please fill in all personal info and select a university.') 
      }));
    }
  };

  const handlePrevStep = () => setStep(1);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      dispatch(showToast({ 
        type: "error", 
        title: t('auth.register.passwordMismatchTitle', 'Validation Error'), 
        message: t('auth.register.passwordMismatchMsg', 'Passwords do not match!') 
      }));
      return;
    }

    const payload = {
      account: {
        username: formData.username,
        password: formData.password,
        role: "USER",
      },
      firstName: formData.firstName,
      lastName: formData.lastName,
      dob: formData.dob,
      universityId: formData.universityId,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      bio: formData.bio,
    };

    try {
      await dispatch(registerUser(payload as any)).unwrap(); 
      dispatch(showToast({ 
        type: "success", 
        title: t('auth.register.successTitle', 'Success!'), 
        message: t('auth.register.successMsg', 'Account created. Redirecting to login...') 
      }));
      setTimeout(() => router.push(AppRoute.login), 1500);
    } catch (errorMsg) {
      console.error("Register error:", errorMsg);
      dispatch(showToast({ 
        type: "error", 
        title: t('auth.register.failTitle', 'Registration Failed'), 
        message: (errorMsg as string) || t('auth.register.failMsg', 'Could not create account') 
      }));
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-20 overflow-y-auto">
        <div className="w-full max-lg">
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 text-gray-900 font-serif tracking-tight">
              {t('auth.register.title', 'Create Account')}
            </h1>
            <div className="flex items-center gap-2 mt-4">
              <span className={`text-sm font-bold transition-colors ${step === 1 ? 'text-[#3F5D38]' : 'text-gray-400'}`}>01. {t('auth.register.personalInfo', 'Personal Info')}</span>
              <span className="w-8 h-px bg-gray-300"></span>
              <span className={`text-sm font-bold transition-colors ${step === 2 ? 'text-[#3F5D38]' : 'text-gray-400'}`}>02. {t('auth.register.accountSetup', 'Account Setup')}</span>
            </div>
          </div>

          {step === 1 ? (
            <PersonalInfoForm 
              formData={formData} 
              handleChange={handleChange} 
              onNext={handleNextStep} 
              inputClassName={inputClassName} 
              universities={universities} 
              isLoadingUnis={isUniversitiesLoading} 
            />
          ) : (
            <AccountSetupForm 
              formData={formData} 
              handleChange={handleChange} 
              onPrev={handlePrevStep} 
              onSubmit={handleSignUp} 
              isLoading={isReduxLoading} 
              inputClassName={inputClassName} 
            />
          )}

          <SocialAuthButtons />

          <p className="mt-8 text-center text-sm font-semibold text-gray-600">
            {t('auth.register.alreadyHave', 'Already have an account?')}{" "}
            <Link href={AppRoute.login} className="text-[#3F5D38] hover:text-[#2d4228] hover:underline">
              {t('auth.register.signIn', 'Sign In')}
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block w-1/2 relative overflow-hidden ">
        <img
          src="/svgs/login_background.svg"
          alt="Decoration"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
}