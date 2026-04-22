'use client';

import React from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AuthenticatedImage } from '@/components/ui/AuthenticatedImage';

interface Props {
  name: string;
  startDate: string;
  endDate: string;
  coverImageUrl?: string;
  isUploading?: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (field: string, value: string) => void;
}

const BasicInfoSection: React.FC<Props> = ({ name, startDate, endDate, coverImageUrl, isUploading, onUpload, onChange }) => {
  const { t } = useTranslation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">{t('classroom.create.form.coverImage', 'Course Cover Image')}</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative group w-full h-48 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all flex items-center justify-center"
        >
          {coverImageUrl ? (
            <AuthenticatedImage
              src={coverImageUrl}
              alt="Cover"
              className="w-full h-full object-cover"
              onError={(e: any) => {
                e.currentTarget.src = "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";
              }}
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400 group-hover:text-orange-500">
              <Camera size={40} />
              <span className="text-sm font-bold mt-2">{t('classroom.create.form.uploadImage', 'UPLOAD COVER IMAGE')}</span>
            </div>
          )}

          {coverImageUrl && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white w-10 h-10" />
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <Loader2 className="animate-spin text-orange-600 w-10 h-10" />
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onUpload}
          className="hidden"
          accept="image/*"
        />
        <p className="text-[11px] text-gray-400 italic mt-2">{t('classroom.create.form.imageRecommendation', '* Recommended size: 1200x480 pixels. Max size: 5MB.')}</p>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">{t('classroom.create.form.courseName', 'Course Name')}</label>
        <input
          type="text"
          placeholder={t('classroom.create.form.courseNamePlaceholder', 'Example: Basic ERD Practice Class')}
          className="w-full p-3 border border-gray-200 rounded-md outline-none focus:border-orange-500 transition-colors"
          value={name}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">{t('classroom.create.form.startDate', 'Start Date')}</label>
          <input
            type="date"
            className="w-full p-3 border border-gray-200 rounded-md outline-none focus:border-orange-500"
            value={startDate}
            onChange={(e) => onChange('startDate', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">{t('classroom.create.form.endDate', 'End Date')}</label>
          <input
            type="date"
            className="w-full p-3 border border-gray-200 rounded-md outline-none focus:border-orange-500"
            value={endDate}
            onChange={(e) => onChange('endDate', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;