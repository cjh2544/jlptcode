"use client";

import { cn } from "@/lib/utils";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { memo } from "react";

type VisibilityIconProps = {
  /** true면 내용이 숨겨진 상태 → 열기(Unlock) 아이콘 */
  hidden: boolean;
  className?: string;
};

/**
 * 숨김/보기 토글용 아이콘.
 * 눈 아이콘 대신 잠금 메타포로 표시 상태를 명확히 전달한다.
 */
const VisibilityIcon = ({ hidden, className }: VisibilityIconProps) => {
  const Icon = hidden ? LockKeyholeOpen : LockKeyhole;
  return (
    <Icon
      className={cn("size-4 shrink-0", className)}
      strokeWidth={2.25}
      aria-hidden
    />
  );
};

export default memo(VisibilityIcon);
