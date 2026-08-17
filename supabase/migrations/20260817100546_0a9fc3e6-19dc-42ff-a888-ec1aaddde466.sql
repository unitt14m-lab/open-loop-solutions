ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_url text;

DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;
CREATE POLICY "Anyone can view projects"
ON public.projects FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO public.projects (title, brief, deliverables, requirements, field, budget, duration, is_open)
SELECT 'تصميم فيديو تسويقي بالذكاء الاصطناعي',
       'إنتاج فيديو تسويقي قصير لجمعية غير ربحية باستخدام أدوات الذكاء الاصطناعي، يشمل السيناريو والتعليق الصوتي والمونتاج النهائي.',
       'فيديو نهائي بدقة 1080p مدته 45-60 ثانية + نسخة عمودية للسوشيال ميديا',
       'خبرة في أدوات توليد الفيديو بالذكاء الاصطناعي والمونتاج، مع معرض أعمال سابق',
       'فيديوهات الذكاء الاصطناعي',
       'يحدد حسب الخبرة',
       'أسبوعان',
       true
WHERE NOT EXISTS (
  SELECT 1 FROM public.projects WHERE title = 'تصميم فيديو تسويقي بالذكاء الاصطناعي'
);