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
import { useMypageProgress } from "@/app/swr/useMypage";
import { useTranslations } from "@/app/providers/I18nProvider";
import { formatInSeoul } from "@/app/utils/common";
import { useMemo } from "react";

export default function ProgressPage() {
  const { t } = useTranslations();
  const { items, history, isLoading } = useMypageProgress();
  const theme = useChartTheme();
  const narrow = useNarrowScreen();
  const visible = useMemo(
    () => items.filter((item: any) => item.attemptCount > 0),
    [items],
  );
  const labels = useMemo(
    () => visible.map((item: any) => t(`mypage.subject.${item.subject}`)),
    [t, visible],
  );
  const colors = useMemo(() => palette(visible.length, theme.charts), [theme.charts, visible.length]);

  const doughnutConfig = useMemo(
    () => ({
      type: "doughnut" as const,
      data: {
        labels,
        datasets: [
          {
            data: visible.map((item: any) => item.attemptCount),
            backgroundColor: colors,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: "easeOutQuart" as const },
        cutout: narrow ? "52%" : "58%",
        plugins: {
          legend: chartLegend(theme.muted, narrow),
        },
      },
    }),
    [colors, labels, narrow, theme.muted, visible],
  );

  const barConfig = useMemo(
    () => ({
      type: "bar" as const,
      data: {
        labels,
        datasets: [
          {
            label: t("mypage.accuracy"),
            data: visible.map((item: any) => item.latest?.accuracy ?? 0),
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
              minRotation: 0,
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

  const lineConfig = useMemo(
    () => ({
      type: "line" as const,
      data: {
        labels: history.map((item: any) =>
          narrow
            ? formatInSeoul(item.createdAt, "MM-dd")
            : `${formatInSeoul(item.createdAt, "MM-dd HH:mm")} ${t(`mypage.subject.${item.subject}`)}`,
        ),
        datasets: [
          {
            label: t("mypage.accuracy"),
            data: history.map((item: any) => item.accuracy),
            borderColor: theme.charts[0],
            backgroundColor: theme.charts[0],
            tension: 0.35,
            fill: false,
            pointRadius: narrow ? 2 : 4,
            pointHoverRadius: narrow ? 4 : 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: "easeOutQuart" as const },
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: {
              color: theme.muted,
              font: chartFont(narrow),
              maxRotation: narrow ? 0 : 50,
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
    [history, narrow, t, theme.border, theme.charts, theme.muted],
  );

  return (
    <MypagePanel titleKey="mypage.progress">
      {isLoading ? (
        <p className="text-sm text-muted-foreground">{t("common.processing")}</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("common.noData")}</p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <div className="app-mypage-chart-grid">
            <ChartCard title={t("mypage.chartAttemptsShare")}>
              <StudyChart config={doughnutConfig} />
            </ChartCard>
            <ChartCard title={t("mypage.chartLatestAccuracy")}>
              <StudyChart config={barConfig} />
            </ChartCard>
            {history.length > 1 && (
              <ChartCard title={t("mypage.chartScoreTrend")} wide>
                <StudyChart config={lineConfig} className="app-mypage-chart app-mypage-chart--lg" />
              </ChartCard>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {visible.map((item: any) => (
              <div key={item.subject} className="rounded-xl border border-border bg-card p-3 sm:p-4">
                <h3 className="mb-3 text-base font-bold text-foreground">
                  {t(`mypage.subject.${item.subject}`)}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="app-score-stat">
                    <span className="app-score-stat-label">{t("mypage.attempts")}</span>
                    <span className="app-score-stat-value app-score-stat-value--total">
                      {item.attemptCount}
                    </span>
                  </div>
                  <div className="app-score-stat">
                    <span className="app-score-stat-label">{t("mypage.recentScore")}</span>
                    <span className="app-score-stat-value app-score-stat-value--correct">
                      {item.latest ? `${item.latest.correct}/${item.latest.total}` : "-"}
                    </span>
                  </div>
                </div>
                {item.latest?.createdAt && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    {t("mypage.recentAt")}: {formatInSeoul(item.latest.createdAt, "yyyy-MM-dd HH:mm")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </MypagePanel>
  );
}
