"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { usePathname, useRouter } from "next/navigation";
import { getMyProfile } from "@/lib/redux/features/profileSlice";
import { AppRoute } from "@/lib/appRoutes";
import AppLoading from "@/components/ui/AppLoading";

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, status: authStatus } = useAppSelector((state) => state.auth);
    const { user } = useAppSelector((state) => state.profile);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkOnboarding = async () => {
            // Wait for auth to be initialized if it's currently loading
            if (authStatus === 'loading') return;

            if (!isAuthenticated) {
                setIsChecking(false);
                return;
            }

            // Also skip if they have the local storage flag
            if (typeof window !== "undefined" && localStorage.getItem("vbook_onboarded") === "true") {
                setIsChecking(false);
                return;
            }

            // Don't redirect if already on onboarding page (though onboarding is in (auth))
            if (pathname === AppRoute.onboarding) {
                setIsChecking(false);
                return;
            }

            // Fetch profile to be sure
            try {
                const refreshedUser = await dispatch(getMyProfile()).unwrap();
                const hasInterests = refreshedUser.interestedTopics && refreshedUser.interestedTopics.length > 0;
                
                if (!hasInterests && localStorage.getItem("vbook_onboarded") !== "true") {
                    router.push(AppRoute.onboarding);
                } else {
                    setIsChecking(false);
                }
            } catch (error) {
                console.error("Failed to fetch profile during onboarding check:", error);
                // On error, let them through to avoid blocking the app
                setIsChecking(false);
            }
        };

        checkOnboarding();
    }, [isAuthenticated, authStatus, pathname, dispatch, router]);

    // Show loading while checking interests for authenticated users
    if (isAuthenticated && isChecking) {
        return <AppLoading />;
    }

    return <>{children}</>;
}
