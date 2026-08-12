"use client";

import React, { memo } from "react";
import Link from "next/link";
import { useLevelUpStore } from "@/app/store/levelUpNewStore";
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
  const levelUpList = useLevelUpStore((state: any) => state.levelUpList);

  return (
    <>
      <div className="flex justify-between gap-3">
        <Button variant="outline" asChild>
          <Link scroll={false} href="/levelUpNew">
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
        questions={levelUpList}
        anchorPrefix="levelup-question-"
      />
    </>
  );
};

export default memo(ModalAnswer);
