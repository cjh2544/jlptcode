"use client";
import { useStrategyStore } from "@/app/store/strategyStore";
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
  const { levelUpInfo, levelUpList, isLoading, hasSearched } = useStrategyStore((state: any) => state);
  const showReadButton = useStrategyStore((state: any) => state.showReadButton);
  const showTransButton = useStrategyStore((state: any) => state.showTransButton);
  const showAnswer = useStrategyStore((state: any) => state.showAnswer);
  const showSpeakButton = useStrategyStore((state: any) => state.showSpeakButton);
  const setStoreData = useStrategyStore((state: any) => state.setStoreData);
  const init = useStrategyStore((state: any) => state.init);

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
  }, []);

  if (isLoading) return <Loading />;
  if (!hasSearched) return null;

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={(e) => e.preventDefault()}
    >
      <QuizTestShell
        mode="practice"
        title={t("strategy.title")}
        badge={levelUpInfo.level}
        toolbar={
          <>
            <QuizCheckbox
              id="show-read-checkbox"
              label={t("common.read")}
              checked={showReadButton}
              onChange={() => handleChangeCheck("showReadButton", !showReadButton)}
            />
            {"reading" !== levelUpInfo.classification && (
              <QuizCheckbox
                id="show-trans-checkbox"
                label={t("common.translation")}
                checked={showTransButton}
                onChange={() =>
                  handleChangeCheck("showTransButton", !showTransButton)
                }
              />
            )}
            {"grammar" !== levelUpInfo.classification &&
              "reading" !== levelUpInfo.classification &&
              "listening" !== levelUpInfo.classification && (
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
          <ModalAnswer title={`${t("strategy.mockTitle")} - ${levelUpInfo.level}`} />
        }
      >
        {levelUpList.length === 0 ? (
          <p className="app-today-empty">{t('common.noData')}</p>
        ) : (
          levelUpList.map((questionInfo: any, idx: number) => (
            <div key={`strategy-practice-${idx}`} className="app-quiz-item">
              <Question questionInfo={questionInfo} />
            </div>
          ))
        )}
      </QuizTestShell>
    </div>
  );
};

export default memo(QuestionTestPage);
