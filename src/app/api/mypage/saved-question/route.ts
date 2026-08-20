import UserSavedQuestion from "@/app/models/userSavedQuestionModel";
import { asText, snapshotContent } from "@/app/lib/mypage";
import { newId } from "@/app/lib/new-id";
import connectDB from "@/app/utils/database";
import { getOptionalUser, requireUser, userIdOf } from "@/app/utils/requireUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const user = await getOptionalUser();
  if (!user) return NextResponse.json({ items: [] });

  await connectDB();
  const items = await UserSavedQuestion.find({ userId: userIdOf(user) }).sort({ createdAt: -1 });
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireUser();
  if (error) return error;

  const body = await request.json();
  const source = asText(body.source);
  const sourceId = asText(body.sourceId);
  const subject = asText(body.subject);
  if (!source || !sourceId || !subject) {
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  }

  await connectDB();
  const userId = userIdOf(user);
  const existing = await UserSavedQuestion.findOne({ userId, source, sourceId });

  if (existing) {
    await UserSavedQuestion.deleteOne({ id: existing.id || existing._id, userId });
    return NextResponse.json({ success: true, saved: false });
  }

  await UserSavedQuestion.create({
    id: newId(),
    userId,
    source,
    sourceId,
    subject,
    content: snapshotContent(body.content) || asText(body.content),
    level: asText(body.level),
    classification: asText(body.classification),
    year: asText(body.year),
    study: asText(body.study),
  });

  return NextResponse.json({ success: true, saved: true });
}

export async function DELETE(request: NextRequest) {
  const { user, error } = await requireUser();
  if (error) return error;

  const body = await request.json();
  const id = asText(body.id);
  const source = asText(body.source);
  const sourceId = asText(body.sourceId);
  await connectDB();

  if (id) {
    await UserSavedQuestion.deleteOne({ id, userId: userIdOf(user) });
    return NextResponse.json({ success: true, saved: false });
  }

  if (!source || !sourceId) {
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  }

  await UserSavedQuestion.deleteOne({ userId: userIdOf(user), source, sourceId });
  return NextResponse.json({ success: true, saved: false });
}
