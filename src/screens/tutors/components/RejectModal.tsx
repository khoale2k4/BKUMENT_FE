import React from 'react';
import { FilePenLine } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RejectModalProps {
  isOpen: boolean;
  tutorName: string;
  reason: string;
  onReasonChange: (reason: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  tutorName,
  reason,
  onReasonChange,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-100 text-red-600 rounded-full">
            <FilePenLine size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{t('tutors.rejectModal.title')}</h3>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {t('tutors.rejectModal.desc')} <strong>{tutorName}</strong>{t('tutors.rejectModal.descSuffix')}
        </p>

        <textarea
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder={t('tutors.rejectModal.placeholder')}
          rows={5}
          className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all resize-none text-sm leading-relaxed bg-gray-50 focus:bg-white"
        />

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-all active:scale-95"
          >
            {t('tutors.rejectModal.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!reason.trim()}
          >
            {t('tutors.rejectModal.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};