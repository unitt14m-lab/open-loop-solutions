GRANT SELECT ON public.experts TO anon, authenticated;
GRANT ALL ON public.experts TO service_role;

GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_applications TO authenticated;
GRANT ALL ON public.project_applications TO service_role;