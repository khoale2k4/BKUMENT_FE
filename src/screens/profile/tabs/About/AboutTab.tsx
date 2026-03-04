'use client';

import React, { useEffect, useState } from 'react';
import { Camera, MapPin, Phone, Mail, Calendar, Save, X, Edit3, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getMyProfile, updateMyProfile, UpdateProfileRequest } from '@/lib/redux/features/profileSlice';

// --- Sub-component: Input Field tùy biến theo phong cách Medium ---
interface ProfileFieldProps {
  label: string;
  value: string | number | undefined | null;
  name: string;
  isEditing: boolean;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  icon?: React.ReactNode;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value, name, isEditing, type = "text", onChange, icon }) => {
  const displayValue = value || '';

  return (
    <div className="group transition-all duration-300">
      <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
        {icon && <span className="text-gray-400">{icon}</span>}
        {label}
      </label>
      
      {isEditing ? (
        type === 'textarea' ? (
          <textarea
            name={name}
            value={displayValue}
            onChange={onChange}
            className="w-full p-0 text-lg text-gray-900 border-b border-gray-300 focus:border-black focus:ring-0 bg-transparent resize-none min-h-[80px] outline-none transition-colors placeholder:text-gray-300"
            placeholder={`Enter your ${label.toLowerCase()}...`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={displayValue}
            onChange={onChange}
            className="w-full p-0 py-1 text-lg text-gray-900 border-b border-gray-300 focus:border-black focus:ring-0 bg-transparent outline-none transition-colors placeholder:text-gray-300"
            placeholder={`Enter your ${label.toLowerCase()}...`}
          />
        )
      ) : (
        <p className={`text-lg text-gray-800 py-1 border-b border-transparent ${!displayValue && 'italic text-gray-400'}`}>
          {displayValue || 'Not provided'}
        </p>
      )}
    </div>
  );
};

// --- Main Component ---
const AboutTab = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, isUpdating } = useAppSelector((state) => state.profile);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({});

  // 1. Fetch dữ liệu khi mount
  useEffect(() => {
    if (!user) {
      dispatch(getMyProfile());
    }
  }, [dispatch, user]);

  // 2. Sync dữ liệu User vào Form Data khi User thay đổi hoặc bắt đầu Edit
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dob,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        address: user.address,
        phone: user.phone,
        universityId: user.universityId || 0,
      });
    }
  }, [user]);

  // 3. Xử lý thay đổi Input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 4. Submit Update
  const handleSave = async () => {
    await dispatch(updateMyProfile(formData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form về dữ liệu gốc
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dob,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        address: user.address,
        phone: user.phone,
        universityId: user.universityId || 0,
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-gray-900" size={32} /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-700 font-sans">
      
      {/* --- Action Bar (Floating or Fixed Top) --- */}
      <div className="flex justify-end mb-8 h-10 items-center">
        {isEditing ? (
          <div className="flex gap-3 animate-in slide-in-from-right-5 fade-in">
            <button 
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-black transition-colors rounded-full"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isUpdating}
              className="flex items-center gap-2 px-5 py-2 bg-[#1a8917] hover:bg-[#156d12] text-white text-sm font-medium rounded-full transition-all shadow-sm active:scale-95 disabled:opacity-70"
            >
              {isUpdating ? <Loader2 size={16} className="animate-spin"/> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="group flex items-center gap-2 text-gray-400 hover:text-[#1a8917] transition-colors"
          >
            <span className="text-sm font-medium group-hover:underline">Edit Profile</span>
            <Edit3 size={18} />
          </button>
        )}
      </div>

      {/* --- Profile Header Section --- */}
      <div className="flex flex-col md:flex-row items-start gap-10 mb-16 border-b border-gray-100 pb-12">
        {/* Avatar Area */}
        <div className="relative group shrink-0 mx-auto md:mx-0">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100">
            <img 
              src={formData.avatarUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Edit Avatar Overlay (Chỉ hiện khi Edit) */}
          {isEditing && (
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
               <Camera className="text-white" size={24} />
               {/* Input file ẩn có thể đặt ở đây nếu muốn làm tính năng upload ảnh thật */}
            </div>
          )}
          
          {/* Input Avatar URL (Chỉ hiện khi Edit để demo theo API string) */}
          {isEditing && (
             <input 
                name="avatarUrl"
                value={formData.avatarUrl || ''}
                onChange={handleInputChange}
                className="absolute -bottom-8 left-0 w-full text-xs border-b border-gray-300 text-center outline-none bg-transparent"
                placeholder="Paste avatar URL"
             />
          )}
        </div>

        {/* Name & Bio Area */}
        <div className="flex-grow w-full text-center md:text-left">
           <div className="grid grid-cols-2 gap-4 mb-4">
              <div className={isEditing ? "" : "col-span-2"}>
                  {/* Nếu không edit thì hiển thị Full Name */}
                  {!isEditing ? (
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif tracking-tight mb-4">
                      {user?.firstName} {user?.lastName}
                    </h2>
                  ) : (
                    <ProfileField 
                      label="First Name" name="firstName" 
                      value={formData.firstName} isEditing={true} onChange={handleInputChange} 
                    />
                  )}
              </div>
              {isEditing && (
                 <div>
                    <ProfileField 
                      label="Last Name" name="lastName" 
                      value={formData.lastName} isEditing={true} onChange={handleInputChange} 
                    />
                 </div>
              )}
           </div>

           {/* Bio Section */}
           <div className="prose prose-lg">
             <ProfileField 
                label="Bio" 
                name="bio" 
                value={formData.bio} 
                isEditing={isEditing} 
                onChange={handleInputChange}
                type="textarea"
             />
           </div>
        </div>
      </div>

      {/* --- Details Grid Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        
        <ProfileField 
          label="Email Address" 
          name="email" // Email thường không cho sửa, ở đây chỉ để hiển thị
          value={user?.email} 
          isEditing={false} // Luôn disable edit email
          onChange={() => {}} 
          icon={<Mail size={14} />}
        />

        <ProfileField 
          label="Phone Number" 
          name="phone" 
          value={formData.phone} 
          isEditing={isEditing} 
          onChange={handleInputChange} 
          icon={<Phone size={14} />}
        />

        <ProfileField 
          label="Date of Birth" 
          name="dob" 
          type="date"
          value={formData.dob} 
          isEditing={isEditing} 
          onChange={handleInputChange} 
          icon={<Calendar size={14} />}
        />

        <ProfileField 
          label="Address" 
          name="address" 
          value={formData.address} 
          isEditing={isEditing} 
          onChange={handleInputChange} 
          icon={<MapPin size={14} />}
        />
      </div>

      {/* Footer / University Info (Optional) */}
      <div className="mt-16 pt-10 border-t border-gray-100 text-center md:text-left">
          <p className="text-sm text-gray-400 uppercase font-bold tracking-widest mb-2">Education</p>
          <div className="text-xl text-gray-800 font-serif">
             {user?.university || 'Ho Chi Minh City University of Technology'}
          </div>
      </div>
    </div>
  );
};

export default AboutTab;