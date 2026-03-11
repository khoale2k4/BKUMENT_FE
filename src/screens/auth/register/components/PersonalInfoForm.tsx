import React from "react";
import { Input } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/button";

// KHAI BÁO KIỂU DỮ LIỆU ĐỂ TYPESCRIPT KHÔNG BÁO LỖI
interface University {
  id: number;
  name: string;
}

interface PersonalInfoFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onNext: (e: React.FormEvent) => void;
  inputClassName: string;
  // Bổ sung thêm 2 props này
  universities: University[];
  isLoadingUnis: boolean;
}

export default function PersonalInfoForm({ 
  formData, 
  handleChange, 
  onNext, 
  inputClassName,
  universities,
  isLoadingUnis
}: PersonalInfoFormProps) {
  
  return (
    <form onSubmit={onNext} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
      
      {/* Row 1: Name */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name" name="firstName" type="text"
          placeholder="e.g. John" value={formData.firstName}
          onChange={handleChange} required className={inputClassName}
        />
        <Input
          label="Last Name" name="lastName" type="text"
          placeholder="e.g. Doe" value={formData.lastName}
          onChange={handleChange} required className={inputClassName}
        />
      </div>

      {/* Row 2: Contact */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email Address" name="email" type="email"
          placeholder="john@example.com" value={formData.email}
          onChange={handleChange} required className={inputClassName}
        />
        <Input
          label="Phone Number" name="phone" type="tel"
          placeholder="+84..." value={formData.phone}
          onChange={handleChange} required className={inputClassName}
        />
      </div>

      {/* Row 3: Education & DOB */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date of Birth" name="dob" type="date"
          value={formData.dob} onChange={handleChange}
          required className={inputClassName}
        />
        
        {/* INPUT UNIVERSITY THÀNH THẺ SELECT */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">University <span className="text-red-500">*</span></label>
          <select 
            name="universityId" 
            value={formData.universityId} 
            onChange={handleChange} 
            required 
            className={`${inputClassName} cursor-pointer appearance-none`}
            // Thêm icon mũi tên nhỏ bên phải cho đẹp
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, 
              backgroundRepeat: 'no-repeat', 
              backgroundPosition: 'right 1rem center', 
              backgroundSize: '1.2em' 
            }}
          >
            {/* Lựa chọn mặc định */}
            <option value={0} disabled>
              {isLoadingUnis ? "Đang tải danh sách..." : "-- Chọn trường Đại học --"}
            </option>

            {/* Render danh sách các trường đổ về từ API */}
            {universities.map((uni) => (
              <option key={uni.id} value={uni.id}>
                {uni.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 4: Address (Full width) */}
      <Input
        label="Address" name="address" type="text"
        placeholder="123 Street, City, Country" value={formData.address}
        onChange={handleChange} className={inputClassName}
      />

      {/* Row 5: Bio (Textarea) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700">Bio <span className="text-gray-400 font-normal">(Optional)</span></label>
        <textarea
          name="bio"
          rows={3}
          placeholder="Tell us a little bit about yourself..."
          value={formData.bio}
          onChange={handleChange}
          className={`${inputClassName} resize-none`}
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="bg-[#3F5D38] hover:bg-[#2d4228] w-full text-white py-6 rounded-xl mt-6 font-bold text-md shadow-md">
        Next Step
      </Button>
    </form>
  );
}