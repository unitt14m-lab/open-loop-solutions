DELETE FROM public.projects
WHERE title NOT ILIKE '%تصميم فيديو%الذكاء%'
  AND title NOT ILIKE '%ذكاء%اصطناعي%';

INSERT INTO public.projects (title, brief, deliverables, requirements, field, budget, duration, is_open)
SELECT
  'تصميم فيديو تسويقي بالذكاء الاصطناعي',
  'إنتاج مقطع فيديو تسويقي قصير باستخدام أدوات الذكاء الاصطناعي لصالح أحد عملاء أوبن لوب في القطاع غير الربحي.',
  '• سكريبت تسويقي مدته 60–90 ثانية\n• فيديو جاهز للنشر على منصات التواصل\n• نسخة بجودة عالية ونسخة مضغوطة',
  '• إتقان أدوات توليد الفيديو بالذكاء الاصطناعي\n• خبرة في الكتابة التسويقية القصيرة\n• إرسال نماذج سابقة مع الطلب',
  'تسويق رقمي',
  null,
  '3–5 أيام',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.projects
  WHERE title ILIKE '%تصميم فيديو%الذكاء%'
     OR title ILIKE '%ذكاء%اصطناعي%'
);