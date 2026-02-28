import React, { useState, useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { FileUploadItem } from "@/types/FileUpload";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { searchCourses, searchUniversities, type Course } from "@/lib/redux/features/documentSlice";
import AutocompleteField from "@/components/documents/upload/AutocompleteField";
import TagManager from "@/components/documents/upload/TagManager";
import VisibilityToggle from "@/components/documents/upload/VisibilityToggle";
import FileItemHeader from "@/components/documents/upload/FileItemHeader";

interface FileDescriptionProps {
    files: FileUploadItem[];
    onFilesChange: (files: FileUploadItem[]) => void;
}

const FileItemEditor = ({
    file,
    onUpdate,
    onDelete
}: {
    file: FileUploadItem;
    onUpdate: (field: keyof FileUploadItem, value: any) => void;
    onDelete: () => void;
}) => {
    const dispatch = useAppDispatch();
    const { universities, universitiesStatus, courses, coursesStatus } = useAppSelector(
        (state) => state.documents
    );

    // Track if data has been fetched to avoid redundant API calls
    const [hasUniversitiesFetched, setHasUniversitiesFetched] = useState(false);
    const [hasCoursesFetched, setHasCoursesFetched] = useState(false);

    // Track when user is selecting from dropdown (to prevent triggering search)
    const [isSelectingUniversity, setIsSelectingUniversity] = useState(false);
    const [isSelectingCourse, setIsSelectingCourse] = useState(false);

    // University autocomplete states
    const [universityQuery, setUniversityQuery] = useState(file.university || "");
    const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
    const [selectedUniversityId, setSelectedUniversityId] = useState<string | null>(null);
    const universityDebounceTimer = useRef<NodeJS.Timeout | null>(null);
    const universityDropdownRef = useRef<HTMLDivElement | null>(null);

    // Course autocomplete states
    const [courseQuery, setCourseQuery] = useState(file.subject || "");
    const [showCourseDropdown, setShowCourseDropdown] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const courseDebounceTimer = useRef<NodeJS.Timeout | null>(null);
    const courseDropdownRef = useRef<HTMLDivElement | null>(null);

    // Topic autocomplete states (no API calls, filter from selected course)  
    const [topicQuery, setTopicQuery] = useState(file.topic || "");
    const [showTopicDropdown, setShowTopicDropdown] = useState(false);
    const topicDropdownRef = useRef<HTMLDivElement | null>(null);

    // Filtered topics from selected course
    const [filteredTopics, setFilteredTopics] = useState<{ id: string; name: string }[]>([]);

    // Click outside detection
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

    // Debounced university search (only when typing)
    useEffect(() => {
        // Skip if user is selecting from dropdown
        if (isSelectingUniversity) {
            return;
        }

        if (universityDebounceTimer.current) {
            clearTimeout(universityDebounceTimer.current);
        }

        if (universityQuery.trim().length > 0) {
            universityDebounceTimer.current = setTimeout(() => {
                dispatch(searchUniversities(universityQuery));
                setHasUniversitiesFetched(true);
                setShowUniversityDropdown(true);
            }, 1000);
        } else {
            setShowUniversityDropdown(false);
        }

        return () => {
            if (universityDebounceTimer.current) {
                clearTimeout(universityDebounceTimer.current);
            }
        };
    }, [universityQuery, dispatch]);

    // Debounced course search (only when typing)
    useEffect(() => {
        // Skip if user is selecting from dropdown
        if (isSelectingCourse) {
            return;
        }

        if (courseDebounceTimer.current) {
            clearTimeout(courseDebounceTimer.current);
        }

        if (courseQuery.trim().length > 0) {
            courseDebounceTimer.current = setTimeout(() => {
                dispatch(searchCourses(courseQuery));
                setHasCoursesFetched(true);
                setShowCourseDropdown(true);
            }, 1000);
        } else {
            setShowCourseDropdown(false);
        }

        return () => {
            if (courseDebounceTimer.current) {
                clearTimeout(courseDebounceTimer.current);
            }
        };
    }, [courseQuery, dispatch]);

    // Filter topics when course changes or topic query changes
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
        setIsSelectingUniversity(true); // Prevent triggering search on query change
        setUniversityQuery(university.name);
        setSelectedUniversityId(university.id.toString());
        onUpdate("university", university.name);
        onUpdate("universityId", university.id.toString());
        setShowUniversityDropdown(false);
        // Reset flag after React state updates
        setTimeout(() => setIsSelectingUniversity(false), 0);
    };

    const handleCourseSelect = (course: Course) => {
        setIsSelectingCourse(true); // Prevent triggering search on query change
        setCourseQuery(course.name);
        setSelectedCourse(course);
        onUpdate("subject", course.name);
        onUpdate("courseId", course.id);
        setShowCourseDropdown(false);
        // Reset flag after React state updates
        setTimeout(() => setIsSelectingCourse(false), 0);

        // Reset topic when course changes
        setTopicQuery("");
        onUpdate("topic", "");
        onUpdate("topicId", "");
        setFilteredTopics(course.topics || []);
    };

    // Handle university input focus
    const handleUniversityFocus = () => {
        if (!hasUniversitiesFetched) {
            // Fetch all universities on first focus
            dispatch(searchUniversities(""));
            setHasUniversitiesFetched(true);
        }
        // Show dropdown if we have universities
        if (universities.length > 0) {
            setShowUniversityDropdown(true);
        }
    };

    // Handle course input focus
    const handleCourseFocus = () => {
        if (!hasCoursesFetched) {
            // Fetch all courses on first focus
            dispatch(searchCourses(""));
            setHasCoursesFetched(true);
        }
        // Show dropdown if we have courses
        if (courses.length > 0) {
            setShowCourseDropdown(true);
        }
    };

    // Handle topic input focus
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
            {/* Header */}
            <FileItemHeader
                fileName={file.name}
                fileType={file.type}
                fileSize={file.size}
                status={file.status}
                onDelete={onDelete}
            />

            {/* AI Analysis Result */}
            {file.status === 'success' && file.summary && (
                <div className="mx-6 mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl">
                    <div className="flex items-start gap-3">
                        <div className="shrink-0 p-2 bg-white rounded-lg shadow-sm">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-purple-900 mb-2">AI Analysis Result</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">{file.summary}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Section */}
            <div className="p-6 space-y-6 overflow-visible">
                {/* Title */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <label className="md:col-span-3 text-base font-bold text-black">Title:</label>
                    <div className="md:col-span-9">
                        <input
                            type="text"
                            value={file.title || ""}
                            onChange={(e) => onUpdate("title", e.target.value)}
                            placeholder="Enter document title..."
                            className="w-full px-4 py-2.5 border border-black rounded-lg outline-none focus:ring-2 focus:ring-black/20 text-sm transition-all"
                        />
                    </div>
                </div>

                {/* Course */}
                <AutocompleteField
                    label="Course"
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
                    placeholder="Type to search course..."
                    renderItem={(course) => (
                        <div className="text-sm text-gray-900">{course.id} - {course.name}</div>
                    )}
                    dropdownRef={courseDropdownRef}
                />

                {/* Topic */}
                <AutocompleteField
                    label="Topic"
                    value={topicQuery}
                    onChange={setTopicQuery}
                    onFocus={handleTopicFocus}
                    onSelect={handleTopicSelect}
                    items={filteredTopics}
                    showDropdown={showTopicDropdown}
                    disabled={!selectedCourse}
                    placeholder={!selectedCourse ? "Please select a course first" : "Type to search topic..."}
                    renderItem={(topic) => (
                        <div className="text-sm text-gray-900">{topic.name}</div>
                    )}
                    dropdownRef={topicDropdownRef}
                />

                {/* Description */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <label className="md:col-span-3 text-base font-bold text-black pt-2">Description:</label>
                    <div className="md:col-span-9">
                        <textarea
                            value={file.description || ""}
                            onChange={(e) => onUpdate("description", e.target.value)}
                            rows={4}
                            placeholder="Enter document description..."
                            className="w-full px-4 py-2.5 border border-black rounded-lg outline-none focus:ring-2 focus:ring-black/20 text-sm resize-none transition-all"
                        />
                    </div>
                </div>

                {/* Keywords */}
                <TagManager
                    tags={file.keywords || []}
                    onAdd={(tag) => onUpdate("keywords", [...(file.keywords || []), tag])}
                    onRemove={(tag) => onUpdate("keywords", (file.keywords || []).filter(t => t !== tag))}
                />

                {/* University */}
                <AutocompleteField
                    label="University"
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
                    placeholder="Type to search university..."
                    renderItem={(university) => (
                        <div className="text-sm text-gray-900">
                            <span className="font-semibold">{university.abbreviation}</span> - {university.name}
                        </div>
                    )}
                    dropdownRef={universityDropdownRef}
                />

                {/* Visibility */}
                <VisibilityToggle
                    value={file.visibility}
                    onChange={(value) => onUpdate("visibility", value)}
                />
            </div>
        </div>
    );
};

const FileDescription = ({ files = [], onFilesChange }: FileDescriptionProps) => {
    const handleDetailChange = (localId: string, field: keyof FileUploadItem, value: string | string[]) => {
        if (!onFilesChange) return;

        const updatedFiles = files.map((file) =>
            file.localId === localId ? { ...file, [field]: value } : file
        );

        onFilesChange(updatedFiles);
    };

    const handleDeleteFile = (localId: string) => {
        if (!onFilesChange) return;

        const updatedFiles = files.filter((f) => f.localId !== localId);
        onFilesChange(updatedFiles);
    };

    return (
        <div className="w-full max-w-5xl mx-auto overflow-visible">
            {files.length === 0 ? (
                <div className="p-10 text-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-400">
                    Chưa có file nào để nhập thông tin
                </div>
            ) : (
                files.map((file) => (
                    <FileItemEditor
                        key={file.localId}
                        file={file}
                        onUpdate={(field, value) => handleDetailChange(file.localId, field, value)}
                        onDelete={() => handleDeleteFile(file.localId)}
                    />
                ))
            )}
        </div>
    );
};

export default FileDescription;