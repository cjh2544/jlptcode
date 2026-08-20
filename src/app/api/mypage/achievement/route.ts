import { MYPAGE_SUBJECTS } from "@/app/lib/mypage";
import UserQuestionResult from "@/app/models/userQuestionResultModel";
import connectDB from "@/app/utils/database";
import { requireUser, userIdOf } from "@/app/utils/requireUser";
import { NextResponse } from "next/server";

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return error;

  await connectDB();
  const userId = userIdOf(user);
  const results = await UserQuestionResult.find({ userId });

  const items = MYPAGE_SUBJECTS.map((subject) => {
    const list = results.filter((item: { subject: string }) => item.subject === subject);
    const solved = list.length;
    const correct = list.filter((item: { isCorrect: boolean }) => item.isCorrect).length;
    const wrong = solved - correct;
    const accuracy = solved > 0 ? Math.round((correct / solved) * 100) : 0;
    return { subject, solved, correct, wrong, accuracy };
  });

  return NextResponse.json({ items });
}
