"use client";

import React, { memo } from "react";
import { useJptStore } from "@/app/store/jptStore";
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
  const jptList = useJptStore((state: any) => state.jptList);

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
        questions={jptList}
        anchorPrefix="jpt-question-"
      />
    </>
  );
};

export default memo(ModalAnswer);
