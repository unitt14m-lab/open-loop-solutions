
REVOKE EXECUTE ON FUNCTION public.is_verified_member(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_conversation_participant(uuid, uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.is_verified_member(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_conversation_participant(uuid, uuid) TO authenticated, service_role;
