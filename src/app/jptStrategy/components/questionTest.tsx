"use client";
import { useJptStore } from "@/app/store/jptStore";
import Question from "./question";
import { memo, ReactNode, useEffect, useState } from "react";
import ModalAnswer from "./modalAnswer";
import Loading from "@/app/components/Loading/loading";
import { useSession } from "next-auth/react";
import ModalConfirm from "@/app/components/Modals/ModalConfirm";
import { useTranslations } from "@/app/providers/I18nProvider";
import QuizTestShell, { QuizCheckbox } from "@/app/components/Quiz/QuizTestShell";

const QuestionTestPage = () => {
  const { t } = useTranslations();
  const { jptInfo, jptList, isLoading } = useJptStore((state: any) => state);
  const showReadButton = useJptStore((state: any) => state.showReadButton);
  const showTransButton = useJptStore((state: any) => state.showTransButton);
  const showSpeakButton = useJptStore((state: any) => state.showSpeakButton);
  const showAnswer = useJptStore((state: any) => state.showAnswer);
  const setStoreData = useJptStore((state: any) => state.setStoreData);
  const getJptList = useJptStore((state: any) => state.getJptList);
  const init = useJptStore((state: any) => state.init);

  const [confirmMsg, setConfirmMsg] = useState<ReactNode>("");
  const [confirmType, setConfirmType] = useState<any>("info");
  const [isShowConfirm, setShowConfirm] = useState<boolean>(false);
  const { data: session } = useSession();

  const handleChangeCheck = (key: string, value: any) => {
    if (!session?.paymentInfo?.isValid) {
      setConfirmMsg(
        <>
          {t("common.paidOnly")}
          <br />
          {t("common.paidOnlyHint")}
        </>,
      );
      setShowConfirm(true);
      return;
    }
    setStoreData(key, value);
  };

  useEffect(() => {
    init();
    getJptList();
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <div
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={(e) => e.preventDefault()}
    >
      <QuizTestShell
        mode="practice"
        title={t("strategy.title")}
        badge={jptInfo.part}
        toolbar={
          <>
            <QuizCheckbox
              id="show-read-checkbox"
              label={t("common.read")}
              checked={showReadButton}
              onChange={() => handleChangeCheck("showReadButton", !showReadButton)}
            />
            <QuizCheckbox
              id="show-trans-checkbox"
              label={t("common.translation")}
              checked={showTransButton}
              onChange={() =>
                handleChangeCheck("showTransButton", !showTransButton)
              }
            />
            {jptInfo.classification === "reading" && (
              <QuizCheckbox
                id="show-speak-checkbox"
                label={t("common.pronunciation")}
                checked={showSpeakButton}
                onChange={() =>
                  handleChangeCheck("showSpeakButton", !showSpeakButton)
                }
              />
            )}
            <QuizCheckbox
              id="show-answer-checkbox"
              label={t("common.answer")}
              checked={showAnswer}
              onChange={() => handleChangeCheck("showAnswer", !showAnswer)}
            />
            <ModalConfirm
              type={confirmType}
              message={confirmMsg}
              visible={isShowConfirm}
              onClose={(visible: boolean) => setShowConfirm(visible)}
            />
          </>
        }
        footer={
          <ModalAnswer title={`${t("strategy.mockTitle")} - ${jptInfo.part}`} />
        }
      >
        {jptList.map((questionInfo: any, idx: number) => (
          <div key={`jpt-strategy-practice-${idx}`} className="app-quiz-item">
            <Question questionInfo={questionInfo} />
          </div>
        ))}
      </QuizTestShell>
    </div>
  );
};

export default memo(QuestionTestPage);
