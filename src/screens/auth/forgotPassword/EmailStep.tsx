import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/button";

interface EmailStepProps {
  email: string;
  setEmail: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function EmailStep({ email, setEmail, onSubmit, isLoading }: EmailStepProps) {
  const { t } = useTranslation();
  const inputClassName = "text-gray-900 font-medium placeholder:text-gray-400";

  return (
    <>
      <h1 className="text-4xl font-bold mb-4 text-gray-900 font-serif">
        {t('auth.forgot.title', 'Forgot Password?')}
      </h1>
      <h2 className="text-lg mb-8 text-gray-600 font-serif">
        {t('auth.forgot.subtitle', 'Enter your registered email address and we will send you a verification code.')}
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        <Input
          label={t('auth.forgot.emailLabel', 'Email Address')}
          type="email"
          placeholder={t('auth.forgot.emailPlaceholder', 'Enter your email')}
          required
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className={inputClassName}
        />
        <Button type="submit" className="bg-[#3F5D38] hover:bg-[#2d4228] w-full py-6 text-lg" disabled={isLoading}>
          {isLoading ? t('auth.forgot.sending', 'Sending...') : t('auth.forgot.sendBtn', 'Send Code')}
        </Button>
      </form>
    </>
  );
}