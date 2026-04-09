'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  description: string;
  onChange: (value: string) => void;
}

const DescriptionSection: React.FC<Props> = ({ description, onChange }) => {
  const { t } = useTranslation();

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{t('classroom.create.sections.description', 'Description')}</label>
      <textarea 
        className="w-full p-3 border border-gray-200 rounded-md min-h-[120px] outline-none focus:border-orange-500 resize-y"
        placeholder={t('classroom.create.form.descriptionPlaceholder', 'Detailed description for the class...')}
        value={description} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  );
};

export default DescriptionSection;