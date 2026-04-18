'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getClassDocuments } from '@/lib/redux/features/tutorCourseSlice';
import ContentCard from '@/screens/home/contentCard/ContentCard';
import ContentCardSkeleton from '@/screens/home/contentCard/ContentCardSkeleton';
import Pagination from '@/components/ui/Pagination';
import { useRouter } from 'next/navigation';
import { AppRoute } from '@/lib/appRoutes';

const ResourcesTab = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { currentClassDetail: currentCourse } = useAppSelector((state) => state.tutorFinding);
  const {
    classDocuments = [],
    loadingDocuments = false,
    documentsCurrentPage = 1,
    documentsTotalPages = 1
  } = useAppSelector((state) => state.tutorCourse || {});
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const userStatus = currentCourse?.userStatus || 'NONE';
  const isOwner = userStatus === 'OWNER';
  const isApprovedStudent = userStatus === 'APPROVED' || userStatus === 'STUDENT';

  useEffect(() => {
    if (currentCourse?.id) {
      dispatch(getClassDocuments({ courseId: currentCourse.id, page: 0, size: 5 }));
    }
  }, [dispatch, currentCourse?.id]);

  const handlePageChange = (newPage: number) => {
    if (currentCourse?.id) {
      dispatch(getClassDocuments({ courseId: currentCourse.id, page: newPage - 1, size: 5 }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onDocumentClick = (id: string) => {
    router.push(AppRoute.documents.id(id));
  };

  if (!isOwner && !isApprovedStudent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-gray-100 p-8 shadow-sm animate-in fade-in duration-500">
        <ShieldAlert size={64} className="text-gray-300 mb-6" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">{t('classroom.members.accessDenied')}</h3>
        <p className="text-gray-500 text-center max-w-md">
          {t('classroom.resources.accessDeniedDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 font-sans animate-in fade-in duration-500 shadow-sm border border-gray-100">

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 border-b-2 border-green-500 pb-2 inline-block">
          {t('classroom.resources.title')}
        </h2>
        {isOwner && (
          <Link
            href={`/course/${currentCourse?.id}/document_upload`}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold text-sm transition-colors shadow-sm active:scale-95 flex items-center gap-2"
          >
            {t('classroom.resources.upload')}
          </Link>
        )}
      </div>

      <div className="space-y-4 mt-4">
        {loadingDocuments ? (
          <>
            {[1, 2, 3].map(i => <ContentCardSkeleton key={"skeleton-" + i} />)}
          </>
        ) : classDocuments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {classDocuments.map((doc: any) => (
              <ContentCard
                key={doc.id}
                data={{
                  ...doc,
                  token: token,
                  onClick: () => onDocumentClick(doc.id),
                  views: doc.views || 0,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
            {t('classroom.resources.empty')}
          </div>
        )}
      </div>

      {!loadingDocuments && classDocuments.length > 0 && (
        <div className="mt-8">
          <Pagination
            currentPage={documentsCurrentPage + 1}
            totalPages={documentsTotalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ResourcesTab;