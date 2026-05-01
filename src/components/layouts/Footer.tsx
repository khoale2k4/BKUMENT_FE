import Link from "next/link";
import { Youtube, Send, Facebook } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const footerLinks = [
    {
      title: t("layout.footer.myTeam"),
      links: [
        t("layout.footer.aboutUs"),
        t("layout.footer.scholarship"),
        t("layout.footer.educationModel"),
        t("layout.footer.academicPartners"),
      ],
    },
    {
      title: t("layout.footer.corporateTraining"),
      links: [
        t("layout.footer.allCourses"),
        t("layout.footer.frontend"),
        t("layout.footer.backend"),
        t("layout.footer.marketing"),
        t("layout.footer.dataAnalytics"),
      ],
    },
    {
      title: t("layout.footer.others"),
      links: [
        t("layout.footer.allCourses"),
        t("layout.footer.frontend"),
        t("layout.footer.backend"),
        t("layout.footer.marketing"),
        t("layout.footer.dataAnalytics"),
      ],
    },
    {
      title: t("layout.footer.others"),
      links: [
        t("layout.footer.vacancies"),
        t("layout.footer.socialResponsibility"),
        t("layout.footer.contact"),
      ],
    },
    {
      title: t("layout.footer.others"),
      links: [
        t("layout.footer.academy"),
        t("layout.footer.graduates"),
        t("layout.footer.teachers"),
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
              <span>{t("layout.footer.phone")}</span>
              <span>{t("layout.footer.email")}</span>
              <span>{t("layout.footer.address")}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <SocialIcon icon={Facebook} />
            <SocialIcon icon={Youtube} />
            <SocialIcon icon={Send} />
          </div>
        </div>

        <div className="border-t border-gray-800 mb-8 sm:mb-12"></div>

        {/* [SỬA]: Đổi grid-cols-2 thành grid-cols-1 trên mobile, lên sm mới tách làm 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-6 md:gap-8">
          {footerLinks.map((column, idx) => (
            <div key={idx}>
              {/* [SỬA]: Đẩy margin text mb-4 thay vì mb-6 để gọn gàng hơn */}
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
      className="w-8 h-8 bg-white text-black rounded flex items-center justify-center hover:bg-gray-200 transition shrink-0"
    >
      <Icon size={16} sm={{ size: 18 }} strokeWidth={2.5} />
    </a>
  );
}
