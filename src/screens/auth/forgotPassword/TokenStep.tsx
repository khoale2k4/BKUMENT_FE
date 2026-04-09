import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/button";

interface TokenStepProps {
  email: string;
  token: string;
  setToken: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function TokenStep({ email, token, setToken, onSubmit, isLoading }: TokenStepProps) {
  const { t } = useTranslation();
  const inputClassName = "text-gray-900 font-medium placeholder:text-gray-400";

  return (
    <>
      <h1 className="text-4xl font-bold mb-4 text-gray-900 font-serif">
        {t('auth.forgot.tokenTitle', 'Check your email')}
      </h1>
      <h2 className="text-lg mb-8 text-gray-600 font-serif">
        {t('auth.forgot.tokenDesc', { email })}
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        <Input
          label={t('auth.forgot.tokenLabel', 'Verification Code')}
          type="text"
          placeholder={t('auth.forgot.tokenPlaceholder', 'Enter code (e.g., 123456)')}
          required
          value={token}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)}
          className={inputClassName}
          maxLength={6}
        />
        <Button type="submit" className="bg-[#3F5D38] hover:bg-[#2d4228] w-full py-6 text-lg" disabled={isLoading}>
          {isLoading ? t('auth.forgot.verifying', 'Verifying...') : t('auth.forgot.verify', 'Verify Code')}
        </Button>
      </form>
    </>
  );
}