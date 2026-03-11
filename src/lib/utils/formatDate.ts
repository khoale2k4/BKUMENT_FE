export const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        month: "long",
        day: "numeric",
        timeZone: "Asia/Ho_Chi_Minh"
    };

    return new Date(dateString).toLocaleDateString("vi-VN", options);
};