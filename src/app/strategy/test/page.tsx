"use client";
import { useStrategyStore } from "@/app/store/strategyStore";
import Question from "../components/question";
import { memo } from "react";
import ModalAnswer from "../components/modalAnswer";
import StrategyLayout from "@/app/components/Layout/StrategyLayout";
import Loading from "@/app/components/Loading/loading";
import { useTranslations } from "@/app/providers/I18nProvider";
import QuizTestShell, { QuizCheckbox } from "@/app/components/Quiz/QuizTestShell";
import { withGroupedImageTools } from "@/app/lib/question-html";

const StrategyTestPage = () => {
  const { t } = useTranslations();
  const { levelUpInfo, levelUpList, isLoading } = useStrategyStore((state: any) => state);
  const showAnswer = useStrategyStore((state: any) => state.showAnswer);
  const setStoreData = useStrategyStore((state: any) => state.setStoreData);

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
            badge={levelUpInfo.level}
            toolbar={
              <QuizCheckbox
                id="show-answer-checkbox"
                label={t("common.showAnswer")}
                checked={showAnswer}
                onChange={() => setStoreData("showAnswer", !showAnswer)}
              />
            }
            footer={
              <ModalAnswer title={`${t("strategy.mockTitle")} - ${levelUpInfo.level}`} />
            }
          >
            {withGroupedImageTools(levelUpList).map(({ item, hideTools, index }) => (
              <Question key={`strategy-full-test-${index}`} questionInfo={item} hideTools={hideTools} />
            ))}
          </QuizTestShell>
        </div>
      )}
    </StrategyLayout>
  );
};

export default memo(StrategyTestPage);
