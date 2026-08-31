
CREATE TABLE public.rfqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL,
  entity_name text NOT NULL,
  entity_kind text NOT NULL DEFAULT 'جمعية أهلية',
  region text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  budget text,
  deadline date NOT NULL,
  is_open boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.rfqs TO authenticated;
GRANT ALL ON public.rfqs TO service_role;
ALTER TABLE public.rfqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members view open rfqs" ON public.rfqs FOR SELECT TO authenticated USING (is_open OR owner_id = auth.uid() OR has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Verified members create rfqs" ON public.rfqs FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id AND is_verified_member(auth.uid()));
CREATE POLICY "Owners update rfqs" ON public.rfqs FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE TRIGGER rfqs_set_updated_at BEFORE UPDATE ON public.rfqs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.rfq_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id uuid NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
  supplier_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  supplier_name text NOT NULL,
  amount text NOT NULL,
  duration text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  contact text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.rfq_quotes TO authenticated;
GRANT ALL ON public.rfq_quotes TO service_role;
ALTER TABLE public.rfq_quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Suppliers view own quotes" ON public.rfq_quotes FOR SELECT TO authenticated USING (supplier_id = auth.uid());
CREATE POLICY "Rfq owners view quotes" ON public.rfq_quotes FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.rfqs r WHERE r.id = rfq_quotes.rfq_id AND r.owner_id = auth.uid()));
CREATE POLICY "Admins view quotes" ON public.rfq_quotes FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Members submit quotes" ON public.rfq_quotes FOR INSERT TO authenticated WITH CHECK (supplier_id = auth.uid());
CREATE POLICY "Rfq owners update quotes" ON public.rfq_quotes FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.rfqs r WHERE r.id = rfq_quotes.rfq_id AND r.owner_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.rfqs r WHERE r.id = rfq_quotes.rfq_id AND r.owner_id = auth.uid()));

CREATE TABLE public.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  cr_number text NOT NULL,
  category text NOT NULL,
  region text NOT NULL DEFAULT '',
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  about text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.suppliers TO authenticated;
GRANT ALL ON public.suppliers TO service_role;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own supplier" ON public.suppliers FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins view suppliers" ON public.suppliers FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Users create own supplier" ON public.suppliers FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own supplier" ON public.suppliers FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER suppliers_set_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
