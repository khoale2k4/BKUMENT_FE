"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateMyInterests } from "@/lib/redux/features/profileSlice";
import { getSearchSubjects } from "@/lib/services/course.service";
import { Subject, Topic } from "@/types/course";
import { Button } from "@/components/ui/button";
import { AppRoute } from "@/lib/appRoutes";
import { Sparkles, Check, ChevronRight, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { showToast } from "@/lib/redux/features/toastSlice";

export default function OnboardingPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.profile);

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchTopics = async () => {
            try {
                const data = await getSearchSubjects();
                // Handle paginated response which often includes 'content' or 'data'
                const subjectList = Array.isArray(data) ? data : (data?.content || data?.data || []);
                setSubjects(subjectList);
            } catch (error) {
                console.error("Failed to fetch subjects:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTopics();
    }, []);

    const toggleTopic = (topicId: string) => {
        const newSelected = new Set(selectedTopics);
        if (newSelected.has(topicId)) {
            newSelected.delete(topicId);
        } else {
            newSelected.add(topicId);
        }
        setSelectedTopics(newSelected);
    };

    const handleFinish = async (skip: boolean = false) => {
        setIsSubmitting(true);
        const topicIds = skip ? [] : Array.from(selectedTopics);
        
        try {
            await dispatch(updateMyInterests(topicIds)).unwrap();
            
            // Set local flag to prevent redirect loop
            localStorage.setItem("vbook_onboarded", "true");
            
            dispatch(showToast({
                type: 'success',
                title: t('common.toast.success'),
                message: skip ? t('auth.onboarding.skipSuccess') : t('auth.onboarding.success')
            }));

            router.push(AppRoute.home);
        } catch (error: any) {
            dispatch(showToast({
                type: 'error',
                title: t('common.toast.error'),
                message: error || "Failed to update interests"
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!mounted || isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 text-gray-900 animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">
                    {mounted ? t('auth.onboarding.loading') : 'Tailoring your experience...'}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-white text-black selection:bg-black selection:text-white">
            {/* Left Side: Ultra-Minimalist Content */}
            <div className="w-full lg:w-1/2 flex flex-col h-screen overflow-hidden border-r border-gray-100">
                <div className="flex-1 overflow-y-auto px-8 py-16 md:px-16 lg:px-24 custom-scrollbar">
                    {/* Header */}
                    <header className="mb-16">
                        <h1 className="text-4xl font-bold tracking-tighter mb-4 uppercase">
                            {t('auth.onboarding.title', 'Interests')}
                        </h1>
                        <p className="text-sm font-light text-gray-500 max-w-sm leading-relaxed">
                            {t('auth.onboarding.subtitle', 'Select your areas of focus to personalize your daily feed.')}
                        </p>
                    </header>

                    {/* Vertical Content Flow */}
                    <main className="space-y-16 pb-20">
                        {subjects.map((subject) => (
                            <section key={subject.id} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 border-b border-gray-100 pb-2 text-gray-400">
                                    {subject.name}
                                </h2>
                                <div className="flex flex-wrap gap-2.5">
                                    {subject.topics.map((topic) => {
                                        const isSelected = selectedTopics.has(topic.id);
                                        return (
                                            <button
                                                key={topic.id}
                                                onClick={() => toggleTopic(topic.id)}
                                                className={clsx(
                                                    "cursor-pointer px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-150 border active:scale-95 active:opacity-80",
                                                    isSelected 
                                                        ? "bg-black border-black text-white" 
                                                        : "bg-white border-black text-black hover:bg-black hover:text-white"
                                                )}
                                            >
                                                {topic.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </main>
                </div>

                {/* Fixed Bottom Controls for Content Side */}
                <div className="p-8 bg-white border-t border-gray-100">
                    <div className="flex items-center justify-end gap-6">
                        <button 
                            onClick={() => handleFinish(true)}
                            disabled={isSubmitting}
                            className="cursor-pointer font-bold uppercase tracking-widest hover:underline disabled:opacity-30 text-gray-400"
                        >
                            {t('auth.onboarding.skip', 'Skip')}
                        </button>
                        
                        <button 
                            onClick={() => handleFinish(false)}
                            disabled={isSubmitting || selectedTopics.size === 0}
                            className={clsx(
                                "cursor-pointer px-10 py-4 rounded-full font-black border transition-all duration-200 uppercase tracking-widest",
                                selectedTopics.size > 0 
                                    ? "bg-black border-black text-white hover:opacity-90" 
                                    : "bg-white border-gray-200 text-gray-300 pointer-events-none"
                            )}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {t('auth.onboarding.finish', 'Continue')}
                                    {selectedTopics.size > 0 && <span className="ml-2 font-light opacity-50">/{selectedTopics.size}</span>}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side: Original Color Image */}
            <div className="hidden lg:block lg:w-1/2 relative bg-gray-50">
                <img
                    src="/svgs/login_background.svg"
                    alt="Onboarding"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-24 left-24 right-24 border-l-4 border-white pl-8 pt-2">
                    <p className="text-white text-5xl font-bold tracking-tighter leading-none mb-8 drop-shadow-lg">
                        LEARN<br />EVOLVE<br />SUCCEED
                    </p>
                    <p className="text-white/60 text-xs font-black uppercase tracking-[0.5em] drop-shadow-md">
                        Personalization Engine / v1.0
                    </p>
                </div>
            </div>
        </div>
    );
}
