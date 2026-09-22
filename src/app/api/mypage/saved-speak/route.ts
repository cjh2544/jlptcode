import UserSavedSpeak from "@/app/models/userSavedSpeakModel";
import { asText, SAVED_SPEAK_LIMIT, snapshotContent } from "@/app/lib/mypage";
import { newId } from "@/app/lib/new-id";
import connectDB from "@/app/utils/database";
import { getOptionalUser, requireUser, userIdOf } from "@/app/utils/requireUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const user = await getOptionalUser();
  if (!user) return NextResponse.json({ items: [] });

  await connectDB();
  const items = await UserSavedSpeak.find({ userId: userIdOf(user) }).sort({ createdAt: -1 });
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireUser();
  if (error) return error;

  const body = await request.json();
  const source = asText(body.source);
  const sourceId = asText(body.sourceId);
  if (!source || !sourceId) {
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  }

  await connectDB();
  const userId = userIdOf(user);
  const existing = await UserSavedSpeak.findOne({ userId, source, sourceId });

  if (existing) {
    await UserSavedSpeak.deleteOne({ id: existing.id || existing._id, userId });
    return NextResponse.json({ success: true, saved: false });
  }

  const count = await UserSavedSpeak.count({ userId });
  if (count >= SAVED_SPEAK_LIMIT) {
    return NextResponse.json(
      { success: false, message: "LIMIT_REACHED", limit: SAVED_SPEAK_LIMIT },
      { status: 400 },
    );
  }

  await UserSavedSpeak.create({
    id: newId(),
    userId,
    source,
    sourceId,
    keyword: snapshotContent(body.keyword) || asText(body.keyword),
    sentence: snapshotContent(body.sentence) || asText(body.sentence),
    sentenceRead: snapshotContent(body.sentenceRead ?? body.sentence_read) || asText(body.sentenceRead ?? body.sentence_read),
    sentenceTranslate:
      snapshotContent(body.sentenceTranslate ?? body.sentence_translate) ||
      asText(body.sentenceTranslate ?? body.sentence_translate),
    speaker: asText(body.speaker),
    level: asText(body.level),
    study: asText(body.study),
  });

  return NextResponse.json({ success: true, saved: true });
}

export async function DELETE(request: NextRequest) {
  const { user, error } = await requireUser();
  if (error) return error;

  const body = await request.json();
  const all = Boolean(body.all);
  const id = asText(body.id);
  const source = asText(body.source);
  const sourceId = asText(body.sourceId);
  await connectDB();

  if (all) {
    await UserSavedSpeak.deleteMany({ userId: userIdOf(user) });
    return NextResponse.json({ success: true, saved: false });
  }

  if (id) {
    await UserSavedSpeak.deleteOne({ id, userId: userIdOf(user) });
    return NextResponse.json({ success: true, saved: false });
  }

  if (!source || !sourceId) {
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  }

  await UserSavedSpeak.deleteOne({ userId: userIdOf(user), source, sourceId });
  return NextResponse.json({ success: true, saved: false });
}
