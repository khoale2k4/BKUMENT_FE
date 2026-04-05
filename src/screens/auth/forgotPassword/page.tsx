"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { showToast } from "@/lib/redux/features/toastSlice";
import { AppRoute } from "@/lib/appRoutes";

// Import các components con
import { EmailStep } from "./EmailStep";
import { TokenStep } from "./TokenStep";
import { ResetPasswordStep } from "./ResetPasswordStep";
import { forgotPasswordWithEmail, resetPassword, verifyResetToken } from "@/lib/redux/features/authSlice";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { status } = useAppSelector((state) => state.auth);
  const isReduxLoading = status === 'loading';

  // Global States cho quá trình Reset
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

// --- API Handlers ---
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Bước 1: Vẫn gọi API để gửi mã OTP về email
      await dispatch(forgotPasswordWithEmail(email)).unwrap();
      dispatch(showToast({ type: "success", title: "Success!", message: "Code sent to your email!" }));
      setStep(2); // Chuyển sang Bước 2
    } catch (errorMsg) {
      dispatch(showToast({ type: "error", title: "Failed", message: errorMsg as string }));
    }
  };

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    // Bước 2: KHÔNG GỌI API NỮA. 
    // Chỉ cần kiểm tra xem user đã nhập token chưa rồi cho qua Bước 3.
    if (!token.trim()) {
      dispatch(showToast({ type: "error", title: "Lỗi", message: "Vui lòng nhập mã OTP" }));
      return;
    }
    setStep(3); // Chuyển thẳng sang Bước 3
  };

  const handleResetPassword = async (newPassword: string) => {
    try {
      // Bước 3: Gom đủ bộ 3 biến (email ở bước 1, token ở bước 2, newPassword ở bước 3)
      const payload = {
        email: email,
        otp: token,
        newPassword: newPassword
      };

      // Gọi API Reset Password cuối cùng
      await dispatch(resetPassword(payload)).unwrap();
      
      dispatch(showToast({ type: "success", title: "Thành công", message: "Đổi mật khẩu thành công." }));
      setTimeout(() => router.push(AppRoute.login), 1500);
      
    } catch (errorMsg) {
      // Nếu OTP sai, hoặc lỗi từ server, nó sẽ báo lỗi ở đây
      dispatch(showToast({ type: "error", title: "Thất bại", message: errorMsg as string }));
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
        <div className="w-full max-w-md">
          
          {/* Render Component tương ứng với Step */}
          {step === 1 && (
            <EmailStep 
              email={email} 
              setEmail={setEmail} 
              onSubmit={handleVerifyEmail} 
              isLoading={isReduxLoading} 
            />
          )}

          {step === 2 && (
            <TokenStep 
              email={email} 
              token={token} 
              setToken={setToken} 
              onSubmit={handleVerifyToken} 
              isLoading={isReduxLoading} 
            />
          )}

          {step === 3 && (
            <ResetPasswordStep 
              onSubmit={handleResetPassword} 
              isLoading={isReduxLoading} 
            />
          )}

          {/* Footer (Hiển thị chung cho mọi steps) */}
          <div className="mt-8 text-center text-sm font-semibold text-gray-900 flex justify-center items-center space-x-2">
            {step > 1 && (
              <>
                <button 
                  onClick={() => setStep((prev) => (prev - 1) as 1 | 2)} 
                  className="text-gray-500 hover:underline"
                >
                  {t('auth.forgot.back', 'Back')}
                </button>
                <span className="text-gray-300">|</span>
              </>
            )}
            <p>
              {t('auth.forgot.rememberPassword', "Remember your password?")}{" "}
              <Link href={AppRoute.login} className="text-[#3F5D38] hover:underline">
                {t('auth.forgot.backToLogin', 'Log In')}
              </Link>
            </p>
          </div>

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