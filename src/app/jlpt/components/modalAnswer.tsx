"use client";

import React, { memo } from "react";
import Link from "next/link";
import { useJlptStore } from "@/app/store/jlptStore";
import { useTranslations } from "@/app/providers/I18nProvider";
import QuizScoreDialog from "@/app/components/Quiz/QuizScoreDialog";
import { Button } from "@/components/ui/button";

type ModalAnswerProps = {
  title: string;
  btnTitle?: string;
};

const ModalAnswer = (props: ModalAnswerProps) => {
  const { t } = useTranslations();
  const { title, btnTitle = t("quiz.checkAnswer") } = props;
  const [showModal, setShowModal] = React.useState(false);
  const jlptList = useJlptStore((state: any) => state.jlptList);

  return (
    <>
      <div className="flex justify-between gap-3">
        <Button variant="outline" asChild>
          <Link scroll={false} href="/jlpt">
            {t("common.list")}
          </Link>
        </Button>
        <Button
          className="bg-rose-500 hover:bg-rose-600 text-white"
          onClick={() => setShowModal(true)}
        >
          {btnTitle}
        </Button>
      </div>

      <QuizScoreDialog
        open={showModal}
        onOpenChange={setShowModal}
        title={title}
        questions={jlptList}
        anchorPrefix="jlpt-question-"
      />
    </>
  );
};

export default memo(ModalAnswer);
