"use client";
import { useJptStore } from "@/app/store/jptStore";
import Question from "../components/question";
import { memo, ReactNode, useState } from "react";
import ModalAnswer from "../components/modalAnswer";
import Loading from "@/app/components/Loading/loading";
import { useSession } from "next-auth/react";
import ModalConfirm from "@/app/components/Modals/ModalConfirm";
import JptLevelUpLayout from "@/app/components/Layout/JptLevelUpLayout";
import { useTranslations } from "@/app/providers/I18nProvider";
import QuizTestShell, { QuizCheckbox } from "@/app/components/Quiz/QuizTestShell";

const JptLevelUpTestPage = () => {
  const { t } = useTranslations();
  const { jptInfo, jptList, isLoading } = useJptStore((state: any) => state);
  const showAnswer = useJptStore((state: any) => state.showAnswer);
  const showReadButton = useJptStore((state: any) => state.showReadButton);
  const showTransButton = useJptStore((state: any) => state.showTransButton);
  const setStoreData = useJptStore((state: any) => state.setStoreData);

  const [confirmMsg, setConfirmMsg] = useState<ReactNode>("");
  const [confirmType, setConfirmType] = useState<any>("info");
  const [isShowConfirm, setShowConfirm] = useState<boolean>(false);
  const { data: session } = useSession();

  const handleChangeCheck = (key: string, value: any) => {
    if ("showTransButton" === key && !session?.paymentInfo?.isValid) {
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

  return (
    <JptLevelUpLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <div
          onContextMenu={(e) => e.preventDefault()}
          onMouseDown={(e) => e.preventDefault()}
        >
          <QuizTestShell
            mode="full"
            title={t("layout.jptLevelUp")}
            badge={jptInfo.level}
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
            footer={<ModalAnswer title={`JPT - ${jptInfo.level}`} />}
          >
            {jptList.map((questionInfo: any, idx: number) => (
              <Question key={`jpt-test-${idx}`} questionInfo={questionInfo} />
            ))}
          </QuizTestShell>
        </div>
      )}
    </JptLevelUpLayout>
  );
};

export default memo(JptLevelUpTestPage);
