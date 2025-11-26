export function formatTimeAgo(date: string | Date | number): string {
    const past = new Date(date);
    const now = new Date();

    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 0) return "Now";

    if (diffInSeconds < 60) {
        return `${diffInSeconds > 1 ? diffInSeconds: "a"} second${diffInSeconds > 1 ? "s" : ""} ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes > 1 ? diffInMinutes: "a"} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours > 1 ? diffInHours: "a"} hour${diffInHours > 1 ? "s" : ""} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays > 1 ? diffInDays: "a"} day${diffInDays > 1 ? "s" : ""} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks > 1 ? diffInWeeks: "a"} week${diffInWeeks > 1 ? "s" : ""} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths > 1 ? diffInMonths: "a"} month${diffInMonths > 1 ? "s" : ""} ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears > 1 ? diffInYears: "a"} year${diffInYears > 1 ? "s" : ""} ago`;
}