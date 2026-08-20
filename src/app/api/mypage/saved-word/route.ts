import UserSavedWord from "@/app/models/userSavedWordModel";
import { asText, snapshotMeans } from "@/app/lib/mypage";
import { newId } from "@/app/lib/new-id";
import connectDB from "@/app/utils/database";
import { getOptionalUser, requireUser, userIdOf } from "@/app/utils/requireUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const user = await getOptionalUser();
  if (!user) return NextResponse.json({ items: [] });

  await connectDB();
  const items = await UserSavedWord.find({ userId: userIdOf(user) }).sort({ createdAt: -1 });
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
  const existing = await UserSavedWord.findOne({ userId, source, sourceId });

  if (existing) {
    await UserSavedWord.deleteOne({ id: existing.id || existing._id, userId });
    return NextResponse.json({ success: true, saved: false });
  }

  await UserSavedWord.create({
    id: newId(),
    userId,
    source,
    sourceId,
    word: asText(body.word),
    read: asText(body.read),
    means: snapshotMeans(body.means) || asText(body.means),
    level: asText(body.level),
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
    await UserSavedWord.deleteMany({ userId: userIdOf(user) });
    return NextResponse.json({ success: true, saved: false });
  }

  if (id) {
    await UserSavedWord.deleteOne({ id, userId: userIdOf(user) });
    return NextResponse.json({ success: true, saved: false });
  }

  if (!source || !sourceId) {
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  }

  await UserSavedWord.deleteOne({ userId: userIdOf(user), source, sourceId });
  return NextResponse.json({ success: true, saved: false });
}
