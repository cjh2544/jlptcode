"use client";
import { useLevelUpStore } from "@/app/store/levelUpStore";
import Question from "../components/question";
import { memo, ReactNode, useState } from "react";
import ModalAnswer from "../components/modalAnswer";
import LevelUpLayout from "@/app/components/Layout/LevelUpLayout";
import Loading from "@/app/components/Loading/loading";
import { useSession } from "next-auth/react";
import ModalConfirm from "@/app/components/Modals/ModalConfirm";
import { useTranslations } from "@/app/providers/I18nProvider";
import QuizTestShell, { QuizCheckbox } from "@/app/components/Quiz/QuizTestShell";

const LevelUpTestPage = () => {
  const { t } = useTranslations();
  const { levelUpInfo, levelUpList, isLoading } = useLevelUpStore((state: any) => state);
  const showAnswer = useLevelUpStore((state: any) => state.showAnswer);
  const showReadButton = useLevelUpStore((state: any) => state.showReadButton);
  const showTransButton = useLevelUpStore((state: any) => state.showTransButton);
  const showSpeakButton = useLevelUpStore((state: any) => state.showSpeakButton);
  const setStoreData = useLevelUpStore((state: any) => state.setStoreData);

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
    <LevelUpLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <div
          onContextMenu={(e) => e.preventDefault()}
          onMouseDown={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button, input, audio, a, label, .app-speech-player")) return;
            e.preventDefault();
          }}
        >
          <QuizTestShell
            mode="full"
            title={t("layout.levelUp")}
            badge={levelUpInfo.level}
            toolbar={
              <>
                <QuizCheckbox
                  id="show-read-checkbox"
                  label={
                    levelUpInfo.classification === "listening"
                      ? t("common.sentence")
                      : t("common.read")
                  }
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
                {levelUpInfo.classification !== "listening" &&
                  levelUpInfo.classification !== "reading" && (
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
            footer={<ModalAnswer title={`Level up - ${levelUpInfo.level}`} />}
          >
            {levelUpList.map((questionInfo: any, idx: number) => (
              <Question key={`levelUp-test-${idx}`} questionInfo={questionInfo} />
            ))}
          </QuizTestShell>
        </div>
      )}
    </LevelUpLayout>
  );
};

export default memo(LevelUpTestPage);
