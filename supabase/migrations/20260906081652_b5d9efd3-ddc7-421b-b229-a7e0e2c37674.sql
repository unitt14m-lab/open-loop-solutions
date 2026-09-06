ALTER TABLE public.rfqs
ADD COLUMN requires_openloop_review boolean NOT NULL DEFAULT false;