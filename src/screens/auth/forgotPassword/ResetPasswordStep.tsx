import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/redux/features/toastSlice";
import { useAppDispatch } from "@/lib/redux/hooks";

interface ResetPasswordStepProps {
  onSubmit: (password: string) => void;
  isLoading: boolean;
}

export function ResetPasswordStep({ onSubmit, isLoading }: ResetPasswordStepProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const inputClassName = "text-gray-900 font-medium placeholder:text-gray-400";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      dispatch(
        showToast({
          type: "error",
          title: t('auth.forgot.validationTitle', 'Validation Error'),
          message: t('auth.forgot.passwordMismatch', 'Passwords do not match!'),
        })
      );
      return;
    }
    // Truyền password đã hợp lệ lên cho Parent xử lý API
    onSubmit(newPassword);
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-4 text-gray-900 font-serif">
        {t('auth.forgot.resetTitle', 'Set New Password')}
      </h1>
      <h2 className="text-lg mb-8 text-gray-600 font-serif">
        {t('auth.forgot.resetDesc', 'Your new password must be different from previously used passwords.')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label={t('auth.forgot.newPasswordLabel', 'New Password')}
          type="password"
          placeholder={t('auth.forgot.emailPlaceholder', 'Enter new password')}
          required
          value={newPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
          className={inputClassName}
        />
        <Input
          label={t('auth.forgot.confirmNewPasswordLabel', 'Confirm Password')}
          type="password"
          placeholder={t('auth.register.confirmPasswordPlaceholder', 'Re-enter your password')}
          required
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
          className={inputClassName}
        />
        <Button type="submit" className="bg-[#3F5D38] hover:bg-[#2d4228] w-full py-6 text-lg" disabled={isLoading}>
          {isLoading ? t('auth.forgot.resetting', 'Resetting...') : t('auth.forgot.resetBtn', 'Reset Password')}
        </Button>
      </form>
    </>
  );
}