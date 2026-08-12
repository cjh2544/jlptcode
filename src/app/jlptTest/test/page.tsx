"use client";
import { useJlptTestStore } from "@/app/store/jlptTestStore";
import JlptTestLayout from "@/app/components/Layout/JlptTestLayout";
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
  const searchInfo = useJlptTestStore((state: any) => state.searchInfo);
  const jlptList = useJlptTestStore((state: any) => state.jlptList);
  const isLoading = useJlptTestStore((state: any) => state.isLoading);
  const showAnswer = useJlptTestStore((state: any) => state.showAnswer);
  const showReadButton = useJlptTestStore((state: any) => state.showReadButton);
  const showTransButton = useJlptTestStore((state: any) => state.showTransButton);
  const setShowAnswer = useJlptTestStore((state: any) => state.setShowAnswer);
  const setStoreData = useJlptTestStore((state: any) => state.setStoreData);

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
    <JlptTestLayout>
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
            badge={`${searchInfo.test} - ${searchInfo.level}`}
            toolbar={
              <>
                <QuizCheckbox
                  id="show-read-checkbox"
                  label={t("common.read")}
                  checked={showReadButton}
                  onChange={() => setStoreData("showReadButton", !showReadButton)}
                />
                <QuizCheckbox
                  id="show-trans-checkbox"
                  label={t("common.translation")}
                  checked={showTransButton}
                  onChange={() => setStoreData("showTransButton", !showTransButton)}
                />
                <QuizCheckbox
                  id="show-answer-checkbox"
                  label={t("common.showAnswer")}
                  checked={showAnswer}
                  onChange={() => setShowAnswer(!showAnswer)}
                />
              </>
            }
            footer={
              <ModalAnswer title={`${searchInfo.test} - ${searchInfo.level}`} />
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
    </JlptTestLayout>
  );
};

export default memo(JlptTestPage);
