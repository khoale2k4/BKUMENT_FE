export function formatTimeAgo(date: string | Date | number, t_func?: (key: string, options?: any) => string): string {
    const past = new Date(date);
    const now = new Date();

    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const t = t_func || ((key: string, options?: any) => {
        const defaults: Record<string, string> = {
            'time.justNow': 'Just now',
            'time.secondsAgo': '{{count}} seconds ago',
            'time.minutesAgo': '{{count}} minutes ago',
            'time.hoursAgo': '{{count}} hours ago',
            'time.daysAgo': '{{count}} days ago',
            'time.weeksAgo': '{{count}} weeks ago',
            'time.monthsAgo': '{{count}} months ago',
            'time.yearsAgo': '{{count}} years ago'
        };
        let text = defaults[key] || key;
        if (options?.count !== undefined) {
            text = text.replace('{{count}}', options.count.toString());
        }
        return text;
    });

    if (diffInSeconds <= 0) return t('time.justNow');

    if (diffInSeconds < 60) {
        return t('time.secondsAgo', { count: diffInSeconds });
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return t('time.minutesAgo', { count: diffInMinutes });
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return t('time.hoursAgo', { count: diffInHours });
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return t('time.daysAgo', { count: diffInDays });
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInDays < 30) {
        return t('time.weeksAgo', { count: diffInWeeks });
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return t('time.monthsAgo', { count: diffInMonths });
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return t('time.yearsAgo', { count: diffInYears });
}