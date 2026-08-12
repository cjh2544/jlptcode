"use client";
import { useLevelUpStore } from "@/app/store/levelUpNewStore";
import Question from "../components/question";
import { memo } from "react";
import ModalAnswer from "../components/modalAnswer";
import LevelUpLayout from "@/app/components/Layout/LevelUpLayout";
import Loading from "@/app/components/Loading/loading";
import { useTranslations } from "@/app/providers/I18nProvider";
import QuizTestShell, { QuizCheckbox } from "@/app/components/Quiz/QuizTestShell";

const LevelUpNewTestPage = () => {
  const { t } = useTranslations();
  const { levelUpInfo, levelUpList, isLoading } = useLevelUpStore((state: any) => state);
  const showAnswer = useLevelUpStore((state: any) => state.showAnswer);
  const setStoreData = useLevelUpStore((state: any) => state.setStoreData);

  return (
    <LevelUpLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <div
          onContextMenu={(e) => e.preventDefault()}
          onMouseDown={(e) => e.preventDefault()}
        >
          <QuizTestShell
            mode="full"
            title={t("layout.levelUp")}
            badge={levelUpInfo.level}
            toolbar={
              <QuizCheckbox
                id="show-answer-checkbox"
                label={t("common.showAnswer")}
                checked={showAnswer}
                onChange={() => setStoreData("showAnswer", !showAnswer)}
              />
            }
            footer={<ModalAnswer title={`Level up - ${levelUpInfo.level}`} />}
          >
            {levelUpList.map((questionInfo: any, idx: number) => (
              <Question key={`levelUpNew-test-${idx}`} questionInfo={questionInfo} />
            ))}
          </QuizTestShell>
        </div>
      )}
    </LevelUpLayout>
  );
};

export default memo(LevelUpNewTestPage);
