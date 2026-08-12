"use client";

import React, { memo } from "react";
import { useStrategyStore } from "@/app/store/strategyStore";
import { useTranslations } from "@/app/providers/I18nProvider";
import QuizScoreDialog from "@/app/components/Quiz/QuizScoreDialog";
import PaidButton from "@/app/components/Buttons/PaidButton";
import { Button } from "@/components/ui/button";

type ModalAnswerProps = {
  title: string;
  btnTitle?: string;
};

const ModalAnswer = (props: ModalAnswerProps) => {
  const { t } = useTranslations();
  const { title, btnTitle = t("quiz.checkAnswer") } = props;
  const [showModal, setShowModal] = React.useState(false);
  const levelUpList = useStrategyStore((state: any) => state.levelUpList);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={handleScrollTop}>
          <i className="fas fa-arrow-up mr-1" />
          TOP
        </Button>
        <PaidButton name={btnTitle} color="pink" onClick={() => setShowModal(true)} />
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
