"use client";
import { useJlptStore } from "@/app/store/jlptStore";
import JlptLayout from "@/app/components/Layout/JlptLayout";
import Question from "../components/question";
import { memo } from "react";
import ModalAnswer from "../components/modalAnswer";
import Loading from "@/app/components/Loading/loading";
import { isEmpty } from "lodash";
import EmptyData from "@/app/components/Alert/EmptyData";
import { useTranslations } from "@/app/providers/I18nProvider";
import QuizTestShell, { QuizCheckbox } from "@/app/components/Quiz/QuizTestShell";

const JlptTestPage = () => {
  const { t } = useTranslations();
  const searchInfo = useJlptStore((state: any) => state.searchInfo);
  const jlptList = useJlptStore((state: any) => state.jlptList);
  const isLoading = useJlptStore((state: any) => state.isLoading);
  const showAnswer = useJlptStore((state: any) => state.showAnswer);
  const setShowAnswer = useJlptStore((state: any) => state.setShowAnswer);

  type ClassificationKey = "vocabulary" | "grammar" | "reading" | "listening";

  const classificationContentMap: Record<ClassificationKey, React.JSX.Element> = {
    vocabulary: <p>文字語彙</p>,
    grammar: <p>文法</p>,
    reading: <p>読解</p>,
    listening: <p>聴解</p>,
  };

  const isClassificationKey = (key: any): key is ClassificationKey =>
    ["vocabulary", "grammar", "reading", "listening"].includes(key);

  const classification = searchInfo.classification;

  return (
    <JlptLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <div
          onContextMenu={(e) => e.preventDefault()}
          onMouseDown={(e) => e.preventDefault()}
        >
          <QuizTestShell
            mode="full"
            title={
              isClassificationKey(classification)
                ? classificationContentMap[classification]
                : null
            }
            badge={`${searchInfo.year}/${searchInfo.month} - ${searchInfo.level}`}
            toolbar={
              <QuizCheckbox
                id="show-answer-checkbox"
                label={t("common.showAnswer")}
                checked={showAnswer}
                onChange={() => setShowAnswer(!showAnswer)}
              />
            }
            footer={
              <ModalAnswer
                title={`${searchInfo.year}/${searchInfo.month} - ${searchInfo.level}`}
              />
            }
          >
            {isEmpty(jlptList) && (
              <EmptyData text={t("common.preparing")} className="bg-muted rounded-lg p-6" />
            )}
            {jlptList.map((questionInfo: any, idx: number) => (
              <Question key={`jlpt-test-${idx}`} questionInfo={questionInfo} />
            ))}
          </QuizTestShell>
        </div>
      )}
    </JlptLayout>
  );
};

export default memo(JlptTestPage);
