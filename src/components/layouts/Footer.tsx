import Link from "next/link";
import { Youtube, Send, Facebook } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  // Đã phân bổ lại nội dung tập trung vào: Documents, Courses, Tutors, Blog, Messages, AI, Recommendations
  const footerLinks = [
    {
      title: t("layout.footer.explore", "Khám phá"),
      links: [
        t("layout.footer.documents", "Tài liệu học tập"),
        t("layout.footer.courses", "Khóa học"),
        t("layout.footer.findTutors", "Tìm gia sư"),
        t("layout.footer.blog", "Blog & Bài viết"),
      ],
    },
    {
      title: t("layout.footer.features", "Tính năng nổi bật"),
      links: [
        t("layout.footer.messages", "Nhắn tin & Thảo luận"),
        t("layout.footer.aiAssistant", "Trợ lý học tập AI"),
        t("layout.footer.recommendations", "Gợi ý cá nhân hóa"),
        t("layout.footer.advancedSearch", "Tìm kiếm nâng cao"),
      ],
    },
    {
      title: t("layout.footer.community", "Cộng đồng"),
      links: [
        t("layout.footer.forums", "Diễn đàn trao đổi"),
        t("layout.footer.events", "Sự kiện & Hội thảo"),
        t("layout.footer.leaderboard", "Bảng xếp hạng"),
      ],
    },
    {
      title: t("layout.footer.about", "Về Bkuments"),
      links: [
        t("layout.footer.aboutUs", "Giới thiệu"),
        t("layout.footer.careers", "Tuyển dụng"),
        t("layout.footer.contact", "Liên hệ"),
      ],
    },
    {
      title: t("layout.footer.support", "Hỗ trợ & Pháp lý"),
      links: [
        t("layout.footer.helpCenter", "Trung tâm hỗ trợ"),
        t("layout.footer.terms", "Điều khoản dịch vụ"),
        t("layout.footer.privacy", "Chính sách bảo mật"),
      ],
    },
  ];

  return (
    <footer className="bg-black text-white pt-12 sm:pt-16 pb-10 sm:pb-12">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8 mb-10 sm:mb-12">
          <div className="flex flex-col md:flex-row md:items-center gap-4 sm:gap-8 md:gap-16">
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-serif font-bold tracking-wider"
            >
              Bkuments
            </Link>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 md:gap-8 text-xs sm:text-sm font-medium text-gray-300">
              <span>{t("layout.footer.phone", "+84 123 456 789")}</span>
              <span>{t("layout.footer.email", "support@bkuments.com")}</span>
              <span>
                {t("layout.footer.address", "Dĩ An, Bình Dương, Vietnam")}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <SocialIcon icon={Facebook} />
            <SocialIcon icon={Youtube} />
            <SocialIcon icon={Send} />
          </div>
        </div>

        <div className="border-t border-gray-800 mb-8 sm:mb-12"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-6 md:gap-8">
          {footerLinks.map((column, idx) => (
            <div key={idx}>
              <h3 className="font-bold mb-4 sm:mb-6 text-base sm:text-lg capitalize text-gray-100">
                {column.title}
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                {column.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition text-xs sm:text-sm inline-block"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon: Icon }: { icon: any }) {
  return (
    <a
      href="#"
      className="w-8 h-8 sm:w-10 sm:h-10 bg-white text-black rounded flex items-center justify-center hover:bg-gray-200 transition shrink-0"
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
    </a>
  );
}
