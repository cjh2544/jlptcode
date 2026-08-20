import { asText, MYPAGE_SUBJECTS, recordId } from "@/app/lib/mypage";
import { newId } from "@/app/lib/new-id";
import UserQuestionResult from "@/app/models/userQuestionResultModel";
import UserQuizAttempt from "@/app/models/userQuizAttemptModel";
import connectDB from "@/app/utils/database";
import { requireUser, userIdOf } from "@/app/utils/requireUser";
import { NextRequest, NextResponse } from "next/server";

type IncomingQuestion = {
  source?: string;
  sourceId?: string;
  _id?: string;
  id?: string;
  answer?: number;
  selectedAnswer?: number;
};

export async function POST(request: NextRequest) {
  const { user, error } = await requireUser();
  if (error) return error;

  const body = await request.json();
  const subject = asText(body.subject);
  if (!subject || !MYPAGE_SUBJECTS.includes(subject as (typeof MYPAGE_SUBJECTS)[number])) {
    return NextResponse.json({ success: false, message: "Invalid subject" }, { status: 400 });
  }

  const source = asText(body.source) || subject;
  const questions: IncomingQuestion[] = Array.isArray(body.questions) ? body.questions : [];
  const scored = questions
    .map((item) => {
      const sourceId = asText(item.sourceId) || recordId(item);
      const selected = Number(item.selectedAnswer);
      const answer = Number(item.answer);
      if (!sourceId || !Number.isFinite(answer) || !Number.isFinite(selected) || selected <= 0) {
        return null;
      }
      return {
        source: asText(item.source) || source,
        sourceId,
        isCorrect: answer === selected,
      };
    })
    .filter((item): item is { source: string; sourceId: string; isCorrect: boolean } => Boolean(item));

  if (!scored.length) {
    return NextResponse.json({ success: true, skipped: true });
  }

  const total = scored.length;
  const correct = scored.filter((item) => item.isCorrect).length;
  const wrong = total - correct;
  const userId = userIdOf(user);

  await connectDB();
  const attemptId = newId();
  await UserQuizAttempt.create({
    id: attemptId,
    userId,
    subject,
    level: asText(body.level),
    total,
    correct,
    wrong,
  });

  for (const item of scored) {
    const existing = await UserQuestionResult.findOne({
      userId,
      source: item.source,
      sourceId: item.sourceId,
    });
    if (existing) {
      await UserQuestionResult.updateOne(
        { id: existing.id || existing._id },
        { subject, isCorrect: item.isCorrect, attemptId }
      );
    } else {
      await UserQuestionResult.create({
        id: newId(),
        userId,
        source: item.source,
        sourceId: item.sourceId,
        subject,
        isCorrect: item.isCorrect,
        attemptId,
      });
    }
  }

  return NextResponse.json({ success: true, total, correct, wrong });
}
