import React, { useEffect, useState } from 'react';
import { Camera, MapPin, Phone, Mail, Calendar, Save, Edit3, Loader2 } from 'lucide-react';
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
    setFormData((prev) => ({ ...prev, [name]: value }) as UpdateProfileRequest);
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
    return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-gray-900" size={32} /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-700 font-sans">
      {/* Action Bar */}
      <div className="flex justify-end mb-8 h-10 items-center">
        {isEditing ? (
          <div className="flex gap-3">
            <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-black transition-colors rounded-full">Cancel</button>
            <button onClick={handleSave} disabled={isUpdating} className="flex items-center gap-2 px-5 py-2 bg-[#1a8917] hover:bg-[#156d12] text-white text-sm font-medium rounded-full transition-all disabled:opacity-70">
              {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="group flex items-center gap-2 text-gray-400 hover:text-[#1a8917] transition-colors">
            <span className="text-sm font-medium group-hover:underline">Edit Profile</span> <Edit3 size={18} />
          </button>
        )}
      </div>

      {/* Header (Avatar + Name + Bio) */}
      <div className="flex flex-col md:flex-row items-start gap-10 mb-16 border-b border-gray-100 pb-12">
        {/* Avatar Area (Giữ nguyên như code cũ của bạn) */}
        <div className="relative group shrink-0 mx-auto md:mx-0">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100">
            <img src={formData.avatarUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          {isEditing && (
            <input name="avatarUrl" value={formData.avatarUrl || ''} onChange={handleInputChange} className="absolute -bottom-8 left-0 w-full text-xs border-b border-gray-300 text-center outline-none bg-transparent" placeholder="Paste avatar URL" />
          )}
        </div>

        {/* Info Area */}
        <div className="flex-grow w-full text-center md:text-left">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className={isEditing ? "" : "col-span-2"}>
              {!isEditing ? (
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif tracking-tight mb-4">{user?.firstName} {user?.lastName}</h2>
              ) : (
                <ProfileField label="First Name" name="firstName" value={formData.firstName} isEditing={true} onChange={handleInputChange} />
              )}
            </div>
            {isEditing && <div><ProfileField label="Last Name" name="lastName" value={formData.lastName} isEditing={true} onChange={handleInputChange} /></div>}
          </div>
          <div className="prose prose-lg">
            <ProfileField label="Bio" name="bio" value={formData.bio} isEditing={isEditing} onChange={handleInputChange} type="textarea" />
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        <ProfileField label="Email Address" name="email" value={user?.email} isEditing={false} onChange={() => { }} icon={<Mail size={14} />} />
        <ProfileField label="Phone Number" name="phone" value={formData.phone} isEditing={isEditing} onChange={handleInputChange} icon={<Phone size={14} />} />
        <ProfileField label="Date of Birth" name="dob" type="date" value={formData.dob} isEditing={isEditing} onChange={handleInputChange} icon={<Calendar size={14} />} />
        <ProfileField label="Address" name="address" value={formData.address} isEditing={isEditing} onChange={handleInputChange} icon={<MapPin size={14} />} />
      </div>
    </div>
  );
};

export default UserAboutTab;