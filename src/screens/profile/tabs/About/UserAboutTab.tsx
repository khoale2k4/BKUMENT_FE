"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Save,
  Edit3,
  Loader2,
  GraduationCap,
  Award,
  Users,
  UserCheck,
  Camera,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  getMyProfile,
  updateMyProfile,
  UpdateProfileRequest,
  uploadAvatar,
} from "@/lib/redux/features/profileSlice";
import { getUniversities } from "@/lib/redux/features/authSlice";
import ProfileField from "./ProfileField";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { Select } from "@mantine/core";

const UserAboutTab = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, isUpdating, isAvatarUploading } = useAppSelector(
    (state) => state.profile,
  );
  const { universities } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await dispatch(uploadAvatar(file)).unwrap();
        setFormData((prev) => ({ ...prev, avatarUrl: url }));
      } catch (err) {
        console.error("Failed to upload avatar", err);
      }
    }
  };

  useEffect(() => {
    if (!user) {
      dispatch(getMyProfile());
    }
    if (universities.length === 0) {
      dispatch(getUniversities());
    }
  }, [dispatch, user, universities.length]);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const parsedValue = name === "universityId" ? Number(value) : value;
    setFormData(
      (prev) => ({ ...prev, [name]: parsedValue }) as UpdateProfileRequest,
    );
  };

  const handleSelectChange = (value: string | null, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value ? Number(value) : 0 }));
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

  const universityData = universities.map((u) => ({
    value: u.id.toString(),
    label: u.name,
  }));

  if (isLoading) {
    return (
        <div className="py-8">
            <SkeletonLoader variant="profile" />
        </div>
    );
  }

  const ActionButtons = () => (
    <div className="flex gap-3">
        <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors rounded-full border border-gray-200"
        >
            <X size={16} />
            {t("profile.user.about.cancel", "Cancel")}
        </button>
        <button
            onClick={handleSave}
            disabled={isUpdating}
            className="flex items-center gap-2 px-6 py-2 bg-[#1a8917] hover:bg-[#156d12] text-white text-sm font-bold rounded-full transition-all shadow-md disabled:opacity-70 active:scale-95"
        >
            {isUpdating ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                <Save size={16} />
            )}
            {t("profile.user.about.saveChanges", "Save Changes")}
        </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700 font-sans pb-10">
      <div className="flex justify-end mb-6 h-10 items-center">
        {isEditing ? (
          <ActionButtons />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-5 py-2 bg-white text-gray-700 hover:bg-gray-50 font-semibold text-sm rounded-full transition-all border border-gray-200 shadow-sm hover:shadow-md active:scale-95"
          >
            <Edit3 size={16} />{" "}
            {t("profile.user.about.editProfile", "Edit Profile")}
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-60"></div>

        {/* Avatar Area */}
        <div className="relative group shrink-0 flex flex-col items-center z-10">
          <div
            onClick={handleAvatarClick}
            className={`w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-50 relative group/avatar transition-all duration-300 ${
              isEditing ? "cursor-pointer ring-2 ring-green-100" : ""
            }`}
          >
            {formData.avatarUrl || user?.avatarUrl ? (
              <AuthenticatedImage
                src={(formData.avatarUrl || user?.avatarUrl) as string}
                alt="Avatar"
                className="w-full h-full object-cover group-hover/avatar:scale-105 transition-transform duration-500"
              />
            ) : (
              <img
                src={`https://ui-avatars.com/api/?name=${user?.firstName || "User"}+${user?.lastName || ""}&background=random`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            )}

            {isEditing && (
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-300">
                <Camera className="text-white w-8 h-8 mb-1" />
                <span className="text-[10px] text-white font-bold uppercase tracking-widest">{t('profile.user.changePhoto', 'Change')}</span>
              </div>
            )}

            {isAvatarUploading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                   <Loader2 className="animate-spin text-[#1a8917] w-8 h-8" />
                   <span className="text-[10px] text-green-700 font-bold uppercase">{t('common.uploading', 'Uploading')}</span>
                </div>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        <div className="flex-grow w-full text-center md:text-left z-10">
          <div className={isEditing ? "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-4" : "mb-6"}>
            {!isEditing ? (
              <>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {user?.fullName ||
                    `${user?.firstName || ""} ${user?.lastName || ""}`}
                </h2>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl font-medium">
                  {user?.bio ||
                    t(
                      "profile.user.about.noBio",
                      "Chưa có lời giới thiệu nào.",
                    )}
                </p>
              </>
            ) : (
              <>
                <ProfileField
                  label={t("profile.user.about.firstName", "First Name")}
                  name="firstName"
                  value={formData.firstName}
                  isEditing={true}
                  onChange={handleInputChange}
                />
                <ProfileField
                  label={t("profile.user.about.lastName", "Last Name")}
                  name="lastName"
                  value={formData.lastName}
                  isEditing={true}
                  onChange={handleInputChange}
                />
                <div className="col-span-1 sm:col-span-2 mt-2">
                  <ProfileField
                    label={t("profile.user.about.bio", "Bio")}
                    name="bio"
                    value={formData.bio}
                    isEditing={true}
                    onChange={handleInputChange}
                    type="textarea"
                  />
                </div>
              </>
            )}
          </div>

          {!isEditing && (
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
              {[
                { 
                    id: 'followers', 
                    icon: <Users size={18} />, 
                    label: t("profile.user.about.followers", "Followers"), 
                    value: user?.followerCount || 0,
                    color: 'blue',
                    route: `/profile/${user?.id}/followers`
                },
                { 
                    id: 'following', 
                    icon: <UserCheck size={18} />, 
                    label: t("profile.user.about.following", "Following"), 
                    value: user?.followingCount || 0,
                    color: 'purple',
                    route: `/profile/${user?.id}/followings`
                },
                { 
                    id: 'points', 
                    icon: <Award size={18} />, 
                    label: t("profile.user.about.points", "Points"), 
                    value: user?.points || 0,
                    color: 'orange'
                }
              ].map(stat => (
                <div
                    key={stat.id}
                    onClick={() => stat.route && router.push(stat.route)}
                    className={`flex items-center gap-3 px-5 py-3 bg-${stat.color}-50/50 border border-${stat.color}-100 rounded-2xl ${stat.route ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]' : ''} transition-all duration-200`}
                >
                    <div className={`p-2 bg-${stat.color}-100 text-${stat.color}-600 rounded-xl`}>
                        {stat.icon}
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">
                            {stat.label}
                        </span>
                        <span className="text-xl font-black text-gray-900 leading-none">
                            {stat.value}
                        </span>
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
        <h3 className="text-lg font-extrabold text-slate-800 mb-8 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
            <UserCheck size={18} />
          </span>
          {t("profile.user.about.personalInfo", "Personal Information")}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <ProfileField
            label={t("profile.user.about.email", "Email Address")}
            name="email"
            value={user?.email}
            isEditing={false}
            onChange={() => {}}
            icon={<Mail size={16} />}
          />
          <ProfileField
            label={t("profile.user.about.phone", "Phone Number")}
            name="phone"
            value={formData.phone}
            isEditing={isEditing}
            onChange={handleInputChange}
            icon={<Phone size={16} />}
          />
          <ProfileField
            label={t("profile.user.about.dob", "Date of Birth")}
            name="dob"
            type="date"
            value={formData.dob}
            isEditing={isEditing}
            onChange={handleInputChange}
            icon={<Calendar size={16} />}
          />
          <ProfileField
            label={t("profile.user.about.address", "Address")}
            name="address"
            value={formData.address}
            isEditing={isEditing}
            onChange={handleInputChange}
            icon={<MapPin size={16} />}
          />

          <div className="col-span-1 md:col-span-2">
            <ProfileField
                label={t("profile.user.about.university", "University")}
                name="universityId"
                value={user?.university}
                isEditing={isEditing}
                icon={<GraduationCap size={16} />}
            >
                <Select
                    placeholder={t("profile.user.about.selectUniversity", "Select your university")}
                    data={universityData}
                    value={formData.universityId?.toString()}
                    onChange={(val) => handleSelectChange(val, "universityId")}
                    searchable
                    nothingFoundMessage="No universities found"
                    variant="unstyled"
                    styles={{
                        input: { fontSize: 18, color: '#111827', padding: 0, minHeight: 'auto' },
                        option: { fontSize: 14 }
                    }}
                />
            </ProfileField>
          </div>
        </div>

        {isEditing && (
            <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
                <ActionButtons />
            </div>
        )}
      </div>
    </div>
  );
};

export default UserAboutTab;
