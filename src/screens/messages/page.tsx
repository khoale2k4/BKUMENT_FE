"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
// Import các actions và type từ slice của bạn (Đổi đường dẫn cho đúng dự án)
import { 
    fetchConversations, 
    fetchMessagesByConversationId, 
    setActiveConversation,
    Conversation
} from "@/lib/redux/features/chatSlice"; 
import { AppDispatch, RootState } from "@/lib/redux/store";

// --- HÀM HELPER FORMAT TIME ---
const formatTimestamp = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        hour: '2-digit', minute: '2-digit', 
        day: '2-digit', month: '2-digit', year: '2-digit'
    });
};

// Giả định ID của user đang đăng nhập (Bạn lấy từ AuthSlice hoặc Context nhé)
const CURRENT_USER_ID = "u0"; 

// Hàm helper để lấy Tên và Avatar hiển thị cho Conversation
const getChatDisplayInfo = (chat: Conversation, currentUserId: string) => {
    if (chat.type === 'GROUP') {
        return { 
            name: chat.name || "Nhóm trò chuyện", 
            // Nếu Java entity chưa có avatarUrl cho group, ta dùng ảnh mặc định
            avatar: "https://ui-avatars.com/api/?name=Group&background=random" 
        };
    }
    // Nếu là DIRECT chat, lấy thông tin của người kia
    const otherUser = chat.participants.find(p => p.userId !== currentUserId) || chat.participants[0];
    if (!otherUser) return { name: "Unknown", avatar: "" };
    
    return { 
        name: `${otherUser.lastName} ${otherUser.firstName}`.trim() || otherUser.username, 
        avatar: otherUser.avatar 
    };
};


// --- COMPONENT: CÁC CUỘC TRÒ CHUYỆN (SIDEBAR PHẢI) ---
const ChatListSidebar = ({ isOpen, currentUserId }: { isOpen: boolean, currentUserId: string }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { conversations, activeConversationId } = useSelector((state: RootState) => state.chat);

    return (
        <div className={`transition-all duration-300 ease-in-out bg-white h-full border-l border-gray-200 overflow-hidden ${isOpen ? "w-80 opacity-100" : "w-0 opacity-0 border-l-0"}`}>
            <div className="w-80 flex flex-col h-full">
                <div className="p-4 shrink-0">
                    <h2 className="text-2xl font-bold mb-4">Chats</h2>
                    <div className="relative">
                        <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search for chats, messages ..."
                            className="w-full bg-gray-50 text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none border border-gray-100"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.map((chat: any) => {
                        const { name, avatar } = getChatDisplayInfo(chat, currentUserId);
                        const isActive = chat.id === activeConversationId;

                        return (
                            <div
                                key={chat.id}
                                onClick={() => dispatch(setActiveConversation(chat.id))}
                                className={`flex items-center gap-3 p-3 mx-2 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors ${isActive ? "bg-gray-100" : ""}`}
                            >
                                <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
                                    <p className="text-sm text-gray-500 truncate">
                                        {chat.lastMessage || "Chưa có tin nhắn"} 
                                        {chat.lastMessageTime && ` · ${formatTimestamp(chat.lastMessageTime).split(' ')[0]}`}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


// --- COMPONENT: KHUNG CUỘC TRÒ CHUYỆN (MAIN TRÁI) ---

const ChatHeader = ({ activeChat, onToggleSidebar, currentUserId }: { activeChat: Conversation, onToggleSidebar: () => void, currentUserId: string }) => {
    const { name, avatar } = getChatDisplayInfo(activeChat, currentUserId);
    const participantsCount = activeChat.participants?.length || 0;

    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
            <div className="flex items-center gap-3">
                <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                    <h2 className="font-bold text-xl text-gray-900">{name}</h2>
                    <p className="text-sm text-gray-500 underline cursor-pointer">
                        {activeChat.type === 'GROUP' ? `${participantsCount} participants` : 'See profile'}
                    </p>
                </div>
            </div>
            <button 
                onClick={onToggleSidebar}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                title="Đóng/Mở danh sách chat"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
    );
};

const MessageGroup = ({ isSelf, user, messages }: { isSelf: boolean | undefined, user: any, messages: any[] }) => {
    const renderMessageContent = (msg: any, index: number, isSelf: boolean) => {
        if (msg.type === 'IMAGE') {
            return (
                <div key={msg.id} className="mb-1">
                    <img 
                        src={msg.content} 
                        alt="Shared image" 
                        className="rounded-2xl max-w-[280px] sm:max-w-md object-cover border border-gray-200"
                    />
                </div>
            );
        }
        
        return (
            <div key={msg.id} className={`${isSelf ? 'bg-gray-200 text-gray-900' : 'bg-gray-50 text-gray-900'} px-4 py-2 rounded-2xl w-fit text-[15px] break-words max-w-[85%] md:max-w-md mb-1`}>
                {msg.content}
            </div>
        );
    };

    if (isSelf) {
        return (
            <div className="flex flex-col items-end gap-1 mb-4">
                {messages.map((msg: any, index: any) => renderMessageContent(msg, index, true))}
            </div>
        );
    }

    return (
        <div className="flex gap-3 mb-4 max-w-lg">
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover mt-6 shrink-0" />
            <div className="flex flex-col gap-1 w-full min-w-0">
                <span className="text-sm text-gray-500 ml-1">{user.name}</span>
                {messages.map((msg: any, index: any) => renderMessageContent(msg, index, false))}
            </div>
        </div>
    );
};

const ChatInput = () => {
    return (
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                <button className="text-gray-500 hover:text-gray-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                </button>
                <input
                    type="text"
                    placeholder="Aa"
                    className="flex-1 bg-transparent outline-none py-1 text-gray-800"
                />
                <button className="text-black ml-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};


// --- COMPONENT CHÍNH PAGE ---
const MessagesPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    // Lấy data từ Redux
    const { 
        conversations, 
        activeConversationId, 
        currentMessages,
        messagesStatus
    } = useSelector((state: RootState) => state.chat);

    // Load danh sách chat khi vừa vào trang
    useEffect(() => {
        dispatch(fetchConversations({ page: 0, size: 20 }));
    }, [dispatch]);

    // Load tin nhắn khi chọn một chat
    useEffect(() => {
        if (activeConversationId) {
            dispatch(fetchMessagesByConversationId(activeConversationId));
        }
    }, [dispatch, activeConversationId]);

    const activeChat = conversations.find(c => c.id === activeConversationId);

    // THUẬT TOÁN GOM NHÓM TIN NHẮN TỪ REDUX
    const groupedMessages = useMemo(() => {
        if (!currentMessages || currentMessages.length === 0) return [];
        
        const groups: any[] = [];
        let currentGroup: any = null;

        currentMessages.forEach((msg: any) => {
            const isSelf = msg.sender.userId === CURRENT_USER_ID;
            const msgTime = new Date(msg.createdDate).getTime();

            // Nếu người gửi giống với group hiện tại và thời gian cách nhau < 30 phút -> Gom vào
            if (currentGroup && currentGroup.senderId === msg.sender.userId) {
                const prevTime = new Date(currentGroup.lastMsgTime).getTime();
                const diffInMinutes = (msgTime - prevTime) / (1000 * 60);

                if (diffInMinutes <= 30) {
                    currentGroup.messages.push({ type: msg.type, content: msg.message, id: msg.id });
                    currentGroup.lastMsgTime = msg.createdDate; 
                    return; // Chuyển sang tin nhắn tiếp theo
                }
            }

            // Nếu khác người gửi hoặc cách nhau > 30 phút -> Tạo group mới
            if (currentGroup) groups.push(currentGroup);
            
            currentGroup = {
                id: msg.id, // Dùng ID tin nhắn đầu tiên làm ID của group
                isSelf: isSelf,
                senderId: msg.sender.userId,
                timestamp: msg.createdDate,
                lastMsgTime: msg.createdDate,
                user: {
                    name: `${msg.sender.lastName} ${msg.sender.firstName}`.trim() || msg.sender.username,
                    avatar: msg.sender.avatar
                },
                messages: [{ type: msg.type, content: msg.message, id: msg.id }]
            };
        });

        // Đẩy group cuối cùng vào mảng
        if (currentGroup) groups.push(currentGroup);
        
        return groups;
    }, [currentMessages]);


    return (
        <div className="flex h-[calc(100vh-70px)] w-full bg-white font-sans text-gray-800 overflow-hidden">

            {/* KHUNG CUỘC TRÒ CHUYỆN (BÊN TRÁI) */}
            <div className="flex flex-col flex-1 h-full min-w-0 bg-white">
                
                {/* TRẠNG THÁI 1: CHƯA CHỌN CUỘC TRÒ CHUYỆN */}
                {!activeConversationId ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50">
                        <div className="bg-blue-50 p-6 rounded-full mb-4">
                            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Không có gì cả...</h3>
                        <p className="text-gray-500">Hãy chọn một cuộc trò chuyện để gửi tin nhắn.</p>
                    </div>
                ) : 
                
                /* TRẠNG THÁI 2: ĐÃ CHỌN CUỘC TRÒ CHUYỆN */
                (
                    <>
                        {activeChat && (
                            <ChatHeader 
                                activeChat={activeChat} 
                                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                                currentUserId={CURRENT_USER_ID}
                            />
                        )}

                        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
                            {messagesStatus === 'loading' ? (
                                <div className="flex-1 flex justify-center items-center">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                groupedMessages.map((group, index) => {
                                    let showTime = false;

                                    if (index === 0) {
                                        showTime = true;
                                    } else {
                                        const prevGroup = groupedMessages[index - 1];
                                        const currentTimestamp = new Date(group.timestamp).getTime();
                                        const prevTimestamp = new Date(prevGroup.timestamp).getTime();
                                        const diffInMinutes = (currentTimestamp - prevTimestamp) / (1000 * 60);

                                        if (diffInMinutes > 30) {
                                            showTime = true;
                                        }
                                    }

                                    return (
                                        <React.Fragment key={group.id}>
                                            {showTime && (
                                                <div className="text-center text-xs font-medium text-gray-400 my-4 uppercase tracking-wide">
                                                    {formatTimestamp(group.timestamp)}
                                                </div>
                                            )}
                                            <MessageGroup
                                                isSelf={group.isSelf}
                                                user={group.user}
                                                messages={group.messages}
                                            />
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </div>

                        <ChatInput />
                    </>
                )}
            </div>

            {/* KHUNG DANH SÁCH CUỘC TRÒ CHUYỆN (BÊN PHẢI) */}
            <ChatListSidebar isOpen={isSidebarOpen} currentUserId={CURRENT_USER_ID} />

        </div>
    );
};

export default MessagesPage;