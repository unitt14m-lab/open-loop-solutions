import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCheck, Loader2, Paperclip, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  fetchMyEntity,
  signedChatFileUrl,
  uploadChatFile,
  type CommunityEntity,
} from "@/lib/community";

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  attachment_path: string | null;
  attachment_name: string | null;
  read_at: string | null;
  created_at: string;
};

type Thread = {
  conversationId: string;
  otherUserId: string;
  entity: CommunityEntity | null;
  lastMessageAt: string;
};

export function CommunityChat({
  activeId,
  onSelect,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const myEntity = useQuery({
    queryKey: ["community-entity", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => fetchMyEntity(user!.id),
  });

  const threads = useQuery({
    queryKey: ["community-threads", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async (): Promise<Thread[]> => {
      const { data: mine, error } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      const ids = (mine ?? []).map((r) => r.conversation_id);
      if (!ids.length) return [];

      const [others, convs] = await Promise.all([
        supabase
          .from("conversation_participants")
          .select("conversation_id,user_id")
          .in("conversation_id", ids)
          .neq("user_id", user!.id),
        supabase.from("conversations").select("id,last_message_at").in("id", ids),
      ]);
      if (others.error) throw others.error;
      if (convs.error) throw convs.error;

      const otherIds = [...new Set((others.data ?? []).map((r) => r.user_id))];
      const entities = otherIds.length
        ? await supabase.from("community_entities").select("*").in("user_id", otherIds)
        : { data: [], error: null };
      if (entities.error) throw entities.error;

      const byUser = new Map(
        ((entities.data ?? []) as CommunityEntity[]).map((e) => [e.user_id, e]),
      );
      const lastByConv = new Map(
        (convs.data ?? []).map((c) => [c.id, c.last_message_at as string]),
      );

      return (others.data ?? [])
        .map((r) => ({
          conversationId: r.conversation_id,
          otherUserId: r.user_id,
          entity: byUser.get(r.user_id) ?? null,
          lastMessageAt: lastByConv.get(r.conversation_id) ?? "",
        }))
        .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
    },
  });

  const messages = useQuery({
    queryKey: ["community-messages", activeId],
    enabled: Boolean(activeId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", activeId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Message[];
    },
  });

  // Realtime updates for the open conversation.
  useEffect(() => {
    if (!activeId) return;
    const channel = supabase
      .channel(`messages-${activeId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `conversation_id=eq.${activeId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["community-messages", activeId] });
          queryClient.invalidateQueries({ queryKey: ["community-threads", user?.id] });
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [activeId, queryClient, user?.id]);

  // Read receipts: mark incoming messages as read once shown.
  useEffect(() => {
    if (!activeId || !user) return;
    const unread = (messages.data ?? []).filter((m) => m.sender_id !== user.id && !m.read_at);
    if (!unread.length) return;
    void supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .in(
        "id",
        unread.map((m) => m.id),
      );
  }, [activeId, messages.data, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.data]);

  const activeThread = useMemo(
    () => (threads.data ?? []).find((t) => t.conversationId === activeId) ?? null,
    [threads.data, activeId],
  );

  const verified = Boolean(myEntity.data?.is_verified);

  const send = async (file?: File | null) => {
    if (!user || !activeId) return;
    const body = draft.trim();
    if (!body && !file) return;
    setSending(true);
    try {
      let attachmentPath: string | null = null;
      if (file) attachmentPath = await uploadChatFile(user.id, activeId, file);
      const { error } = await supabase.from("messages").insert({
        conversation_id: activeId,
        sender_id: user.id,
        body: body.slice(0, 2000),
        attachment_path: attachmentPath,
        attachment_name: file?.name ?? null,
      });
      if (error) throw error;
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", activeId);
      setDraft("");
      queryClient.invalidateQueries({ queryKey: ["community-messages", activeId] });
    } catch {
      toast.error("تعذر إرسال الرسالة");
    } finally {
      setSending(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const openAttachment = async (path: string) => {
    try {
      const url = await signedChatFileUrl(path);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("تعذر فتح المرفق");
    }
  };

  if (!verified && !myEntity.isLoading) {
    return (
      <div className="card-elevated p-8 text-center">
        <p className="text-sm font-bold">
          المحادثات متاحة للجهات المعتمدة فقط. أكمل تسجيل جهتك في صفحة «مجتمع أوبن لوب».
        </p>
      </div>
    );
  }

  return (
    <div className="card-elevated grid h-[calc(100vh-16rem)] min-h-[520px] overflow-hidden md:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)]">
      <aside className="hidden flex-col border-e border-border md:flex">
        <div className="border-b border-border p-4">
          <h2 className="text-sm font-extrabold">المحادثات</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.isLoading && (
            <p className="p-4 text-sm text-muted-foreground">جارٍ التحميل...</p>
          )}
          {threads.data?.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">
              لا توجد محادثات بعد. ابدأ من دليل المجتمع بزر «تواصل الآن».
            </p>
          )}
          {threads.data?.map((t) => (
            <button
              key={t.conversationId}
              type="button"
              onClick={() => onSelect(t.conversationId)}
              className={`block w-full border-b border-border p-4 text-start transition-colors hover:bg-secondary ${
                t.conversationId === activeId ? "bg-secondary" : ""
              }`}
            >
              <span className="block truncate text-sm font-extrabold">
                {t.entity?.entity_name ?? "جهة"}
              </span>
              <span className="mt-1 block truncate text-xs text-muted-foreground">
                {t.entity?.representative_name ?? ""}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex min-w-0 flex-col">
        <div className="border-b border-border p-4">
          <h3 className="text-sm font-extrabold">
            {activeThread?.entity?.entity_name ?? "اختر محادثة"}
          </h3>
          {activeThread?.entity && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {activeThread.entity.representative_name} — {activeThread.entity.job_title}
            </p>
          )}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-secondary/40 p-4">
          {!activeId && (
            <p className="text-sm text-muted-foreground">اختر جهة من القائمة لبدء المحادثة.</p>
          )}
          {messages.data?.map((m) => {
            const mine = m.sender_id === user?.id;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    mine ? "bg-primary text-primary-foreground" : "bg-card text-foreground shadow-sm"
                  }`}
                >
                  {m.body && <p className="whitespace-pre-wrap break-words">{m.body}</p>}
                  {m.attachment_path && (
                    <button
                      type="button"
                      onClick={() => openAttachment(m.attachment_path!)}
                      className="mt-2 flex items-center gap-1.5 text-xs font-bold underline"
                    >
                      <Paperclip className="h-3.5 w-3.5" aria-hidden />
                      {m.attachment_name ?? "مرفق"}
                    </button>
                  )}
                  <span className="mt-1.5 flex items-center gap-1 text-[10px] opacity-70">
                    {new Date(m.created_at).toLocaleTimeString("ar-SA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {mine && (
                      <CheckCheck
                        className={`h-3.5 w-3.5 ${m.read_at ? "text-gold" : ""}`}
                        aria-label={m.read_at ? "تم الاطلاع" : "تم الإرسال"}
                      />
                    )}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form
          className="flex items-center gap-2 border-t border-border p-3"
          onSubmit={(e) => {
            e.preventDefault();
            void send(null);
          }}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void send(f);
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            disabled={!activeId || sending}
            onClick={() => fileRef.current?.click()}
            aria-label="إرفاق ملف"
          >
            <Paperclip className="h-4 w-4" aria-hidden />
          </Button>
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="اكتب رسالتك..."
            maxLength={2000}
            disabled={!activeId || sending}
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full"
            disabled={!activeId || sending}
            aria-label="إرسال"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Send className="h-4 w-4" aria-hidden />
            )}
          </Button>
        </form>
      </section>
    </div>
  );
}
