
import { addMessage, receiveSocketMessageThunk } from '../redux/features/chatSlice';
import { API_ENDPOINTS } from '../apiEndPoints';

import { io, Socket } from "socket.io-client";
import { AppDispatch } from "../redux/store";
import {
  getUnreadNotificationCount,
  getAppNotifications,
  showNotification,
} from "../redux/features/modalSlice";
import { showToast } from "../redux/features/toastSlice";
class SocketService {
  private socket: Socket | null = null;
  private dispatch: AppDispatch | null = null;

  public connect(token: string, dispatch: AppDispatch) {
    this.dispatch = dispatch;

    if (this.socket && this.socket.connected) return;

        this.socket = io(API_ENDPOINTS.SOCKET.CONNECT_URL, {
            transports: ['websocket', 'polling'], 
            query: {
                token: token 
            },
            reconnection: true, 
            reconnectionAttempts: 10,
            reconnectionDelay: 2000,
        });

    this.socket.on("connect", () => {
      console.log("Đã kết nối Socket.IO thành công! ID:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Đã ngắt kết nối Socket.IO. Lý do:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Lỗi kết nối Socket.IO:", error.message);
    });

    this.socket.on("message", (rawMessage) => {
      console.log("Có tin nhắn mớiii:", rawMessage);

      try {
        const messageData =
          typeof rawMessage === "string" ? JSON.parse(rawMessage) : rawMessage;

        if (this.dispatch) {
          console.log("Đã gọi được dispatch với Object:", messageData);
          this.dispatch(receiveSocketMessageThunk(messageData));
        }
      } catch (error) {
        console.error("Lỗi khi parse tin nhắn từ Socket:", error);
      }
    });

    // this.socket.on('notification', (notification) => {
    //     // TODO: add modal notification
    //     console.log('Có thông báo mới:', notification);
    // });

    this.socket.on("notification", (rawNotification) => {
      console.log("Có thông báo mới:", rawNotification);

      try {
        const notificationData =
          typeof rawNotification === "string"
            ? JSON.parse(rawNotification)
            : rawNotification;

        if (this.dispatch) {
          // 1. Cập nhật lại cục badge màu đỏ trên quả chuông
          this.dispatch(getUnreadNotificationCount());

          this.dispatch(getAppNotifications({ page: 1, size: 20 }));

         this.dispatch(
            showToast({
              type: "info",
              title: notificationData.title || "Thông báo mới",
              message:
                notificationData.message ||
                "Bạn vừa nhận được một thông báo mới.",
            }),
          );

        //   this.dispatch(
        //     showNotification({
        //       type: "info",
        //       title: notificationData.title || "Thông báo mới",
        //       message:
        //         notificationData.message ||
        //         "Bạn vừa nhận được một thông báo mới.",
        //     }),
        //   );
        }
      } catch (error) {
        console.error("Lỗi khi xử lý notification từ Socket:", error);
      }
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("Chủ động ngắt kết nối Socket.IO");
    }
  }
}

export const socketService = new SocketService();
