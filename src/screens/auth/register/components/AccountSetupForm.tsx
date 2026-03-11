import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/button";

interface AccountSetupFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPrev: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  inputClassName: string;
}

export default function AccountSetupForm({ formData, handleChange, onPrev, onSubmit, isLoading, inputClassName }: AccountSetupFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
      <Input
        label="Username"
        name="username"
        type="text"
        placeholder="Choose a username"
        value={formData.username}
        onChange={handleChange}
        required
        className={inputClassName}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        required
        className={inputClassName}
      />

      {/* THÊM MỚI: Confirm Password */}
      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Re-enter your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        className={inputClassName}
      />

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="terms"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={(e) => handleChange({ target: { name: 'agreeTerms', value: e.target.checked } } as any)}
          className="w-4 h-4 rounded border-gray-300 text-[#3F5D38] focus:ring-[#3F5D38] cursor-pointer"
          required
        />
        <label htmlFor="terms" className="text-xs font-semibold text-gray-900 cursor-pointer">
          I agree to the <Link href="#" className="underline text-[#3F5D38] hover:text-[#2d4228]">terms & policy</Link>
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" className="w-1/3 py-3 rounded-xl" onClick={onPrev}>
          Back
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !formData.agreeTerms} 
          className="bg-[#3F5D38] hover:bg-[#2d4228] text-white w-2/3 py-3 rounded-xl disabled:opacity-70"
        >
          {isLoading ? "Signing up..." : "Create Account"}
        </Button>
      </div>
    </form>
  );
}