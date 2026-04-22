"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import CourseRichTextEditor from "./CourseRichTextEditor";

interface Props {
  description: string;
  onChange: (value: string) => void;
}

const DescriptionSection: React.FC<Props> = ({ description, onChange }) => {
  const { t } = useTranslation();

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Description
      </label>
      {/* Thay vì textarea, chúng ta dùng Editor */}
      <CourseRichTextEditor
        value={description || ""}
        onChange={(htmlValue) => onChange(htmlValue)}
      />
    </div>
  );
};

export default DescriptionSection;
