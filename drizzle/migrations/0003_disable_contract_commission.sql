CREATE OR REPLACE FUNCTION public.create_contract_commission()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Open Loop no longer takes a commission on contract value.
  RETURN NEW;
END;
$$;
COMMENT ON TABLE public.commissions IS 'DEPRECATED: Open Loop no longer charges commission on contracts.';