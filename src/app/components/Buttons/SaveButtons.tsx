"use client";

import { snapshotMeans, recordId } from "@/app/lib/mypage";
import SaveToggleButton from "@/app/components/Buttons/SaveToggleButton";

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
