'use client';

import clsx from 'clsx';
import { Badge, ActionIcon } from '@mantine/core';
import { IconArrowLeft, IconCalendar, IconUser, IconEye, IconShare3 } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface PageProps {
    id: string;
}

const BLOG_DATA = {
    "title": "Nghi vấn 'bắt tay' từng khiến U.23 Việt Nam bị loại đau đớn khỏi U.23 châu Á",
    "coverImage": "https://images2.thanhnien.vn/528068263637045248/2025/12/26/cang-hang-khong-quoc-te-phu-quoc-nha-ga-t2-1766733981877227298326.jpg",
    "contentHTML": "<h2><strong>Song song với chiến tích đoạt ngôi á quân năm 2018, U.23 Việt Nam từng chứng kiến nhiều kỷ niệm buồn khi ra 'biển lớn' U.23 châu Á.</strong></h2><h2><strong>U.23 Việt Nam và ký ức khó quên</strong></h2><p>Kỳ tích Thường Châu với tấm HCB U.23 châu Á năm 2018 đã thay đổi vĩnh viễn lịch sử bóng đá trẻ Việt Nam. Với bệ phóng á quân, <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"seo-suggest-link link-inline-content\" href=\"https://thanhnien.vn/u23-viet-nam-len-duong-sang-qatar-tap-huan-san-sang-tao-tieng-vang-o-vck-u23-chau-a-185251226045853965.htm\">U.23 Việt Nam</a> dần khẳng định bản lĩnh ở \"biển lớn\". Hai kỳ U.23 châu Á gần nhất (năm 2024 và 2022), toàn đội đều vượt qua vòng bảng.</p><p>Tuy nhiên, U.23 Việt Nam cũng có những ký ức buồn, diễn vào vào năm 2020. Khi ấy, đội bóng của HLV Park Hang-seo đang là đương kim á quân giải đấu, trước đó cũng hừng hực khí thế với chức vô địch SEA Games 30 (năm 2019) đầy thuyết phục trên đất Philippines.</p><p>Việc nằm ở bảng đấu vừa vặn với U.23 Jordan, U.23 UAE và U.23 CHDCND Triều Tiên, U.23 Việt Nam được chờ đợi dễ dàng đoạt vé vào tứ kết. Song, thực tế diễn ra ngược lại.</p><p><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"detail-img-lightbox\" href=\"https://images2.thanhnien.vn/528068263637045248/2025/12/16/u23-vietnam-2-17658561303842145453005.jpg\"><img src=\"https://images2.thanhnien.vn/thumb_w/640/528068263637045248/2025/12/16/u23-vietnam-2-17658561303842145453005.jpg\" alt=\"Nghi vấn 'bắt tay' từng khiến U.23 Việt Nam bị loại đau đớn khỏi U.23 châu Á- Ảnh 1.\" title=\"Nghi vấn 'bắt tay' từng khiến U.23 Việt Nam bị loại đau đớn khỏi U.23 châu Á- Ảnh 1.\" width=\"2560\" height=\"1706\"></a>Dù có hàng thủ chắc chắn mang thương hiệu Park Hang-seo, nhưng do khâu tấn công không còn được gồng gánh bởi những đàn anh quá tuổi như Đỗ Hùng Dũng, Nguyễn Trọng Hoàng tại SEA Games 30, nên U.23 Việt Nam không thể ghi bàn. Học trò ông Park để hòa 0-0 trước U.23 Jordan và U.23 UAE, dẫn đến mất quyền tự quyết. Trước thềm lượt đấu cuối, U.23 Jordan và U.23 UAE cùng có 4 điểm (do cùng hòa U.23 Việt Nam và thắng U.23 CHDCND Triều Tiên), còn U.23 Việt Nam chỉ có 2 điểm. Đồng nghĩa, muốn đi tiếp, U.23 Việt Nam phải thắng U.23 CHDCND Triều Tiên, đồng thời mong trận U.23 Jordan gặp U.23 UAE ở lượt cuối phải phân định thắng bại, hoặc hòa không bàn thắng.&nbsp;</p><p>Nếu U.23 Jordan và U.23 UAE hòa có bàn thắng, U.23 Việt Nam có thắng với tỷ số nào đi nữa cũng phải dừng cuộc chơi, do kém đối thủ số bàn thắng ghi được trong những cuộc đối đầu trực tiếp.&nbsp;</p><p>Thầy trò HLV Park Hang-seo sau cùng đã không làm được cả... điều kiện cần, khi bất ngờ thua 1-2 trước U.23 CHDCND Triều Tiên. Dù vậy, kể cả khi thắng, U.23 Việt Nam cũng sẽ bị loại, khi U.23 UAE và U.23 Jordan hòa nhau với tỷ số 1-1. Kết quả vừa đủ để đánh bật đương kim á quân U.23 Việt Nam khỏi cuộc chơi.&nbsp;</p><p><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"category-page__name\" href=\"https://thanhnien.vn/the-thao.htm\"><strong>Thể thao</strong></a> <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://thanhnien.vn/the-thao/bong-da-viet-nam.htm\"><strong>Bóng đá Việt Nam</strong></a></p><h1><strong>Nghi vấn 'bắt tay' từng khiến U.23 Việt Nam bị loại đau đớn khỏi U.23 châu Á</strong></h1><p><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"avatar author-data\" href=\"https://thanhnien.vn/author/hong-nam-18515655.htm\"><img src=\"https://images2.thanhnien.vn/zoom/80_80/528068263637045248/2023/7/8/img6578-16888121214401842466449.jpg\" alt=\"Hồng Nam\"></a></p><p><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"name\" href=\"https://thanhnien.vn/author/hong-nam-18515655.htm\"><strong>Hồng Nam</strong></a>- <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"mailto:nammoc95@gmail.com\">nammoc95@gmail.com</a></p><p>26/12/2025 09:13 GMT+7</p><h2><strong>Song song với chiến tích đoạt ngôi á quân năm 2018, U.23 Việt Nam từng chứng kiến nhiều kỷ niệm buồn khi ra 'biển lớn' U.23 châu Á.</strong></h2><h2><strong>U.23 Việt Nam và ký ức khó quên</strong></h2><p>Kỳ tích Thường Châu với tấm HCB U.23 châu Á năm 2018 đã thay đổi vĩnh viễn lịch sử bóng đá trẻ Việt Nam. Với bệ phóng á quân, <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"seo-suggest-link link-inline-content\" href=\"https://thanhnien.vn/u23-viet-nam-len-duong-sang-qatar-tap-huan-san-sang-tao-tieng-vang-o-vck-u23-chau-a-185251226045853965.htm\">U.23 Việt Nam</a> dần khẳng định bản lĩnh ở \"biển lớn\". Hai kỳ U.23 châu Á gần nhất (năm 2024 và 2022), toàn đội đều vượt qua vòng bảng.</p><p>Tuy nhiên, U.23 Việt Nam cũng có những ký ức buồn, diễn vào vào năm 2020. Khi ấy, đội bóng của HLV Park Hang-seo đang là đương kim á quân giải đấu, trước đó cũng hừng hực khí thế với chức vô địch SEA Games 30 (năm 2019) đầy thuyết phục trên đất Philippines.</p><p>Việc nằm ở bảng đấu vừa vặn với U.23 Jordan, U.23 UAE và U.23 CHDCND Triều Tiên, U.23 Việt Nam được chờ đợi dễ dàng đoạt vé vào tứ kết. Song, thực tế diễn ra ngược lại.</p><p><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"detail-img-lightbox\" href=\"https://images2.thanhnien.vn/528068263637045248/2025/12/16/u23-vietnam-2-17658561303842145453005.jpg\"><img src=\"https://images2.thanhnien.vn/thumb_w/640/528068263637045248/2025/12/16/u23-vietnam-2-17658561303842145453005.jpg\" alt=\"Nghi vấn 'bắt tay' từng khiến U.23 Việt Nam bị loại đau đớn khỏi U.23 châu Á- Ảnh 1.\" title=\"Nghi vấn 'bắt tay' từng khiến U.23 Việt Nam bị loại đau đớn khỏi U.23 châu Á- Ảnh 1.\" width=\"2560\" height=\"1706\"></a></p><p>U.23 Việt Nam chuẩn bị bước ra sân chơi U.23 châu Á</p><p>ẢNH: ĐỒNG NGUYÊN KHANG</p><p>Dù có hàng thủ chắc chắn mang thương hiệu Park Hang-seo, nhưng do khâu tấn công không còn được gồng gánh bởi những đàn anh quá tuổi như Đỗ Hùng Dũng, Nguyễn Trọng Hoàng tại SEA Games 30, nên U.23 Việt Nam không thể ghi bàn. Học trò ông Park để hòa 0-0 trước U.23 Jordan và U.23 UAE, dẫn đến mất quyền tự quyết. Trước thềm lượt đấu cuối, U.23 Jordan và U.23 UAE cùng có 4 điểm (do cùng hòa U.23 Việt Nam và thắng U.23 CHDCND Triều Tiên), còn U.23 Việt Nam chỉ có 2 điểm. Đồng nghĩa, muốn đi tiếp, U.23 Việt Nam phải thắng U.23 CHDCND Triều Tiên, đồng thời mong trận U.23 Jordan gặp U.23 UAE ở lượt cuối phải phân định thắng bại, hoặc hòa không bàn thắng.&nbsp;</p><p>Advertisements</p><p>Ads end in 13</p><p><strong>X</strong></p><p>Nếu U.23 Jordan và U.23 UAE hòa có bàn thắng, U.23 Việt Nam có thắng với tỷ số nào đi nữa cũng phải dừng cuộc chơi, do kém đối thủ số bàn thắng ghi được trong những cuộc đối đầu trực tiếp.&nbsp;</p><p>Thầy trò HLV Park Hang-seo sau cùng đã không làm được cả... điều kiện cần, khi bất ngờ thua 1-2 trước U.23 CHDCND Triều Tiên. Dù vậy, kể cả khi thắng, U.23 Việt Nam cũng sẽ bị loại, khi U.23 UAE và U.23 Jordan hòa nhau với tỷ số 1-1. Kết quả vừa đủ để đánh bật đương kim á quân U.23 Việt Nam khỏi cuộc chơi.&nbsp;</p><p style=\"text-align: center;\">U.23 Việt Nam ‘mổ băng’ từng đối thủ, đặt mục tiêu lớn ở đấu trường châu Á</p><h2><strong>Bài học&nbsp;</strong></h2><p>Thế nhưng, bỏ qua nghi vấn liệu đối thủ có \"bắt tay\" để loại U.23 Việt Nam hay không, rõ ràng, đội bóng trẻ của ông Park chỉ có thể tự trách mình.&nbsp;</p><p>U.23 Việt Nam không thể thắng và cũng... chẳng thể ghi bàn vào lưới những đối thủ cạnh tranh trực tiếp, nên hiển nhiên không có quyền tự quyết trước lượt cuối.&nbsp;</p><p><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"detail-img-lightbox\" href=\"https://images2.thanhnien.vn/528068263637045248/2025/9/9/u23-4-1757426321549226478879.jpg\"><img src=\"https://images2.thanhnien.vn/thumb_w/640/528068263637045248/2025/9/9/u23-4-1757426321549226478879.jpg\" alt=\"Nghi vấn 'bắt tay' từng khiến U.23 Việt Nam bị loại đau đớn khỏi U.23 châu Á- Ảnh 2.\" title=\"Nghi vấn 'bắt tay' từng khiến U.23 Việt Nam bị loại đau đớn khỏi U.23 châu Á- Ảnh 2.\" width=\"2560\" height=\"1706\"></a>Tại vòng chung kết U.23 châu Á 2026, U.23 Việt Nam sẽ tái ngộ U.23 Jordan cùng một đội Tây Á khác (chủ nhà U.23 Ả Rập Xê Út). Khó khăn chồng chất cho thầy trò ông Kim, khi đối thủ đã quen với khí hậu và điều kiện thi đấu nóng nực khắc nghiệt tại Ả Rập Xê Út, còn U.23 Việt Nam phải thích nghi.</p><p>Tuy nhiên, U.23 Việt Nam vẫn có cơ hội của riêng mình. Chuỗi 11 chiến thắng ở các giải chính thức trong năm 2025, cùng cơ hội cọ xát với U.23 Trung Quốc, U.23 Hàn Quốc và U.23 Uzbekistan ở giải giao hữu quốc tế đã giúp học trò HLV Kim Sang-sik trưởng thành. Vậy nhưng, hãy nhớ bài học của chính U.23 Việt Nam năm xưa. Bên cạnh nhiệm vụ phòng ngự, U.23 Việt Nam chỉ có thể đi tiếp nếu tấn công và ghi bàn để định đoạt chiến thắng. Có như thế, đội mới có quyền tự quyết, thay vì để số phận nằm trên bàn tay đối thủ khác.</p><p>Bởi thế, HLV Kim Sang-sik đang quyết liệt rèn lại khâu dứt điểm cho các cầu thủ, triển khai nhiều mảng miếng tấn công đa dạng hơn, thay vì phụ thuộc vào phản công hay bóng bổng. Sự trở lại của tiền đạo Bùi Vĩ Hào đã thổi luồng gió mới, giúp ông Kim thêm lựa chọn.&nbsp;</p><p>Cuộc lội ngược dòng trước U.23 Thái Lan ở chung kết cho thấy, U.23 Việt Nam có thể khai mở tiềm năng tấn công, chỉ cần dám cầm bóng áp đặt thế trận, dám chơi trực diện, sòng phẳng và có tâm lý vững vàng.&nbsp;</p><p>Trước khi nghĩ đến kỳ tích, Nguyễn Đình Bắc cùng đồng đội cần chiến thắng chính mình.&nbsp;</p>",
    "visibility": "PUBLIC",
    "type": "POST"
};

export default function BlogDetailPage(params: PageProps) {
    const router = useRouter();
    const data = BLOG_DATA;

    return (
        <div className="min-h-screen bg-white font-sans pb-20">
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
                    >
                        <IconArrowLeft size={20} stroke={1.5} />
                        <span className="text-sm font-medium">Quay lại</span>
                    </button>

                    <div className="flex gap-2">
                        <ActionIcon variant="subtle" color="gray" radius="xl">
                            <IconShare3 size={20} stroke={1.5} />
                        </ActionIcon>
                    </div>
                </div>
            </div>

            <article className="max-w-3xl mx-auto px-4 mt-8 sm:mt-12">
                <div className="flex items-center gap-3 mb-6">
                    <Badge
                        color={data.visibility === 'PUBLIC' ? 'green' : 'red'}
                        variant="light"
                        size="sm"
                    >
                        {data.visibility}
                    </Badge>
                    <span className="text-gray-400 text-xs uppercase tracking-wide font-semibold">•</span>
                    <span className="text-gray-500 text-sm font-medium">26 tháng 12, 2025</span>
                    <span className="text-gray-400 text-xs uppercase tracking-wide font-semibold">•</span>
                    <span className="text-gray-500 text-sm font-medium">5 phút đọc</span>
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-8">
                    {data.title}
                </h1>

                {/*  profile làm sau nha ông  */}
                <div className="flex items-center justify-between border-t border-b border-gray-100 py-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            <img src="https://images2.thanhnien.vn/zoom/80_80/528068263637045248/2023/7/8/img6578-16888121214401842466449.jpg" alt="Author" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="font-bold text-gray-900 text-sm">Hồng Nam</div>
                            <div className="text-xs text-gray-500">nammoc95@gmail.com</div>
                        </div>
                    </div>

                    <div className="flex gap-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                            <IconEye size={16} /> 1.2k
                        </div>
                    </div>
                </div>

                {data.coverImage && (
                    <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-10 shadow-sm border border-gray-100">
                        <img
                            src={data.coverImage}
                            onError={(e) => {
                                e.currentTarget.src = "https://images2.thanhnien.vn/528068263637045248/2025/12/16/u23-vietnam-2-17658561303842145453005.jpg"; // Fallback image
                            }}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div
                    className={clsx(
                        "prose prose-lg prose-slate max-w-none",
                        "prose-headings:font-bold prose-headings:text-gray-900",
                        "prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6",
                        "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline",
                        "prose-img:rounded-xl prose-img:shadow-sm prose-img:my-8 prose-img:w-full",
                        "prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:pl-4 prose-blockquote:italic",
                        "first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-gray-900"
                    )}
                    dangerouslySetInnerHTML={{ __html: data.contentHTML }}
                />

                <div className="mt-12 pt-8 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 uppercase mb-4">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                        {['Bóng đá Việt Nam', 'U23 Châu Á', 'Thể thao'].map(tag => (
                            <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 cursor-pointer transition">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* <div className="max-w-4xl mx-auto px-4">
                    <CommentSection params={params} />
                </div> */}
            </article>
        </div>
    );
}