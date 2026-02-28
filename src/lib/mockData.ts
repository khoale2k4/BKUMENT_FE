// Mock data for document analysis
import { ParticipantInfo, Conversation, ChatMessage, PaginatedResponse } from "./services/chat.service";

// --- MOCK PARTICIPANTS ---
export const MOCK_PARTICIPANTS: Record<string, ParticipantInfo> = {
    me: { userId: "u0", username: "toi_la_ai", firstName: "Lê Võ Đăng", lastName: "Khoa", avatar: "https://i.pravatar.cc/150?u=0" },
    kiet: { userId: "u1", username: "kiet_nguyen", firstName: "Nguyễn Tuấn", lastName: "Kiệt", avatar: "https://i.pravatar.cc/150?u=1" },
    nhaan: { userId: "u2", username: "nhaan_ne", firstName: "Nhaan", lastName: "", avatar: "https://i.pravatar.cc/150?u=10" },
    nhan: { userId: "u3", username: "nhan_tran", firstName: "Nhân", lastName: "", avatar: "https://i.pravatar.cc/150?u=11" },
    nguoila: { userId: "u4", username: "nguoi_la", firstName: "Người", lastName: "Lạ", avatar: "https://i.pravatar.cc/150?u=12" },
    tien: { userId: "u5", username: "tien_thuy", firstName: "Trần Thủy", lastName: "Tiên", avatar: "https://i.pravatar.cc/150?u=3" },
};

// --- MOCK DANH SÁCH CUỘC TRÒ CHUYỆN (Có phân trang) ---
export const mockConversationsResponse: PaginatedResponse<Conversation> = {
    content: [
        {
            id: "c1",
            type: "DIRECT",
            name: null, // DIRECT thì có thể không cần tên (UI sẽ lấy tên người kia)
            participantsHash: "hash_u0_u1",
            participants: [MOCK_PARTICIPANTS.me, MOCK_PARTICIPANTS.kiet],
            createdDate: new Date(Date.now() - 36000000).toISOString(),
            lastMessage: "Bạn: hehe",
            lastMessageTime: new Date(Date.now() - 3600000).toISOString(), // 1 giờ trước
            modifiedDate: new Date(Date.now() - 3600000).toISOString(),
        },
        {
            id: "c2",
            type: "GROUP",
            name: "Tình một đêm", // GROUP thì có tên
            participantsHash: "hash_u0_u2_u3_u4",
            participants: [MOCK_PARTICIPANTS.me, MOCK_PARTICIPANTS.nhaan, MOCK_PARTICIPANTS.nhan, MOCK_PARTICIPANTS.nguoila],
            createdDate: new Date(Date.now() - 86400000).toISOString(),
            lastMessage: "Nhaan: Có",
            lastMessageTime: new Date(Date.now() - 7200000).toISOString(), // 2 giờ trước
            modifiedDate: new Date(Date.now() - 7200000).toISOString(),
        },
        {
            id: "c3",
            type: "DIRECT",
            name: null,
            participantsHash: "hash_u0_u5",
            participants: [MOCK_PARTICIPANTS.me, MOCK_PARTICIPANTS.tien],
            createdDate: new Date(Date.now() - 100000000).toISOString(),
            lastMessage: "Em ăn cơm chưa?",
            lastMessageTime: new Date(Date.now() - 86400000).toISOString(), // Hôm qua
            modifiedDate: new Date(Date.now() - 86400000).toISOString(),
        }
    ],
    page: 0,
    size: 10,
    totalElements: 3,
    totalPages: 1,
    last: true
};

// --- MOCK TIN NHẮN (Cho cuộc trò chuyện "c2" - Tình một đêm) ---
export const mockMessagesData: ChatMessage[] = [
    {
        id: "m1",
        conversationId: "c2",
        type: "TEXT",
        message: "Chỗ cũ nha",
        sender: MOCK_PARTICIPANTS.nhaan,
        createdDate: new Date(Date.now() - 7300000).toISOString()
    },
    {
        id: "m2",
        conversationId: "c2",
        type: "TEXT",
        message: "Đức",
        sender: MOCK_PARTICIPANTS.me,
        createdDate: new Date(Date.now() - 7290000).toISOString()
    },
    {
        id: "m3",
        conversationId: "c2",
        type: "TEXT",
        message: "Ông tới chưa",
        sender: MOCK_PARTICIPANTS.nhaan,
        createdDate: new Date(Date.now() - 7250000).toISOString() // Giả lập cách tin nhắn trên 40 phút để trigger thời gian
    },
    {
        id: "m4",
        conversationId: "c2",
        type: "TEXT",
        message: "Có cái bàn này tụi mình ngồi được nè",
        sender: MOCK_PARTICIPANTS.nhaan,
        createdDate: new Date(Date.now() - 7240000).toISOString()
    },
    {
        id: "m4_img",
        conversationId: "c2",
        type: "IMAGE",
        message: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1470&auto=format&fit=crop",
        sender: MOCK_PARTICIPANTS.nhaan,
        createdDate: new Date(Date.now() - 7235000).toISOString()
    },
    {
        id: "m5",
        conversationId: "c2",
        type: "TEXT",
        message: "Giữ bàn đi",
        sender: MOCK_PARTICIPANTS.me,
        createdDate: new Date(Date.now() - 7220000).toISOString()
    },
    {
        id: "m6",
        conversationId: "c2",
        type: "TEXT",
        message: "Tui còn ngoài nhà xe, vô liền",
        sender: MOCK_PARTICIPANTS.me,
        createdDate: new Date(Date.now() - 7215000).toISOString()
    },
    {
        id: "m7",
        conversationId: "c2",
        type: "TEXT",
        message: "Mấy ông đâu z",
        sender: MOCK_PARTICIPANTS.nhan,
        createdDate: new Date(Date.now() - 7210000).toISOString()
    },
    {
        id: "m8",
        conversationId: "c2",
        type: "TEXT",
        message: "Ko thấy ai hết",
        sender: MOCK_PARTICIPANTS.nguoila,
        createdDate: new Date(Date.now() - 7205000).toISOString()
    },
    {
        id: "m9",
        conversationId: "c2",
        type: "TEXT",
        message: "Có",
        sender: MOCK_PARTICIPANTS.nhaan,
        createdDate: new Date(Date.now() - 7200000).toISOString()
    }
];

export const MOCK_ANALYSIS_KEYWORDS = [
    "Machine Learning",
    "Deep Learning",
    "Neural Networks",
    "Artificial Intelligence",
    "Data Science"
];

export const MOCK_ANALYSIS_RESULT = {
    keywords: MOCK_ANALYSIS_KEYWORDS,
    summary: "This document discusses advanced concepts in machine learning and artificial intelligence, with a focus on neural networks and deep learning applications."
};

// Mock data for articles
export const ARTICLESDATA = [
    {
        id: 1,
        imageUrl: "/images/article-1.jpg",
        title: "Understanding Machine Learning Basics",
        description: "A comprehensive guide to getting started with machine learning concepts and applications.",
        createdAt: "2024-01-15",
        author: {
            id: "user1",
            name: "John Doe",
            avatar: "/avatars/john.jpg"
        },
        likes: 45,
        comments: 12
    },
    {
        id: 2,
        imageUrl: "/images/article-2.jpg",
        title: "Deep Learning in Practice",
        description: "Exploring real-world applications of deep learning in various industries.",
        createdAt: "2024-01-20",
        author: {
            id: "user2",
            name: "Jane Smith",
            avatar: "/avatars/jane.jpg"
        },
        likes: 67,
        comments: 23
    }
];

// Mock data for comments
export const COMMENTSDATA = [
    {
        id: "comment1",
        userId: "user1",
        userName: "John Doe",
        userAvatar: "/avatars/john.jpg",
        content: "Great article! Very informative.",
        createdAt: "2024-01-16",
        likes: 5
    },
    {
        id: "comment2",
        userId: "user2",
        userName: "Jane Smith",
        userAvatar: "/avatars/jane.jpg",
        content: "Thanks for sharing this resource.",
        createdAt: "2024-01-17",
        likes: 3
    }
];

// Mock data for topics
export const TOPICSDATA = [
    { id: "topic1", name: "Machine Learning", icon: "🤖" },
    { id: "topic2", name: "Web Development", icon: "🌐" },
    { id: "topic3", name: "Data Science", icon: "📊" },
    { id: "topic4", name: "Mobile Development", icon: "📱" },
    { id: "topic5", name: "Cloud Computing", icon: "☁️" },
    { id: "topic6", name: "Cybersecurity", icon: "🔒" },
    { id: "topic7", name: "DevOps", icon: "⚙️" },
    { id: "topic8", name: "Blockchain", icon: "⛓️" }
];

// NEW ARTICLE STRUCTURE - with tags
export const ARTICLESDATA_NEW = [
    {
        id: 1,
        imageUrl: "/images/article-1.jpg",
        title: "Understanding Machine Learning Basics",
        description: "A comprehensive guide to getting started with machine learning concepts and applications.",
        content: "Full article content here...",
        createdAt: "2024-01-15",
        author: {
            id: "user1",
            name: "John Doe",
            avatar: "/avatars/john.jpg"
        },
        likes: 45,
        comments: 12,
        tags: ["Machine Learning", "AI", "Data Science"]
    }
];

// Mock data for search with tabs
export const SEARCH_RESULTS = {
    all: {
        documents: [
            {
                id: "doc1",
                title: "Introduction to Neural Networks",
                type: "document",
                university: "Bach Khoa University",
                course: "Machine Learning"
            }
        ],
        articles: [
            {
                id: "article1",
                title: "Deep Learning Guide",
                type: "article",
                author: "John Doe"
            }
        ],
        users: [
            {
                id: "user1",
                name: "Jane Smith",
                type: "user",
                avatar: "/avatars/jane.jpg"
            }
        ]
    },
    documents: [],
    articles: [],
    users: []
};

// Mock data for document list with tabs
export const DOCUMENTS_BY_TAB = {
    all: [],
    recent: [],
    trending: [],
    saved: []
};

// Example document structure
export const DOCUMENT_EXAMPLE = {
    id: "doc123",
    title: "Introduction to Machine Learning",
    description: "A comprehensive guide covering the basics of ML",
    downloadUrl: "https://example.com/downloads/ml-intro.pdf",
    previewImageUrl: "https://example.com/previews/ml-intro.jpg",
    downloadCount: 150,
    documentType: "PDF",
    downloadable: true,
    university: "Bach Khoa University",
    course: "Computer Science",
    topic: "Machine Learning",
    keywords: ["ML", "AI", "Data Science"],
    visibility: "PUBLIC",
    createdAt: "2024-01-15T10:00:00Z",
    author: {
        id: "user1",
        name: "John Doe",
        avatar: "/avatars/john.jpg"
    }
};

// Mock data for universities
export const UNIVERSITIES_DATA = [
    { id: 1, name: "Trường Đại học Bách Khoa - ĐHQG TP.HCM", abbreviation: "HCMUT", logoUrl: null },
    { id: 2, name: "Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM", abbreviation: "HCMUS", logoUrl: null },
    { id: 3, name: "Trường Đại học Khoa học Xã hội và Nhân văn - ĐHQG TP.HCM", abbreviation: "HCMUSSH", logoUrl: null },
    { id: 4, name: "Trường Đại học Kinh tế - ĐHQG TP.HCM", abbreviation: "UEH", logoUrl: null },
    { id: 5, name: "Trường Đại học Y Dược TP.HCM", abbreviation: "UMP", logoUrl: null },
    { id: 6, name: "Trường Đại học Sư phạm TP.HCM", abbreviation: "HCMUE", logoUrl: null },
    { id: 18, name: "Trường Đại học Ngân hàng TP.HCM", abbreviation: "HUB", logoUrl: null },
    { id: 25, name: "Trường Đại học Bách Khoa Hà Nội", abbreviation: "HUST", logoUrl: null },
    { id: 29, name: "Trường Đại học Bách Khoa - ĐH Đà Nẵng", abbreviation: "DUT", logoUrl: null },
    { id: 30, name: "Trường Đại học Công nghệ Thông tin - ĐHQG TP.HCM", abbreviation: "UIT", logoUrl: null },
];

// Mock data for courses with nested topics
export const COURSES_DATA = [
    {
        id: "INT1003",
        name: "Lập trình Hướng đối tượng (Java)",
        topics: [
            { id: "c7fd7656-df18-446b-9018-b257d09d60d5", name: "Tính kế thừa và Đa hình" },
            { id: "71fef4b1-46f5-4e2f-9f63-2019f0932799", name: "Lớp và Đối tượng (Class & Object)" },
            { id: "c888d93c-5724-4133-8d46-365279bdf239", name: "Xử lý ngoại lệ (Exception Handling)" }
        ]
    },
    {
        id: "WEB1012",
        name: "Lập trình Web Backend",
        topics: [
            { id: "0de769a1-a6c5-4857-87ad-4861d91239a4", name: "Kết nối cơ sở dữ liệu với ORM" },
            { id: "fbfe3969-8f91-46e8-a954-b43b3c31c082", name: "Kiến trúc RESTful API" }
        ]
    },
    {
        id: "MOB1013",
        name: "Lập trình thiết bị di động (Android/iOS)",
        topics: [
            { id: "67539a30-f82e-47ef-b2ab-b1bdfa8cd451", name: "Thiết kế giao diện Mobile" },
            { id: "85a1b0b5-0443-4f3e-a542-e1eb9a620b21", name: "Vòng đời ứng dụng (Activity Lifecycle)" }
        ]
    },
    {
        id: "SEC1015",
        name: "An toàn và bảo mật thông tin",
        topics: [
            { id: "fb9098e1-58f8-4ae3-81a3-65c6895c067e", name: "Mã hóa đối xứng và bất đối xứng" },
            { id: "06cde5de-1174-41ec-92b7-959737268137", name: "Các lỗ hổng web phổ biến (OWASP)" }
        ]
    },
    {
        id: "DATA1016",
        name: "Khoa học dữ liệu",
        topics: [
            { id: "4d0f9c67-f435-445c-8e14-d17e304d387f", name: "Trực quan hóa dữ liệu" },
            { id: "92ddc249-0206-4e8c-a45a-1ec67a424edd", name: "Tiền xử lý dữ liệu (Data Preprocessing)" }
        ]
    },
    {
        id: "ENG4001",
        name: "Tiếng Anh cơ bản 1",
        topics: [
            { id: "f309dc56-9138-420c-8fc3-14b7d209a4e8", name: "Thì hiện tại đơn và tiếp diễn" },
            { id: "25e87704-329f-4a8a-a182-fce2352b594e", name: "Từ vựng về gia đình và công việc" }
        ]
    },
    {
        id: "ENG4002",
        name: "Tiếng Anh cơ bản 2",
        topics: []
    },
    {
        id: "ENG4003",
        name: "Tiếng Anh chuyên ngành",
        topics: [
            { id: "cd1a09ba-c5c9-4ade-a050-5c9bb664628f", name: "Đọc hiểu tài liệu kỹ thuật" },
            { id: "93bdd519-f477-47cc-9686-0cefdfe7397f", name: "Viết Email công việc" }
        ]
    },
    {
        id: "SKL5001",
        name: "Kỹ năng giao tiếp và làm việc nhóm",
        topics: [
            { id: "ac9d3f71-fb59-4bc1-875b-915ecd4b0cf4", name: "Kỹ năng lắng nghe tích cực" },
            { id: "a55171c2-7b9c-4585-98b6-f58cc29d22c6", name: "Giải quyết xung đột nhóm" }
        ]
    }
];