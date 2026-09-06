import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MessagesSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type QuestionRow = {
  id: string;
  body: string;
  asker_id: string;
  created_at: string;
};

/** On-platform Q&A thread for an opportunity — no off-platform contact allowed. */
export function OpportunityQuestions({
  rfqId,
  canAnswer,
}: {
  rfqId: string;
  canAnswer: boolean;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");

  const questions = useQuery({
    queryKey: ["rfq-questions", rfqId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunity_questions")
        .select("id, body, asker_id, created_at")
        .eq("rfq_id", rfqId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as QuestionRow[];
    },
  });

  const answers = useQuery({
    queryKey: ["rfq-answers", rfqId, questions.data?.length ?? 0],
    enabled: (questions.data?.length ?? 0) > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunity_answers")
        .select("id, question_id, body, created_at")
        .in("question_id", (questions.data ?? []).map((q) => q.id))
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const ask = useMutation({
    mutationFn: async () => {
      const text = body.trim();
      if (text.length < 5) throw new Error("قصير جداً");
      const { error } = await supabase
        .from("opportunity_questions")
        .insert({ rfq_id: rfqId, asker_id: user!.id, body: text.slice(0, 1000) });
      if (error) throw error;
    },
    onSuccess: () => {
      setBody("");
      toast.success("تم إرسال الاستفسار عبر المنصة");
      queryClient.invalidateQueries({ queryKey: ["rfq-questions", rfqId] });
    },
    onError: (e: Error) =>
      toast.error(e.message === "قصير جداً" ? "اكتب استفساراً أوضح" : "تعذر إرسال الاستفسار"),
  });

  const answer = useMutation({
    mutationFn: async ({ questionId, text }: { questionId: string; text: string }) => {
      const { error } = await supabase
        .from("opportunity_answers")
        .insert({ question_id: questionId, responder_id: user!.id, body: text.slice(0, 1000) });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم نشر الإجابة");
      queryClient.invalidateQueries({ queryKey: ["rfq-answers", rfqId] });
    },
    onError: () => toast.error("تعذر نشر الإجابة"),
  });

  return (
    <div className="rounded-2xl bg-secondary/40 p-4">
      <h4 className="flex items-center gap-2 text-sm font-extrabold">
        <MessagesSquare className="h-4 w-4 text-primary dark:text-gold" aria-hidden />
        الاستفسارات (داخل المنصة فقط)
      </h4>

      <ul className="mt-4 space-y-3">
        {(questions.data ?? []).map((q) => (
          <li key={q.id} className="rounded-xl bg-background/70 p-3">
            <p className="text-sm font-bold leading-relaxed">{q.body}</p>
            {(answers.data ?? [])
              .filter((a) => a.question_id === q.id)
              .map((a) => (
                <p
                  key={a.id}
                  className="mt-2 rounded-lg bg-primary/10 p-2 text-xs font-bold leading-relaxed"
                >
                  الرد: {a.body}
                </p>
              ))}
            {canAnswer && (
              <AnswerBox
                pending={answer.isPending}
                onSend={(text) => answer.mutate({ questionId: q.id, text })}
              />
            )}
          </li>
        ))}
        {questions.data?.length === 0 && (
          <li className="text-xs font-bold text-muted-foreground">لا توجد استفسارات بعد.</li>
        )}
      </ul>

      {!canAnswer && (
        <div className="mt-4">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={2}
            maxLength={1000}
            placeholder="اكتب استفسارك حول الفرصة..."
          />
          <Button
            size="sm"
            className="mt-2 rounded-full font-bold"
            disabled={ask.isPending}
            onClick={() => ask.mutate()}
          >
            {ask.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            إرسال الاستفسار
          </Button>
        </div>
      )}
    </div>
  );
}

function AnswerBox({ pending, onSend }: { pending: boolean; onSend: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <div className="mt-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        maxLength={1000}
        placeholder="اكتب الرد..."
      />
      <Button
        size="sm"
        variant="secondary"
        className="mt-2 rounded-full font-bold"
        disabled={pending || text.trim().length < 2}
        onClick={() => {
          onSend(text.trim());
          setText("");
        }}
      >
        نشر الرد
      </Button>
    </div>
  );
}
