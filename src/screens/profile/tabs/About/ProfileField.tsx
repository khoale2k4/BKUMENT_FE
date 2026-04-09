import { useTranslation } from 'react-i18next';

export interface ProfileFieldProps {
  label: string;
  value: string | number | undefined | null;
  name: string;
  isEditing: boolean;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  icon?: React.ReactNode;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value, name, isEditing, type = "text", onChange, icon }) => {
  const { t } = useTranslation();
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
            placeholder={t('profile.user.fieldPlaceholder', `Enter your ${label.toLowerCase()}...`, { label: label.toLowerCase() })}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={displayValue}
            onChange={onChange}
            className="w-full p-0 py-1 text-lg text-gray-900 border-b border-gray-300 focus:border-black focus:ring-0 bg-transparent outline-none transition-colors placeholder:text-gray-300"
            placeholder={t('profile.user.fieldPlaceholder', `Enter your ${label.toLowerCase()}...`, { label: label.toLowerCase() })}
          />
        )
      ) : (
        <p className={`text-lg text-gray-800 py-1 border-b border-transparent ${!displayValue && 'italic text-gray-400'}`}>
          {displayValue || t('profile.user.about.notUpdated', 'Not provided')}
        </p>
      )}
    </div>
  );
};

export default ProfileField;