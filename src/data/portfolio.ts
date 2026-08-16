import annualReportImg from "@/assets/work-annual-report.jpg";
import reportCoverImg from "@/assets/work-report-cover.jpg";
import socialPostsImg from "@/assets/work-social-posts.jpg";
import carouselPostsImg from "@/assets/work-carousel-posts.jpg";
import aiVideoPoster from "@/assets/work-ai-video-poster.jpg";
import aiVideoAsset from "@/assets/work-ai-video.mp4.asset.json";


/** أنواع الوسائط المدعومة — أضف نوعاً جديداً هنا لتوسعة المعرض مستقبلاً */
export type PortfolioMedia =
  | { kind: "image"; src: string }
  | { kind: "pdf"; src: string }
  | { kind: "video"; src: string; poster?: string };

export type PortfolioCategory = {
  slug: string;
  label: string;
};

export type PortfolioItem = {
  id: string;
  category: string;
  title: string;
  client: string;
  text: string;
  tags: string[];
  cover: string;
  media: PortfolioMedia;
};

/** التصنيفات — يمكن إضافة تصنيفات جديدة (فيديو، هوية، مستندات...) لاحقاً */
export const portfolioCategories: PortfolioCategory[] = [
  { slug: "annual-reports", label: "تصميم التقارير السنوية" },
  { slug: "social-posts", label: "تصميم المنشورات والبوستات" },
];

export const mediaLabel: Record<PortfolioMedia["kind"], string> = {
  image: "صورة عالية الدقة",
  pdf: "مستند PDF",
  video: "مقطع مرئي",
};

/** عناصر المعرض — قابلة للتوسعة بإضافة عناصر أو ربطها بلوحة التحكم لاحقاً */
export const portfolioItems: PortfolioItem[] = [
  {
    id: "annual-report-spread",
    category: "annual-reports",
    title: "تصميم التقرير السنوي — نسخة مطبوعة",
    client: "جمعية أهلية",
    text: "تصميم تقرير سنوي متكامل يعرض الإنجازات والمؤشرات والبيانات المالية بلغة بصرية واضحة تعزّز ثقة المانحين.",
    tags: ["تقرير سنوي", "إنفوجرافيك", "تصميم مطبوعات"],
    cover: annualReportImg,
    media: { kind: "image", src: annualReportImg },
  },
  {
    id: "annual-report-cover",
    category: "annual-reports",
    title: "أغلفة وهوية التقارير السنوية",
    client: "مؤسسات ومبادرات أهلية",
    text: "تصميم أغلفة التقارير السنوية بهوية مؤسسية راقية مع نظام ألوان وخطوط موحّد عبر جميع الصفحات.",
    tags: ["غلاف", "هوية مؤسسية", "طباعة"],
    cover: reportCoverImg,
    media: { kind: "image", src: reportCoverImg },
  },
  {
    id: "annual-report-pdf",
    category: "annual-reports",
    title: "نموذج تقرير كامل (PDF)",
    client: "أوبن لوب",
    text: "تصفّح نموذجاً كاملاً من مخرجاتنا في تصميم التقارير والمستندات المؤسسية داخل الصفحة مباشرة.",
    tags: ["مستند PDF", "نموذج كامل"],
    cover: annualReportImg,
    media: { kind: "pdf", src: "/open-loop-profile.pdf" },
  },
  {
    id: "social-posts-set",
    category: "social-posts",
    title: "تصميم المنشورات والبوستات",
    client: "حسابات جمعيات ومبادرات",
    text: "حزم تصاميم منشورات لمواقع التواصل بهوية موحّدة تناسب الحملات التوعوية والتبرعية والمناسبات الوطنية.",
    tags: ["بوست", "سوشال ميديا", "هوية موحّدة"],
    cover: socialPostsImg,
    media: { kind: "image", src: socialPostsImg },
  },
  {
    id: "social-carousel",
    category: "social-posts",
    title: "تصاميم الكاروسيل والحملات",
    client: "حملات القطاع غير الربحي",
    text: "سلاسل كاروسيل متسلسلة تروي قصة الحملة وتزيد التفاعل، مع نسخ مهيأة لجميع المنصات.",
    tags: ["كاروسيل", "حملات", "محتوى بصري"],
    cover: carouselPostsImg,
    media: { kind: "image", src: carouselPostsImg },
  },
];
