export function recordQuizAttempt(payload: {
  subject: string;
  source?: string;
  level?: string | null;
  questions: any[];
}) {
  const questions = (payload.questions || []).map((item) => ({
    source: payload.source,
    sourceId: item._id || item.id,
    answer: item.answer,
    selectedAnswer: item.selectedAnswer,
  }));

  void fetch("/api/mypage/quiz-attempt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject: payload.subject,
      source: payload.source,
      level: payload.level || payload.questions?.[0]?.level || null,
      questions,
    }),
  }).catch(() => undefined);
}
