'use client';

import React, { useEffect, useState } from 'react';
import { 
  MapPin, Phone, Mail, Calendar, Save, Edit3, Loader2, 
  GraduationCap, Award, Users, UserCheck 
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getMyProfile, updateMyProfile, UpdateProfileRequest } from '@/lib/redux/features/profileSlice';
import ProfileField from './ProfileField';

const UserAboutTab = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, isUpdating } = useAppSelector((state) => state.profile);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({});

  useEffect(() => {
    if (!user) {
      dispatch(getMyProfile());
    }
  }, [dispatch, user]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Tự động ép kiểu sang number nếu field là universityId
    const parsedValue = name === 'universityId' ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }) as UpdateProfileRequest);
  };

  const handleSave = async () => {
    await dispatch(updateMyProfile(formData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
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
    return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-[#1a8917]" size={32} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700 font-sans pb-10">
      
      {/* Action Bar */}
      <div className="flex justify-end mb-6 h-10 items-center">
        {isEditing ? (
          <div className="flex gap-3">
            <button onClick={handleCancel} className="px-5 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors rounded-full">
              Cancel
            </button>
            <button onClick={handleSave} disabled={isUpdating} className="flex items-center gap-2 px-6 py-2 bg-[#1a8917] hover:bg-[#156d12] text-white text-sm font-bold rounded-full transition-all shadow-sm disabled:opacity-70 active:scale-95">
              {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
              Save Changes
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 font-semibold text-sm rounded-full transition-colors border border-gray-200">
            <Edit3 size={16} /> Edit Profile
          </button>
        )}
      </div>

      {/* Header (Avatar + Name + Bio + Stats) */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-12 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        
        {/* Avatar Area */}
        <div className="relative group shrink-0">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-50">
            <img 
              src={formData.avatarUrl || user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
          {isEditing && (
            <input 
              name="avatarUrl" 
              value={formData.avatarUrl || ''} 
              onChange={handleInputChange} 
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[120%] text-xs border-b border-gray-300 text-center outline-none bg-transparent focus:border-[#1a8917] transition-colors" 
              placeholder="Paste image URL here" 
            />
          )}
        </div>

        {/* Info Area */}
        <div className="flex-grow w-full text-center md:text-left">
          
          <div className={isEditing ? "grid grid-cols-2 gap-4 mb-4" : "mb-6"}>
            {!isEditing ? (
              <>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
                  {user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`}
                </h2>
                <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl">
                  {user?.bio || "Chưa có lời giới thiệu nào."}
                </p>
              </>
            ) : (
              <>
                <ProfileField label="First Name" name="firstName" value={formData.firstName} isEditing={true} onChange={handleInputChange} />
                <ProfileField label="Last Name" name="lastName" value={formData.lastName} isEditing={true} onChange={handleInputChange} />
                <div className="col-span-2 mt-2">
                  <ProfileField label="Bio" name="bio" value={formData.bio} isEditing={true} onChange={handleInputChange} type="textarea" />
                </div>
              </>
            )}
          </div>

          {/* --- THIẾT KẾ MỚI: STATS BAR (Chỉ hiện khi không ở chế độ Edit) --- */}
          {!isEditing && (
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
              <div className="flex items-center gap-2.5 px-4 py-2 bg-blue-50/50 border border-blue-100 rounded-2xl">
                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-full"><Users size={18} /></div>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Followers</span>
                  <span className="font-bold text-gray-900 leading-none">{user?.followerCount || 0}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-2 bg-purple-50/50 border border-purple-100 rounded-2xl">
                <div className="p-1.5 bg-purple-100 text-purple-600 rounded-full"><UserCheck size={18} /></div>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Following</span>
                  <span className="font-bold text-gray-900 leading-none">{user?.followingCount || 0}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-2 bg-orange-50/50 border border-orange-100 rounded-2xl">
                <div className="p-1.5 bg-orange-100 text-orange-600 rounded-full"><Award size={18} /></div>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Points</span>
                  <span className="font-bold text-gray-900 leading-none">{user?.points || 0}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Details Grid */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          
          <ProfileField label="Email Address" name="email" value={user?.email} isEditing={false} onChange={() => { }} icon={<Mail size={16} className="text-gray-400" />} />
          <ProfileField label="Phone Number" name="phone" value={formData.phone} isEditing={isEditing} onChange={handleInputChange} icon={<Phone size={16} className="text-gray-400" />} />
          <ProfileField label="Date of Birth" name="dob" type="date" value={formData.dob} isEditing={isEditing} onChange={handleInputChange} icon={<Calendar size={16} className="text-gray-400" />} />
          <ProfileField label="Address" name="address" value={formData.address} isEditing={isEditing} onChange={handleInputChange} icon={<MapPin size={16} className="text-gray-400" />} />
          
          {/* --- THIẾT KẾ MỚI: TRƯỜNG UNIVERSITY --- */}
          <div className="col-span-1 md:col-span-2">
            {!isEditing ? (
              <ProfileField 
                label="University" 
                name="university" 
                value={user?.university || 'Chưa cập nhật'} 
                isEditing={false} 
                onChange={() => { }} 
                icon={<GraduationCap size={16} className="text-gray-400" />} 
              />
            ) : (
              /* Ở chế độ Edit, bạn đang dùng universityId (kiểu số).
                 Nếu dự án của bạn có component Dropdown/Select cho trường đại học thì có thể thay thẻ này.
                 Tạm thời mình dùng input number để đồng bộ với state formData.universityId của bạn. */
              <ProfileField 
                label="University ID" 
                name="universityId" 
                type="number"
                value={formData.universityId?.toString()} 
                isEditing={true} 
                onChange={handleInputChange} 
                icon={<GraduationCap size={16} className="text-gray-400" />} 
              />
            )}
          </div>

        </div>
      </div>

    </div>
  );
};

export default UserAboutTab;