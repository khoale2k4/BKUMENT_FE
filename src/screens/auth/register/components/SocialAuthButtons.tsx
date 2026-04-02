import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/icons/google";
import AppleIcon from "@/components/icons/apple";

export default function SocialAuthButtons() {
  const { t } = useTranslation();
  
  return (
    <>
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-500 font-bold tracking-widest">{t('auth.register.or', 'Or')}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" className="flex items-center gap-2 font-semibold rounded-xl py-6 hover:bg-gray-50">
          <GoogleIcon /> {t('auth.register.google', 'Google')}
        </Button>
        <Button variant="outline" type="button" className="flex items-center gap-2 font-semibold rounded-xl py-6 hover:bg-gray-50">
          <AppleIcon /> {t('auth.register.apple', 'Apple')}
        </Button>
      </div>
    </>
  );
}