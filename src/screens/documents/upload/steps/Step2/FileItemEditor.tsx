"use client";

import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useRef } from "react";
import { FileUploadItem } from "@/types/FileUpload";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { searchCourses, searchUniversities, type Course } from "@/lib/redux/features/documentSlice";
import AutocompleteField from "@/components/documents/upload/AutocompleteField";
import TagManager from "@/components/documents/upload/TagManager";
import VisibilityToggle from "@/components/documents/upload/VisibilityToggle";
import FileItemHeader from "@/components/documents/upload/FileItemHeader";
import AIAnalysisResult from "./AIAnalysisResult";

const FileItemEditor = ({
    file,
    onUpdate,
    onDelete
}: {
    file: FileUploadItem;
    onUpdate: (field: keyof FileUploadItem, value: any) => void;
    onDelete: () => void;
}) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { universities, universitiesStatus, courses, coursesStatus } = useAppSelector(
        (state) => state.documents
    );

    const [hasUniversitiesFetched, setHasUniversitiesFetched] = useState(false);
    const [hasCoursesFetched, setHasCoursesFetched] = useState(false);

    const skipUniversitySearch = useRef(false);
    const skipCourseSearch = useRef(false);

    const [universityQuery, setUniversityQuery] = useState(file.university || "");
    const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
    const [selectedUniversityId, setSelectedUniversityId] = useState<string | null>(null);
    const universityDebounceTimer = useRef<NodeJS.Timeout | null>(null);
    const universityDropdownRef = useRef<HTMLDivElement>(null);

    const [courseQuery, setCourseQuery] = useState(file.subject || "");
    const [showCourseDropdown, setShowCourseDropdown] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const courseDebounceTimer = useRef<NodeJS.Timeout | null>(null);
    const courseDropdownRef = useRef<HTMLDivElement>(null);

    const [topicQuery, setTopicQuery] = useState(file.topic || "");
    const [showTopicDropdown, setShowTopicDropdown] = useState(false);
    const topicDropdownRef = useRef<HTMLDivElement>(null);

    const [filteredTopics, setFilteredTopics] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (universityDropdownRef.current && !universityDropdownRef.current.contains(event.target as Node)) {
                setShowUniversityDropdown(false);
            }
            if (courseDropdownRef.current && !courseDropdownRef.current.contains(event.target as Node)) {
                setShowCourseDropdown(false);
            }
            if (topicDropdownRef.current && !topicDropdownRef.current.contains(event.target as Node)) {
                setShowTopicDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (skipUniversitySearch.current) {
            skipUniversitySearch.current = false;
            return;
        }

        if (universityDebounceTimer.current) clearTimeout(universityDebounceTimer.current);

        if (universityQuery.trim().length > 0) {
            setShowUniversityDropdown(true);
            universityDebounceTimer.current = setTimeout(() => {
                dispatch(searchUniversities(universityQuery));
                setHasUniversitiesFetched(true);
            }, 500);
        } else {
            setShowUniversityDropdown(false);
        }

        return () => clearTimeout(universityDebounceTimer.current!);
    }, [universityQuery, dispatch]);

    useEffect(() => {
        if (skipCourseSearch.current) {
            skipCourseSearch.current = false;
            return;
        }

        if (courseDebounceTimer.current) clearTimeout(courseDebounceTimer.current);

        if (courseQuery.trim().length > 0) {
            setShowCourseDropdown(true);
            courseDebounceTimer.current = setTimeout(() => {
                dispatch(searchCourses(courseQuery));
                setHasCoursesFetched(true);
            }, 500);
        } else {
            setShowCourseDropdown(false);
        }

        return () => clearTimeout(courseDebounceTimer.current!);
    }, [courseQuery, dispatch]);

    useEffect(() => {
        if (selectedCourse && selectedCourse.topics) {
            const filtered = selectedCourse.topics.filter((topic) =>
                topicQuery ? topic.name.toLowerCase().includes(topicQuery.toLowerCase()) : true
            );
            setFilteredTopics(filtered);
            if (filtered.length > 0 && topicQuery) {
                setShowTopicDropdown(true);
            }
        } else {
            setFilteredTopics([]);
        }
    }, [selectedCourse, topicQuery]);

    const handleUniversitySelect = (university: { id: number; name: string; abbreviation: string; logoUrl: string | null }) => {
        skipUniversitySearch.current = true;
        setUniversityQuery(university.name);
        setSelectedUniversityId(university.id.toString());
        onUpdate("university", university.name);
        onUpdate("universityId", university.id.toString());
        setShowUniversityDropdown(false);
    };

    const handleCourseSelect = (course: Course) => {
        skipCourseSearch.current = true;
        setCourseQuery(course.name);
        setSelectedCourse(course);
        onUpdate("subject", course.name);
        onUpdate("courseId", course.id);
        setShowCourseDropdown(false);

        setTopicQuery("");
        onUpdate("topic", "");
        onUpdate("topicId", "");
        setFilteredTopics(course.topics || []);
    };

    const handleUniversityFocus = () => {
        if (!hasUniversitiesFetched) {
            dispatch(searchUniversities(""));
            setHasUniversitiesFetched(true);
        }
        if (universities.length > 0) {
            setShowUniversityDropdown(true);
        }
    };

    const handleCourseFocus = () => {
        if (!hasCoursesFetched) {
            dispatch(searchCourses(""));
            setHasCoursesFetched(true);
        }
        if (courses.length > 0) {
            setShowCourseDropdown(true);
        }
    };

    const handleTopicFocus = () => {
        if (selectedCourse && filteredTopics.length > 0) {
            setShowTopicDropdown(true);
        }
    };

    const handleTopicSelect = (topic: { id: string; name: string }) => {
        setTopicQuery(topic.name);
        onUpdate("topic", topic.name);
        onUpdate("topicId", topic.id);
        setShowTopicDropdown(false);
    };

    return (
        <div className={`bg-white border rounded-3xl shadow-sm overflow-visible transition-all hover:shadow-md mb-8 ${file.status === 'analyzing' ? 'border-blue-200 ring-4 ring-blue-50' : 'border-gray-200'}`}>
            <FileItemHeader
                fileName={file.name}
                fileType={file.type}
                fileSize={file.size}
                status={file.status}
                onDelete={onDelete}
            />

            {file.status === 'success' && file.summary && (
                <AIAnalysisResult summary={file.summary} />
            )}

            <div className="p-6 space-y-6 overflow-visible">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <label className="md:col-span-3 text-base font-bold text-black">{t('documents.upload.step2.fileTitle')}:</label>
                    <div className="md:col-span-9">
                        <input
                            type="text"
                            value={file.title || ""}
                            onChange={(e) => onUpdate("title", e.target.value)}
                            placeholder={t('documents.upload.step2.placeholderTitle', 'Enter document title...')}
                            className="w-full px-4 py-2.5 border border-black rounded-lg outline-none focus:ring-2 focus:ring-black/20 text-sm transition-all"
                        />
                    </div>
                </div>

                <AutocompleteField
                    label={t('documents.upload.step2.course', 'Course')}
                    value={courseQuery}
                    onChange={(value) => {
                        setCourseQuery(value);
                        setSelectedCourse(null);
                    }}
                    onFocus={handleCourseFocus}
                    onSelect={handleCourseSelect}
                    items={courses}
                    isLoading={coursesStatus === 'loading'}
                    showDropdown={showCourseDropdown}
                    placeholder={t('documents.upload.step2.placeholderCourse', 'Select course...')}
                    renderItem={(course) => (
                        <div className="text-sm text-gray-900">{course.id} - {course.name}</div>
                    )}
                    dropdownRef={courseDropdownRef}
                />

                <AutocompleteField
                    label={t('documents.upload.step2.topic', 'Topic')}
                    value={topicQuery}
                    onChange={setTopicQuery}
                    onFocus={handleTopicFocus}
                    onSelect={handleTopicSelect}
                    items={filteredTopics}
                    showDropdown={showTopicDropdown}
                    disabled={!selectedCourse}
                    placeholder={!selectedCourse ? t('documents.upload.step2.placeholderCourse', 'Select course...') : t('documents.upload.step2.placeholderTopic', 'Select topic...')}
                    renderItem={(topic) => (
                        <div className="text-sm text-gray-900">{topic.name}</div>
                    )}
                    dropdownRef={topicDropdownRef}
                />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <label className="md:col-span-3 text-base font-bold text-black pt-2">{t('documents.upload.step2.fileDescription', 'Description')}:</label>
                    <div className="md:col-span-9">
                        <textarea
                            value={file.description || ""}
                            onChange={(e) => onUpdate("description", e.target.value)}
                            rows={4}
                            placeholder={t('documents.upload.step2.placeholderDesc', 'Briefly describe the document contents...')}
                            className="w-full px-4 py-2.5 border border-black rounded-lg outline-none focus:ring-2 focus:ring-black/20 text-sm resize-none transition-all"
                        />
                    </div>
                </div>

                <TagManager
                    tags={file.keywords || []}
                    onAdd={(tag) => onUpdate("keywords", [...(file.keywords || []), tag])}
                    onRemove={(tag) => onUpdate("keywords", (file.keywords || []).filter(t => t !== tag))}
                />

                <AutocompleteField
                    label={t('documents.upload.step2.university', 'University')}
                    value={universityQuery}
                    onChange={(value) => {
                        setUniversityQuery(value);
                        setSelectedUniversityId(null);
                    }}
                    onFocus={handleUniversityFocus}
                    onSelect={handleUniversitySelect}
                    items={universities}
                    isLoading={universitiesStatus === 'loading'}
                    showDropdown={showUniversityDropdown}
                    placeholder={t('documents.upload.step2.placeholderUni', 'Select university...')}
                    renderItem={(university) => (
                        <div className="text-sm text-gray-900">
                            <span className="font-semibold">{university.abbreviation}</span> - {university.name}
                        </div>
                    )}
                    dropdownRef={universityDropdownRef}
                />

                <VisibilityToggle
                    value={file.visibility}
                    onChange={(value) => onUpdate("visibility", value)}
                />
            </div>
        </div>
    );
};

export default FileItemEditor;