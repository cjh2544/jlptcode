"use client";

import React, { memo, ReactNode } from "react";

type QuizCheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
};

export const QuizCheckbox = memo(function QuizCheckbox({
  id,
  label,
  checked,
  onChange,
}: QuizCheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 rounded"
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
});

type QuizTestShellProps = {
  title: ReactNode;
  toolbar?: ReactNode;
  badge?: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  mode?: "practice" | "full";
};

const QuizTestShell = (props: QuizTestShellProps) => {
  const { title, toolbar, badge, footer, children, mode = "full" } = props;

  return (
    <div className="px-4 mx-auto w-full m-10">
      <div className="app-panel w-full mb-6">
        <div className="app-panel-header">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h6 className="text-lg font-bold">{title}</h6>
            <div className="app-quiz-toolbar">
              {toolbar}
              {badge && <span className="app-quiz-badge">{badge}</span>}
            </div>
          </div>
        </div>

        <div
          className={`app-quiz-body ${mode === "practice" ? "app-quiz-body--practice" : "app-quiz-body--full"}`}
        >
          {children}
        </div>

        <div className="app-quiz-footer">{footer}</div>
      </div>
    </div>
  );
};

export default memo(QuizTestShell);
