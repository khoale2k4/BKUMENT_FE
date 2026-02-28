import { io, Socket } from 'socket.io-client';
import { AppDispatch } from '../redux/store';
import { addMessage } from '../redux/features/chatSlice';

class SocketService {
    private socket: Socket | null = null;
    private dispatch: AppDispatch | null = null;

    // Khởi tạo kết nối
    public connect(token: string, dispatch: AppDispatch) {
        this.dispatch = dispatch;

        // Tránh kết nối trùng lặp
        if (this.socket && this.socket.connected) return;

        // Kết nối tới server Socket.IO (Cổng 8099)
        this.socket = io('http://localhost:8099', {
            transports: ['websocket', 'polling'], // Ưu tiên websocket
            query: {
                token: token // BẮT BUỘC: Truyền token vào query param để BE bắt được qua getSingleUrlParam("token")
            },
            reconnection: true, // Tự động kết nối lại nếu rớt mạng
            reconnectionAttempts: 10,
            reconnectionDelay: 2000,
        });

        // --- LẮNG NGHE SỰ KIỆN HỆ THỐNG ---
        
        this.socket.on('connect', () => {
            console.log('✅ Đã kết nối Socket.IO thành công! ID:', this.socket?.id);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ Đã ngắt kết nối Socket.IO. Lý do:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('⚠️ Lỗi kết nối Socket.IO:', error.message);
        });

        // --- LẮNG NGHE SỰ KIỆN NGHIỆP VỤ (Giao tiếp với BE) ---

        // Ví dụ 1: Lắng nghe tin nhắn mới từ bất kỳ cuộc trò chuyện nào
        this.socket.on('receive_message', (messageData) => {
            console.log('📬 Có tin nhắn mới từ BE:', messageData);
            
            // Đẩy dữ liệu vào Redux Store để UI tự động cập nhật
            if (this.dispatch) {
                // Đảm bảo messageData có cấu trúc khớp với ChatMessage interface trong chatSlice
                this.dispatch(addMessage(messageData));
            }
        });

        // Ví dụ 2: Lắng nghe thông báo hệ thống (Notification)
        this.socket.on('receive_notification', (notification) => {
            console.log('🔔 Có thông báo mới:', notification);
            // Dispatch action thêm notification vào Redux hoặc gọi Toast popup
        });
    }

    public disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            console.log('🔌 Chủ động ngắt kết nối Socket.IO');
        }
    }
}

export const socketService = new SocketService();