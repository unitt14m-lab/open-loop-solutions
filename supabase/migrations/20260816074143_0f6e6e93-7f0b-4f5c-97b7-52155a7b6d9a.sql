REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;

DROP POLICY "Anyone can view open projects" ON public.projects;
CREATE POLICY "Anyone can view open projects" ON public.projects FOR SELECT TO anon, authenticated USING (is_open = true);
CREATE POLICY "Admins view all projects" ON public.projects FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "Anyone can view published experts" ON public.experts;
CREATE POLICY "Anyone can view published experts" ON public.experts FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Admins view all experts" ON public.experts FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));