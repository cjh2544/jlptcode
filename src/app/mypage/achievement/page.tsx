"use client";

import MypagePanel from "@/app/mypage/components/MypagePanel";
import StudyChart, {
  ChartCard,
  chartFont,
  chartLegend,
  palette,
  useChartTheme,
  useNarrowScreen,
} from "@/app/mypage/components/StudyChart";
import { useMypageAchievement } from "@/app/swr/useMypage";
import { useTranslations } from "@/app/providers/I18nProvider";
import { useMemo } from "react";

export default function AchievementPage() {
  const { t } = useTranslations();
  const { items, isLoading } = useMypageAchievement();
  const theme = useChartTheme();
  const narrow = useNarrowScreen();
  const visible = useMemo(
    () => items.filter((item: any) => item.solved > 0),
    [items],
  );
  const labels = useMemo(
    () => visible.map((item: any) => t(`mypage.subject.${item.subject}`)),
    [t, visible],
  );
  const colors = useMemo(() => palette(visible.length, theme.charts), [theme.charts, visible.length]);
  const totalCorrect = visible.reduce((sum: number, item: any) => sum + item.correct, 0);
  const totalWrong = visible.reduce((sum: number, item: any) => sum + item.wrong, 0);

  const pieConfig = useMemo(
    () => ({
      type: "pie" as const,
      data: {
        labels: [t("quiz.correct"), t("quiz.wrong")],
        datasets: [
          {
            data: [totalCorrect, totalWrong],
            backgroundColor: [theme.correct, theme.wrong],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: "easeOutQuart" as const },
        plugins: {
          legend: chartLegend(theme.muted, narrow),
        },
      },
    }),
    [narrow, t, theme.correct, theme.muted, theme.wrong, totalCorrect, totalWrong],
  );

  const accuracyBarConfig = useMemo(
    () => ({
      type: "bar" as const,
      data: {
        labels,
        datasets: [
          {
            label: t("mypage.accuracy"),
            data: visible.map((item: any) => item.accuracy),
            backgroundColor: colors,
            borderRadius: 8,
            maxBarThickness: narrow ? 20 : 36,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: "easeOutQuart" as const },
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: {
              color: theme.muted,
              font: chartFont(narrow),
              maxRotation: narrow ? 0 : 45,
              autoSkip: true,
              maxTicksLimit: narrow ? 4 : 8,
            },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: theme.muted,
              font: chartFont(narrow),
              callback: (value: string | number) => `${value}%`,
            },
            grid: { color: theme.border },
          },
        },
      },
    }),
    [colors, labels, narrow, t, theme.border, theme.muted, visible],
  );

  const solvedBarConfig = useMemo(
    () => ({
      type: "bar" as const,
      data: {
        labels,
        datasets: [
          {
            label: t("quiz.correct"),
            data: visible.map((item: any) => item.correct),
            backgroundColor: theme.correct,
            borderRadius: 6,
            maxBarThickness: narrow ? 14 : 22,
          },
          {
            label: t("quiz.wrong"),
            data: visible.map((item: any) => item.wrong),
            backgroundColor: theme.wrong,
            borderRadius: 6,
            maxBarThickness: narrow ? 14 : 22,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y" as const,
        animation: { duration: 800, easing: "easeOutQuart" as const },
        plugins: {
          legend: chartLegend(theme.muted, narrow),
        },
        scales: {
          x: {
            stacked: true,
            beginAtZero: true,
            ticks: { color: theme.muted, font: chartFont(narrow), precision: 0 },
            grid: { color: theme.border },
          },
          y: {
            stacked: true,
            ticks: { color: theme.muted, font: chartFont(narrow), autoSkip: false },
            grid: { display: false },
          },
        },
      },
    }),
    [labels, narrow, t, theme.border, theme.correct, theme.muted, theme.wrong, visible],
  );

  return (
    <MypagePanel titleKey="mypage.achievement">
      {isLoading ? (
        <p className="text-sm text-muted-foreground">{t("common.processing")}</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("common.noData")}</p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <div className="app-mypage-chart-grid">
            <ChartCard title={t("mypage.chartCorrectWrong")}>
              <StudyChart config={pieConfig} />
            </ChartCard>
            <ChartCard title={t("mypage.chartAccuracyBySubject")}>
              <StudyChart config={accuracyBarConfig} />
            </ChartCard>
            <ChartCard title={t("mypage.chartSolvedBySubject")} wide>
              <StudyChart config={solvedBarConfig} className="app-mypage-chart app-mypage-chart--lg" />
            </ChartCard>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {visible.map((item: any) => (
              <div key={item.subject} className="rounded-xl border border-border bg-card p-3 sm:p-4">
                <h3 className="mb-3 text-base font-bold text-foreground">
                  {t(`mypage.subject.${item.subject}`)}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="app-score-stat">
                    <span className="app-score-stat-label">{t("mypage.solved")}</span>
                    <span className="app-score-stat-value app-score-stat-value--total">
                      {item.solved}
                    </span>
                  </div>
                  <div className="app-score-stat">
                    <span className="app-score-stat-label">{t("quiz.correct")}</span>
                    <span className="app-score-stat-value app-score-stat-value--correct">
                      {item.correct}
                    </span>
                  </div>
                  <div className="app-score-stat">
                    <span className="app-score-stat-label">{t("quiz.wrong")}</span>
                    <span className="app-score-stat-value app-score-stat-value--wrong">
                      {item.wrong}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {t("mypage.accuracy")}: {t("mypage.percent").replace("{n}", String(item.accuracy))}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </MypagePanel>
  );
}
