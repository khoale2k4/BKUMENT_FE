export const formatTimestamp = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        hour: '2-digit', minute: '2-digit', 
        day: '2-digit', month: '2-digit', year: '2-digit'
    });
};