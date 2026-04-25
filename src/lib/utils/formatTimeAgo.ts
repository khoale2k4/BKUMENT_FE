export function formatTimeAgo(date: string | Date | number, t_func?: (key: string, options?: any) => string): string {
    const past = new Date(date);
    const now = new Date();

    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const t = t_func || ((key: string, options?: any) => {
        const defaults: Record<string, string> = {
            'common.justNow': 'Just now',
            'common.time.secondsAgo': '{{count}} seconds ago',
            'common.time.minutesAgo': '{{count}} minutes ago',
            'common.time.hoursAgo': '{{count}} hours ago',
            'common.time.daysAgo': '{{count}} days ago',
            'common.time.weeksAgo': '{{count}} weeks ago',
            'common.time.monthsAgo': '{{count}} months ago',
            'common.time.yearsAgo': '{{count}} years ago'
        };
        let text = defaults[key] || key;
        if (options?.count !== undefined) {
            text = text.replace('{{count}}', options.count.toString());
        }
        return text;
    });

    if (diffInSeconds <= 0) return t('common.justNow');

    if (diffInSeconds < 60) {
        return t('common.time.secondsAgo', { count: diffInSeconds });
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return t('common.time.minutesAgo', { count: diffInMinutes });
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return t('common.time.hoursAgo', { count: diffInHours });
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return t('common.time.daysAgo', { count: diffInDays });
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInDays < 30) {
        return t('common.time.weeksAgo', { count: diffInWeeks });
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return t('common.time.monthsAgo', { count: diffInMonths });
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return t('common.time.yearsAgo', { count: diffInYears });
}