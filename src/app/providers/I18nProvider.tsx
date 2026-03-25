"use client";

import React, { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../lib/utils/i18n"; // <-- TRỎ ĐÚNG ĐƯỜNG DẪN TỚI FILE i18n.ts BẠN TẠO LÚC TRƯỚC

export default function I18nProvider({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}