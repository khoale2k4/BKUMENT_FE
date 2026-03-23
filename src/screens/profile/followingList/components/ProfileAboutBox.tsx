import React from 'react';
import { GraduationCap, MapPin, Award, Mail, Phone, Calendar } from 'lucide-react';
import { UserProfile } from '@/lib/redux/features/profileSlice';

interface ProfileAboutBoxProps {
  profile: UserProfile;
}

const ProfileAboutBox: React.FC<ProfileAboutBoxProps> = ({ profile }) => {
  return (
    <div className="max-w-[900px] mx-auto px-6 sm:px-10 mt-6 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cột trái: Giới thiệu ngắn */}
        <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-fit">
          <h3 className="text-[16px] font-bold text-gray-900 mb-3">Giới thiệu</h3>
          
          {profile.bio && (
            <div className="text-center text-[14px] text-gray-700 italic mb-4 pb-4 border-b border-gray-100">
              "{profile.bio}"
            </div>
          )}

          <div className="space-y-3">
            {profile.university && (
              <div className="flex items-start gap-2 text-gray-700 text-[14px]">
                <GraduationCap size={18} className="text-gray-400 shrink-0" />
                <span><span className="font-semibold">{profile.university}</span></span>
              </div>
            )}
            
            {profile.address && (
              <div className="flex items-start gap-2 text-gray-700 text-[14px]">
                <MapPin size={18} className="text-gray-400 shrink-0" />
                <span>Sống tại <span className="font-semibold">{profile.address}</span></span>
              </div>
            )}

            <div className="flex items-start gap-2 text-gray-700 text-[14px]">
              <Award size={18} className="text-orange-400 shrink-0" />
              <span>Thành tích: <span className="font-semibold">{profile.points || 0} điểm</span></span>
            </div>
          </div>
        </div>

        {/* Cột phải: Thông tin liên hệ */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-[16px] font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Thông tin liên hệ & Cơ bản</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {profile.email && (
                <div>
                  <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5"><Mail size={12}/> Email</p>
                  <p className="text-[14px] text-gray-900 font-medium break-all">{profile.email}</p>
                </div>
              )}
              
              {profile.phone && (
                <div>
                  <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5"><Phone size={12}/> Số điện thoại</p>
                  <p className="text-[14px] text-gray-900 font-medium">{profile.phone}</p>
                </div>
              )}

              {profile.dob && (
                <div>
                  <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5"><Calendar size={12}/> Ngày sinh</p>
                  <p className="text-[14px] text-gray-900 font-medium">{profile.dob}</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileAboutBox;