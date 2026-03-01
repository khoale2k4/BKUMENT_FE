import { io, Socket } from 'socket.io-client';
import { AppDispatch } from '../redux/store';
import { addMessage, receiveSocketMessageThunk } from '../redux/features/chatSlice';

class SocketService {
    private socket: Socket | null = null;
    private dispatch: AppDispatch | null = null;

    public connect(token: string, dispatch: AppDispatch) {
        this.dispatch = dispatch;

        if (this.socket && this.socket.connected) return;

        this.socket = io('http://localhost:8099', {
            transports: ['websocket', 'polling'], 
            query: {
                token: token 
            },
            reconnection: true, 
            reconnectionAttempts: 10,
            reconnectionDelay: 2000,
        });

        this.socket.on('connect', () => {
            console.log('Đã kết nối Socket.IO thành công! ID:', this.socket?.id);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Đã ngắt kết nối Socket.IO. Lý do:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Lỗi kết nối Socket.IO:', error.message);
        });


        this.socket.on('message', (rawMessage) => {
            console.log('Có tin nhắn mới:', rawMessage);
            
            try {
                const messageData = typeof rawMessage === 'string' ? JSON.parse(rawMessage) : rawMessage;
                
                if (this.dispatch) {
                    console.log('Đã gọi được dispatch với Object:', messageData);
                    this.dispatch(receiveSocketMessageThunk(messageData));
                }
            } catch (error) {
                console.error("Lỗi khi parse tin nhắn từ Socket:", error);
            }
        });

        this.socket.on('notification', (notification) => {
            // TODO: add modal notification
            console.log('Có thông báo mới:', notification);
        });
    }

    public disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            console.log('Chủ động ngắt kết nối Socket.IO');
        }
    }
}

export const socketService = new SocketService();