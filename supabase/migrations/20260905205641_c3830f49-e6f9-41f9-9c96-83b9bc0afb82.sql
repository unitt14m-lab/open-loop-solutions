-- ============ Opportunity (RFQ) lifecycle ============
ALTER TABLE public.rfqs
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS city text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS sector text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS approved_by uuid,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejection_reason text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS awarded_quote_id uuid,
  ADD COLUMN IF NOT EXISTS terms_version text NOT NULL DEFAULT 'v1.0';

UPDATE public.rfqs SET status = 'published' WHERE status = 'pending';

DROP POLICY IF EXISTS "Members view open rfqs" ON public.rfqs;
CREATE POLICY "Members view published rfqs" ON public.rfqs FOR SELECT TO authenticated
USING ((is_open AND status = 'published') OR owner_id = auth.uid() OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update rfqs" ON public.rfqs FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- ============ Organization approval state ============
ALTER TABLE public.community_entities
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS org_role text NOT NULL DEFAULT 'buyer';
UPDATE public.community_entities SET status = 'approved' WHERE is_verified;

ALTER TABLE public.suppliers
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';
CREATE POLICY "Admins update suppliers" ON public.suppliers FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- ============ Categories ============
CREATE TABLE public.opportunity_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.opportunity_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.opportunity_categories TO authenticated;
GRANT ALL ON public.opportunity_categories TO service_role;
ALTER TABLE public.opportunity_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views active categories" ON public.opportunity_categories FOR SELECT TO anon, authenticated USING (is_active OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage categories" ON public.opportunity_categories FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER opportunity_categories_set_updated_at BEFORE UPDATE ON public.opportunity_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.opportunity_categories (name, sort_order) VALUES
 ('تغذية وإعاشة',1),('تقنية وأنظمة',2),('تسويق وإعلان',3),('استشارات وحوكمة',4),
 ('تدريب وتأهيل',5),('لوجستيات ونقل',6),('مقاولات وصيانة',7),('أثاث وتجهيزات',8),('أخرى',9)
ON CONFLICT (name) DO NOTHING;

-- ============ Terms versions & digital acceptance ============
CREATE TABLE public.terms_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.terms_versions TO anon;
GRANT SELECT ON public.terms_versions TO authenticated;
GRANT ALL ON public.terms_versions TO service_role;
ALTER TABLE public.terms_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views terms" ON public.terms_versions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage terms" ON public.terms_versions FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER terms_versions_set_updated_at BEFORE UPDATE ON public.terms_versions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.terms_versions (version, title, content) VALUES
 ('v1.0','شروط وأحكام مجتمع أوبن لوب','تتولى مؤسسة أوبن لوب إدارة والإشراف على عملية التعميد والوساطة المالية، ويحظر التواصل المباشر خارج المنصة لضمان حقوق الطرفين واستحقاق نسبة الوساطة.')
ON CONFLICT (version) DO NOTHING;

CREATE TABLE public.user_terms_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  terms_version text NOT NULL,
  acceptance_type text NOT NULL,
  related_action text NOT NULL DEFAULT '',
  related_id uuid,
  accepted_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.user_terms_acceptances TO authenticated;
GRANT ALL ON public.user_terms_acceptances TO service_role;
ALTER TABLE public.user_terms_acceptances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users log own acceptance" ON public.user_terms_acceptances FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own acceptance" ON public.user_terms_acceptances FOR SELECT TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- ============ Documents ============
CREATE TABLE public.organization_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.community_entities(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL,
  doc_type text NOT NULL DEFAULT 'license',
  file_path text NOT NULL,
  file_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organization_documents TO authenticated;
GRANT ALL ON public.organization_documents TO service_role;
ALTER TABLE public.organization_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage org docs" ON public.organization_documents FOR ALL TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Admins view org docs" ON public.organization_documents FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update org docs" ON public.organization_documents FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TABLE public.application_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES public.rfq_quotes(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.application_documents TO authenticated;
GRANT ALL ON public.application_documents TO service_role;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Providers manage own app docs" ON public.application_documents FOR ALL TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Buyers and admins view app docs" ON public.application_documents FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin') OR EXISTS (
  SELECT 1 FROM public.rfq_quotes q JOIN public.rfqs r ON r.id = q.rfq_id
  WHERE q.id = application_documents.quote_id AND r.owner_id = auth.uid()));

-- ============ Questions & answers (on-platform only) ============
CREATE TABLE public.opportunity_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id uuid NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
  asker_id uuid NOT NULL,
  body text NOT NULL,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.opportunity_questions TO authenticated;
GRANT ALL ON public.opportunity_questions TO service_role;
ALTER TABLE public.opportunity_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members ask questions" ON public.opportunity_questions FOR INSERT TO authenticated WITH CHECK (auth.uid() = asker_id);
CREATE POLICY "Members read questions" ON public.opportunity_questions FOR SELECT TO authenticated
USING (is_public OR asker_id = auth.uid() OR has_role(auth.uid(), 'admin')
  OR EXISTS (SELECT 1 FROM public.rfqs r WHERE r.id = opportunity_questions.rfq_id AND r.owner_id = auth.uid()));

CREATE TABLE public.opportunity_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.opportunity_questions(id) ON DELETE CASCADE,
  responder_id uuid NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.opportunity_answers TO authenticated;
GRANT ALL ON public.opportunity_answers TO service_role;
ALTER TABLE public.opportunity_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners and admins answer" ON public.opportunity_answers FOR INSERT TO authenticated
WITH CHECK (auth.uid() = responder_id AND (has_role(auth.uid(), 'admin') OR EXISTS (
  SELECT 1 FROM public.opportunity_questions q JOIN public.rfqs r ON r.id = q.rfq_id
  WHERE q.id = opportunity_answers.question_id AND r.owner_id = auth.uid())));
CREATE POLICY "Members read answers" ON public.opportunity_answers FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.opportunity_questions q WHERE q.id = opportunity_answers.question_id));

-- ============ Contracts, commissions, payments ============
CREATE TABLE public.contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id uuid NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
  quote_id uuid REFERENCES public.rfq_quotes(id) ON DELETE SET NULL,
  buyer_id uuid NOT NULL,
  provider_id uuid NOT NULL,
  title text NOT NULL DEFAULT '',
  amount numeric(14,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'SAR',
  start_date date,
  end_date date,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.contracts TO authenticated;
GRANT ALL ON public.contracts TO service_role;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parties view contracts" ON public.contracts FOR SELECT TO authenticated
USING (buyer_id = auth.uid() OR provider_id = auth.uid() OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Buyers create contracts" ON public.contracts FOR INSERT TO authenticated
WITH CHECK (buyer_id = auth.uid() AND EXISTS (SELECT 1 FROM public.rfqs r WHERE r.id = contracts.rfq_id AND r.owner_id = auth.uid()));
CREATE POLICY "Parties update contracts" ON public.contracts FOR UPDATE TO authenticated
USING (buyer_id = auth.uid() OR has_role(auth.uid(), 'admin')) WITH CHECK (buyer_id = auth.uid() OR has_role(auth.uid(), 'admin'));
CREATE TRIGGER contracts_set_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.contract_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.contract_documents TO authenticated;
GRANT ALL ON public.contract_documents TO service_role;
ALTER TABLE public.contract_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage contract docs" ON public.contract_documents FOR ALL TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Parties view contract docs" ON public.contract_documents FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin') OR EXISTS (
  SELECT 1 FROM public.contracts c WHERE c.id = contract_documents.contract_id
  AND (c.buyer_id = auth.uid() OR c.provider_id = auth.uid())));

CREATE TABLE public.commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  percent numeric(5,2) NOT NULL DEFAULT 1,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  due_date date NOT NULL DEFAULT (now()::date + 30),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.commissions TO authenticated;
GRANT ALL ON public.commissions TO service_role;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage commissions" ON public.commissions FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Parties view own commission" ON public.commissions FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.contracts c WHERE c.id = commissions.contract_id AND (c.buyer_id = auth.uid() OR c.provider_id = auth.uid())));
CREATE TRIGGER commissions_set_updated_at BEFORE UPDATE ON public.commissions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id uuid NOT NULL REFERENCES public.commissions(id) ON DELETE CASCADE,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  method text NOT NULL DEFAULT 'transfer',
  reference text NOT NULL DEFAULT '',
  paid_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage payments" ON public.payments FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- ============ Settings ============
CREATE TABLE public.platform_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.platform_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.platform_settings TO authenticated;
GRANT ALL ON public.platform_settings TO service_role;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads settings" ON public.platform_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage settings" ON public.platform_settings FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER platform_settings_set_updated_at BEFORE UPDATE ON public.platform_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.platform_settings (key, value) VALUES
 ('commission', '{"percent": 1}'::jsonb),
 ('uploads', '{"allowed": ["pdf","png","jpg","jpeg","docx","xlsx"], "max_mb": 10}'::jsonb),
 ('texts', '{"disclaimer": "تعمل أوبن لوب كمنصة وسيط رقمي لإدارة الفرص وتقديم العروض والمتابعة، وليست طرفاً مباشراً في العقود النهائية ما لم يُنص على ذلك صراحة."}'::jsonb),
 ('notifications', '{"on_publish": true, "on_quote": true, "on_award": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ============ Notifications, approvals, notes, audit ============
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  link text NOT NULL DEFAULT '',
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users mark own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins manage notifications" ON public.notifications FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TABLE public.approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  status text NOT NULL,
  reviewer_id uuid,
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.approvals TO authenticated;
GRANT ALL ON public.approvals TO service_role;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage approvals" ON public.approvals FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TABLE public.admin_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  author_id uuid NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.admin_notes TO authenticated;
GRANT ALL ON public.admin_notes TO service_role;
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage notes" ON public.admin_notes FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL DEFAULT '',
  entity_id uuid,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users log own actions" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid());
CREATE POLICY "Admins read audit" ON public.audit_logs FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- ============ Auto commission on contract ============
CREATE OR REPLACE FUNCTION public.create_contract_commission()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE pct numeric;
BEGIN
  SELECT COALESCE((value ->> 'percent')::numeric, 1) INTO pct FROM public.platform_settings WHERE key = 'commission';
  pct := COALESCE(pct, 1);
  INSERT INTO public.commissions (contract_id, percent, amount)
  VALUES (NEW.id, pct, ROUND(NEW.amount * pct / 100, 2));
  UPDATE public.rfqs SET is_open = false, status = 'closed', awarded_quote_id = NEW.quote_id WHERE id = NEW.rfq_id;
  IF NEW.quote_id IS NOT NULL THEN
    UPDATE public.rfq_quotes SET status = 'awarded' WHERE id = NEW.quote_id;
  END IF;
  INSERT INTO public.audit_logs (actor_id, action, entity_type, entity_id, meta)
  VALUES (NEW.buyer_id, 'contract.created', 'contract', NEW.id, jsonb_build_object('amount', NEW.amount, 'percent', pct));
  RETURN NEW;
END; $$;

CREATE TRIGGER contracts_create_commission AFTER INSERT ON public.contracts
FOR EACH ROW EXECUTE FUNCTION public.create_contract_commission();