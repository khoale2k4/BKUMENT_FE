import Link from 'next/link';
import { Youtube, Send, Facebook } from 'lucide-react';

export default function Footer() {
    const footerLinks = [
        {
            title: "my team",
            links: ["About Us", "Scholarship Programs", "Education Model", "Academic Partners"]
        },
        {
            title: "Corporate Training",
            links: ["All Courses", "Frontend Programming", "Backend Programming", "Marketing", "Data Analytics"]
        },
        {
            title: "Others",
            links: ["All Courses", "Frontend Programming", "Backend Programming", "Marketing", "Data Analytics"]
        },
        {
            title: "Others",
            links: ["Vacancies", "Social Responsibility", "Contact"]
        },
        {
            title: "Others",
            links: ["Academy", "Our Graduates", "Our Teachers"]
        }
    ];

    return (
        <footer className="bg-black text-white pt-16 pb-12">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">

                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">

                    
                    <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
                        <Link href="/" className="text-3xl font-serif font-bold tracking-wider">
                            Bkuments
                        </Link>

                        <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm font-medium text-gray-300">
                            <span>+994 50 717 17 17</span>
                            <span>vbook@gmail.com</span>
                            <span>Ho Chi Minh City, Viet Nam</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <SocialIcon icon={Facebook} /> 
                        <SocialIcon icon={Youtube} />
                        <SocialIcon icon={Send} />
                    </div>
                </div>
                
                <div className="border-t border-gray-800 mb-12"></div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {footerLinks.map((column, idx) => (
                        <div key={idx}>
                            <h3 className="font-bold mb-6 text-lg capitalize">{column.title}</h3>
                            <ul className="space-y-4">
                                {column.links.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                        <Link
                                            href="#"
                                            className="text-gray-400 hover:text-white transition text-sm"
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
            className="w-8 h-8 bg-white text-black rounded flex items-center justify-center hover:bg-gray-200 transition"
        >
            <Icon size={18} strokeWidth={2.5} />
        </a>
    );
}