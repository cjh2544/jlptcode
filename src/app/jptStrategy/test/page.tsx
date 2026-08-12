"use client";
import { useJptStore } from "@/app/store/jptStore";
import Question from "../components/question";
import { memo } from "react";
import ModalAnswer from "../components/modalAnswer";
import StrategyLayout from "@/app/components/Layout/StrategyLayout";
import Loading from "@/app/components/Loading/loading";
import { useTranslations } from "@/app/providers/I18nProvider";
import QuizTestShell, { QuizCheckbox } from "@/app/components/Quiz/QuizTestShell";

const JptStrategyTestPage = () => {
  const { t } = useTranslations();
  const { jptInfo, jptList, isLoading } = useJptStore((state: any) => state);
  const showAnswer = useJptStore((state: any) => state.showAnswer);
  const setStoreData = useJptStore((state: any) => state.setStoreData);

  return (
    <StrategyLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <div
          onContextMenu={(e) => e.preventDefault()}
          onMouseDown={(e) => e.preventDefault()}
        >
          <QuizTestShell
            mode="full"
            title={t("strategy.title")}
            badge={jptInfo.level}
            toolbar={
              <QuizCheckbox
                id="show-answer-checkbox"
                label={t("common.showAnswer")}
                checked={showAnswer}
                onChange={() => setStoreData("showAnswer", !showAnswer)}
              />
            }
            footer={<ModalAnswer title={`JPT - ${jptInfo.level}`} />}
          >
            {jptList.map((questionInfo: any, idx: number) => (
              <Question key={`jpt-strategy-test-${idx}`} questionInfo={questionInfo} />
            ))}
          </QuizTestShell>
        </div>
      )}
    </StrategyLayout>
  );
};

export default memo(JptStrategyTestPage);
