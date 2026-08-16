CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  brief text NOT NULL,
  deliverables text NOT NULL DEFAULT '',
  requirements text NOT NULL DEFAULT '',
  field text NOT NULL DEFAULT '',
  budget text,
  duration text,
  is_open boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view open projects" ON public.projects FOR SELECT TO anon, authenticated USING (is_open = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update projects" ON public.projects FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete projects" ON public.projects FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER projects_set_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.project_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note text NOT NULL DEFAULT '',
  portfolio_url text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, user_id)
);
GRANT SELECT, INSERT ON public.project_applications TO authenticated;
GRANT UPDATE ON public.project_applications TO authenticated;
GRANT ALL ON public.project_applications TO service_role;
ALTER TABLE public.project_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own applications" ON public.project_applications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all applications" ON public.project_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users create own applications" ON public.project_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins update applications" ON public.project_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER project_applications_set_updated_at BEFORE UPDATE ON public.project_applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.experts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  specialty text NOT NULL,
  avatar_url text,
  years_experience integer NOT NULL DEFAULT 0,
  bio text NOT NULL DEFAULT '',
  is_verified boolean NOT NULL DEFAULT true,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.experts TO anon;
GRANT SELECT ON public.experts TO authenticated;
GRANT ALL ON public.experts TO service_role;
ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published experts" ON public.experts FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert experts" ON public.experts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update experts" ON public.experts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete experts" ON public.experts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER experts_set_updated_at BEFORE UPDATE ON public.experts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.experts (full_name, specialty, years_experience, bio) VALUES
('م. سارة الحربي', 'استشارات حوكمة وامتثال', 9, 'بناء اللوائح والأدلة الداخلية ورفع مؤشرات الحوكمة للجمعيات الأهلية.'),
('عبدالله القحطاني', 'تنمية موارد ومنح', 11, 'صياغة المشاريع وتأهيلها على منصات المنح ومتابعة الاعتماد والتحصيل.'),
('نورة العتيبي', 'تسويق رقمي وإعلانات ممولة', 7, 'إدارة الحملات الإعلانية وقياس الأثر الرقمي للكيانات غير الربحية.'),
('فهد الشهري', 'تصميم جرافيك وهوية بصرية', 8, 'تصميم الهويات والملفات التعريفية والتقارير السنوية بأسلوب مؤسسي.'),
('ريم الزهراني', 'كتابة محتوى وصياغة مشاريع', 6, 'محتوى مؤسسي ومقترحات مشاريع بلغة مقنعة للمانحين والشركاء.'),
('ماجد الدوسري', 'إنتاج مرئي وموشن جرافيك', 10, 'إنتاج الأفلام القصيرة والموشن جرافيك لتوثيق الأثر المجتمعي.');

INSERT INTO public.projects (title, brief, deliverables, requirements, field, budget, duration) VALUES
('إعداد لائحة حوكمة لجمعية أهلية', 'إعداد لائحة حوكمة متوافقة مع متطلبات المركز الوطني لتنمية القطاع غير الربحي لجمعية في منطقة مكة.', 'لائحة حوكمة كاملة، مصفوفة صلاحيات، خطة تطبيق.', 'خبرة لا تقل عن 3 سنوات في الحوكمة، أعمال سابقة موثقة.', 'حوكمة وامتثال', 'يحدد بعد المقابلة', '4 أسابيع'),
('إدارة حملة إعلانية لمشروع إفطار صائم', 'تخطيط وتنفيذ حملة إعلانية ممولة على منصات التواصل لمشروع موسمي.', 'خطة الحملة، التصاميم، تقرير الأداء الأسبوعي.', 'إتقان Meta Ads وGoogle Ads، خبرة في القطاع غير الربحي.', 'تسويق رقمي', 'يحدد بعد المقابلة', '6 أسابيع'),
('صياغة ملف مشروع للمانحين', 'إعداد ملف احترافي لعرض مشروع تنموي على المؤسسات المانحة.', 'ملف مشروع PDF، ملخص تنفيذي، عرض تقديمي.', 'خبرة في كتابة المقترحات وصياغة المشاريع.', 'كتابة محتوى', 'يحدد بعد المقابلة', '3 أسابيع');