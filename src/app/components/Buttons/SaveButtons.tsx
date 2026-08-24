"use client";

import { snapshotContent, snapshotMeans, recordId } from "@/app/lib/mypage";
import SaveToggleButton from "@/app/components/Buttons/SaveToggleButton";

export function SaveSentenceButton({
  item,
  source,
  compact,
  className,
}: {
  item: any;
  source: string;
  compact?: boolean;
  className?: string;
}) {
  const sourceId = recordId(item);
  if (!sourceId) return null;

  return (
    <SaveToggleButton
      source={source}
      sourceId={sourceId}
      snapshot={{
        word: snapshotContent(item.sentence),
        read: snapshotContent(item.sentence_read),
        means: snapshotContent(item.sentence_translate),
        level: item.level,
      }}
      compact={compact}
      className={className}
    />
  );
}

export function SaveWordButton({
  item,
  source,
  compact,
  className,
}: {
  item: any;
  source: string;
  compact?: boolean;
  className?: string;
}) {
  const sourceId = recordId(item);
  if (!sourceId) return null;

  return (
    <SaveToggleButton
      source={source}
      sourceId={sourceId}
      snapshot={{
        word: item.word,
        read: item.read,
        means: snapshotMeans(item.means),
        level: item.level,
      }}
      compact={compact}
      className={className}
    />
  );
}
