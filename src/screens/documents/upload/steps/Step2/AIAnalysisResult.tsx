import React from "react";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

const AIAnalysisResult = ({ summary }: { summary: string }) => {
    const { t } = useTranslation();
    return (
        <div className="mx-6 mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl">
            <div className="flex items-start gap-3">
                <div className="shrink-0 p-2 bg-white rounded-lg shadow-sm">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-purple-900 mb-2">{t('documents.upload.aiTitle')}</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
                </div>
            </div>
        </div>
    );
};

export default AIAnalysisResult;