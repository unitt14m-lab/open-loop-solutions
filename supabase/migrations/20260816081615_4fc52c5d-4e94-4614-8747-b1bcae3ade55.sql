
CREATE TABLE public.community_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  license_number text NOT NULL,
  entity_name text NOT NULL,
  representative_name text NOT NULL,
  job_title text NOT NULL,
  official_email text NOT NULL,
  phone text NOT NULL,
  region text NOT NULL DEFAULT '',
  field text NOT NULL DEFAULT '',
  is_verified boolean NOT NULL DEFAULT false,
  verification_note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.community_entities TO authenticated;
GRANT ALL ON public.community_entities TO service_role;
ALTER TABLE public.community_entities ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_verified_member(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.community_entities WHERE user_id = _user_id AND is_verified);
$$;

CREATE OR REPLACE FUNCTION public.verify_community_entity()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.license_number := regexp_replace(NEW.license_number, '\s', '', 'g');
  IF NEW.license_number ~ '^[0-9]{10}$' THEN
    NEW.is_verified := true;
    NEW.verification_note := 'تم التحقق آلياً من رقم الترخيص / السجل التجاري';
  ELSE
    NEW.is_verified := false;
    NEW.verification_note := 'رقم الترخيص / السجل التجاري غير مطابق للصيغة الرسمية (10 أرقام)';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_verify_community_entity
BEFORE INSERT OR UPDATE ON public.community_entities
FOR EACH ROW EXECUTE FUNCTION public.verify_community_entity();

CREATE POLICY "Members insert own entity" ON public.community_entities
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Members update own entity" ON public.community_entities
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Members view own entity" ON public.community_entities
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Verified members view directory" ON public.community_entities
  FOR SELECT TO authenticated USING (is_verified AND public.is_verified_member(auth.uid()));
CREATE POLICY "Admins view all entities" ON public.community_entities
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update all entities" ON public.community_entities
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.conversation_participants (
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL DEFAULT '',
  attachment_path text,
  attachment_name text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at);

GRANT SELECT, INSERT, UPDATE ON public.conversations TO authenticated;
GRANT SELECT, INSERT ON public.conversation_participants TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT ALL ON public.conversations TO service_role;
GRANT ALL ON public.conversation_participants TO service_role;
GRANT ALL ON public.messages TO service_role;

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_conversation_participant(_conversation_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = _conversation_id AND user_id = _user_id
  );
$$;

CREATE POLICY "Participants view conversations" ON public.conversations
  FOR SELECT TO authenticated USING (public.is_conversation_participant(id, auth.uid()));
CREATE POLICY "Verified members create conversations" ON public.conversations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by AND public.is_verified_member(auth.uid()));
CREATE POLICY "Participants touch conversations" ON public.conversations
  FOR UPDATE TO authenticated USING (public.is_conversation_participant(id, auth.uid()))
  WITH CHECK (public.is_conversation_participant(id, auth.uid()));

CREATE POLICY "Participants view participants" ON public.conversation_participants
  FOR SELECT TO authenticated USING (public.is_conversation_participant(conversation_id, auth.uid()));
CREATE POLICY "Verified members add participants" ON public.conversation_participants
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_verified_member(auth.uid())
    AND public.is_verified_member(user_id)
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id AND c.created_by = auth.uid()
    )
  );

CREATE POLICY "Participants read messages" ON public.messages
  FOR SELECT TO authenticated USING (public.is_conversation_participant(conversation_id, auth.uid()));
CREATE POLICY "Participants send messages" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND public.is_verified_member(auth.uid())
    AND public.is_conversation_participant(conversation_id, auth.uid())
  );
CREATE POLICY "Recipients mark read" ON public.messages
  FOR UPDATE TO authenticated
  USING (public.is_conversation_participant(conversation_id, auth.uid()) AND sender_id <> auth.uid())
  WITH CHECK (public.is_conversation_participant(conversation_id, auth.uid()) AND sender_id <> auth.uid());

ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

CREATE POLICY "Members upload own chat files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'community-files' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Participants read chat files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'community-files'
    AND public.is_conversation_participant(((storage.foldername(name))[2])::uuid, auth.uid())
  );
