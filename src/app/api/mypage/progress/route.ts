import { MYPAGE_SUBJECTS } from "@/app/lib/mypage";
import UserQuizAttempt from "@/app/models/userQuizAttemptModel";
import connectDB from "@/app/utils/database";
import { requireUser, userIdOf } from "@/app/utils/requireUser";
import { NextResponse } from "next/server";

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return error;

  await connectDB();
  const userId = userIdOf(user);
  const attempts = await UserQuizAttempt.find({ userId }).sort({ createdAt: -1 });

  const items = MYPAGE_SUBJECTS.map((subject) => {
    const list = attempts.filter((item: { subject: string }) => item.subject === subject);
    const latest = list[0] || null;
    const totalCorrect = list.reduce((sum: number, item: { correct: number }) => sum + item.correct, 0);
    const totalWrong = list.reduce((sum: number, item: { wrong: number }) => sum + item.wrong, 0);
    const totalAnswered = list.reduce((sum: number, item: { total: number }) => sum + item.total, 0);
    return {
      subject,
      attemptCount: list.length,
      totalCorrect,
      totalWrong,
      totalAnswered,
      latest: latest
        ? {
            total: latest.total,
            correct: latest.correct,
            wrong: latest.wrong,
            level: latest.level,
            createdAt: latest.createdAt,
            accuracy: latest.total > 0 ? Math.round((latest.correct / latest.total) * 100) : 0,
          }
        : null,
    };
  });

  const history = [...attempts]
    .slice(0, 30)
    .reverse()
    .map((item: { subject: string; total: number; correct: number; wrong: number; level?: string; createdAt: Date }) => ({
      subject: item.subject,
      total: item.total,
      correct: item.correct,
      wrong: item.wrong,
      level: item.level,
      createdAt: item.createdAt,
      accuracy: item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0,
    }));

  return NextResponse.json({ items, history });
}
